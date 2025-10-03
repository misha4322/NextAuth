import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    // Возвращаем информацию о токене (без чувствительных данных)
    return NextResponse.json({
      valid: true,
      user: {
        id: token.sub,
        email: token.email,
        provider: token.provider,
      },
      issuedAt: new Date(token.iat * 1000).toISOString(),
      expiresAt: new Date(token.exp * 1000).toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
