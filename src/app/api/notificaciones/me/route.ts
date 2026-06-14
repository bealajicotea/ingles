import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "clave_secreta_super_segura_para_la_uci"
);

export async function GET() {
    try {
        const cookieStore = await import("next/headers").then((m) => m.cookies());
        const token = cookieStore.get("auth_token");
        if (!token) {
            return NextResponse.json({ success: false, message: "No autenticado" }, { status: 401 });
        }

        const { payload } = await jwtVerify(token.value, JWT_SECRET);
        const usuarioId = Number(payload.id);

        const notificaciones = await prisma.notificacion.findMany({
            where: { usuarioId },
            orderBy: { createdAt: "desc" },
            take: 50,
        });

        const noLeidas = notificaciones.filter((n) => !n.leida).length;

        return NextResponse.json({ success: true, data: notificaciones, noLeidas }, { status: 200 });
    } catch (error) {
        console.error("Error en GET /api/notificaciones/me:", error);
        return NextResponse.json(
            { success: false, message: "Error al obtener notificaciones" },
            { status: 500 }
        );
    }
}
