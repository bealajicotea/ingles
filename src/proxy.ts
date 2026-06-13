import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "clave_secreta_super_segura_para_la_uci"
);

export async function proxy(request: NextRequest) {
    const token = request.cookies.get("auth_token")?.value;
    const pathname = request.nextUrl.pathname;

    const isPublicRoute = pathname === "/login" || pathname === "/register";

    if (!token) {
        if (isPublicRoute) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const rol = payload.rol || payload.tipoDeUsuario;

        if (isPublicRoute || pathname === "/" || pathname === "") {
            if (rol === "ADMIN") {
                return NextResponse.redirect(new URL("/admin", request.url));
            }
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        if (pathname.startsWith("/admin") && rol !== "ADMIN") {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        if ((pathname.startsWith("/convocatorias") || pathname.startsWith("/mis-inscripciones") || pathname.startsWith("/dashboard")) && rol !== "ESTUDIANTE") {
            return NextResponse.redirect(new URL("/admin", request.url));
        }

        return NextResponse.next();
    } catch {
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: ["/", "/login", "/dashboard", "/convocatorias", "/mis-inscripciones", "/admin/:path*"],
};
