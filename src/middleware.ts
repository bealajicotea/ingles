import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "clave_secreta_super_segura_para_la_uci"
);

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const pathname = request.nextUrl.pathname;

        if (pathname.startsWith("/admin") && payload.tipoDeUsuario !== "ADMIN") {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        return NextResponse.next();
    } catch {
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: ["/dashboard", "/mis-inscripciones", "/admin/:path*"],
};
