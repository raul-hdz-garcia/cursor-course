import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

const TABLE = "api_keys";

export async function POST(request) {
  try {
    const body = await request.json();
    const apiKey = typeof body?.apiKey === "string" ? body.apiKey.trim() : "";

    if (!apiKey) {
      return NextResponse.json(
        { valid: false, error: "Missing or empty apiKey" },
        { status: 400 }
      );
    }

    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from(TABLE)
      .select("id")
      .eq("key", apiKey)
      .maybeSingle();

    if (error) {
      const isDev = process.env.NODE_ENV === "development";
      const detail = isDev
        ? { message: error.message, ...(error.cause && { cause: String(error.cause) }) }
        : undefined;
      return NextResponse.json(
        {
          valid: false,
          error: "Invalid API key",
          ...(detail && { detail }),
        },
        { status: 401 }
      );
    }

    if (data) {
      return NextResponse.json({
        valid: true,
        message: "Valid API key; /protected can be accessed",
      });
    }

    return NextResponse.json(
      { valid: false, error: "Invalid API key" },
      { status: 401 }
    );
  } catch (err) {
    const isDev = process.env.NODE_ENV === "development";
    return NextResponse.json(
      {
        valid: false,
        error: "Invalid request body",
        ...(isDev && err instanceof Error && { detail: err.message }),
      },
      { status: 400 }
    );
  }
}
