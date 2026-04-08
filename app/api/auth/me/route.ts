import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/require-admin";

export async function GET() {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    username: session.username,
  });
}

