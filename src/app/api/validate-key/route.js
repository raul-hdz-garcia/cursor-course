import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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

    const { data, error } = await supabase
      .from(TABLE)
      .select("id")
      .eq("key", apiKey)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { valid: false, error: "Invalid API key" },
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
  } catch {
    return NextResponse.json(
      { valid: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}
