import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSupabase } from "@/lib/supabase";

const USERS_TABLE = "users";

/**
 * Resolves Supabase `users.id` for the current session by reading the
 * signed-in user email from the session and looking up the `users` row in Supabase.
 */
export async function requireUserFromSession() {
  const session = await getServerSession(authOptions);
  const email =
    session?.user?.email && typeof session.user.email === "string"
      ? session.user.email.trim()
      : "";
  if (!email) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from(USERS_TABLE)
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    return {
      error: NextResponse.json(
        { error: "Failed to load user" },
        { status: 500 }
      ),
    };
  }
  if (!data?.id) {
    return {
      error: NextResponse.json(
        { error: "User not found. Sign in again to sync your account." },
        { status: 403 }
      ),
    };
  }

  return { supabase, userId: data.id, email };
}

export function rowToApiKeyItem(row) {
  return {
    id: row.id,
    name: row.name ?? "",
    key: row.key ?? "",
    prefix: row.prefix ?? "",
    createdAt: row.created_at ?? "",
    updatedAt: row.updated_at ?? "",
  };
}
