import { NextResponse } from "next/server";
import { requireUserFromSession, rowToApiKeyItem } from "@/lib/api-auth";
import { API_KEYS_TABLE, randomApiKey } from "@/lib/api-key-utils";

export async function GET() {
  const ctx = await requireUserFromSession();
  if (ctx.error) return ctx.error;

  const { supabase, userId } = ctx;
  const { data, error } = await supabase
    .from(API_KEYS_TABLE)
    .select("id, name, key, prefix, created_at, updated_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data: (data ?? []).map(rowToApiKeyItem) });
}

export async function POST(request) {
  const ctx = await requireUserFromSession();
  if (ctx.error) return ctx.error;
  const { supabase, userId } = ctx;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const key = randomApiKey();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from(API_KEYS_TABLE)
    .insert({
      name,
      key,
      prefix: key.slice(0, 12),
      user_id: userId,
      created_at: now,
      updated_at: now,
    })
    .select("id, name, key, prefix, created_at, updated_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data: rowToApiKeyItem(data) }, { status: 201 });
}
