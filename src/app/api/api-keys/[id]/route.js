import { NextResponse } from "next/server";
import { requireUserFromSession, rowToApiKeyItem } from "@/lib/api-auth";
import { API_KEYS_TABLE, randomApiKey } from "@/lib/api-key-utils";

function notFound() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function GET(_request, segmentContext) {
  const params = await segmentContext.params;
  const id = params?.id;
  if (!id) return notFound();

  const ctx = await requireUserFromSession();
  if (ctx.error) return ctx.error;
  const { supabase, userId } = ctx;

  const { data, error } = await supabase
    .from(API_KEYS_TABLE)
    .select("id, name, key, prefix, created_at, updated_at, usage, usage_limit")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) return notFound();
  return NextResponse.json({ data: rowToApiKeyItem(data) });
}

export async function PATCH(request, segmentContext) {
  const params = await segmentContext.params;
  const id = params?.id;
  if (!id) return notFound();

  const ctx = await requireUserFromSession();
  if (ctx.error) return ctx.error;
  const { supabase, userId } = ctx;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const hasName = typeof body.name === "string" && body.name.trim() !== "";
  const rotate = body.rotate === true;
  if (!hasName && !rotate) {
    return NextResponse.json(
      { error: "Provide name (string) and/or rotate: true" },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();
  const updates = { updated_at: now };
  if (hasName) {
    updates.name = body.name.trim();
  }
  if (rotate) {
    const key = randomApiKey();
    updates.key = key;
    updates.prefix = key.slice(0, 12);
  }

  const { data, error } = await supabase
    .from(API_KEYS_TABLE)
    .update(updates)
    .eq("id", id)
    .eq("user_id", userId)
    .select("id, name, key, prefix, created_at, updated_at, usage, usage_limit")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) return notFound();
  return NextResponse.json({ data: rowToApiKeyItem(data) });
}

export async function DELETE(_request, segmentContext) {
  const params = await segmentContext.params;
  const id = params?.id;
  if (!id) return notFound();

  const ctx = await requireUserFromSession();
  if (ctx.error) return ctx.error;
  const { supabase, userId } = ctx;

  const { data, error } = await supabase
    .from(API_KEYS_TABLE)
    .delete()
    .eq("id", id)
    .eq("user_id", userId)
    .select("id");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data?.length) return notFound();
  return new NextResponse(null, { status: 204 });
}
