import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "clave_secreta_super_segura_para_la_uci"
);

export async function PUT() {
    try {
        const cookieStore = await import("next/headers").then((m) => m.cookies());
        const token = cookieStore.get("auth_token");
        if (!token) {
            return NextResponse.json({ success: false, message: "No autenticado" }, { status: 401 });
        }

        const { payload } = await jwtVerify(token.value, JWT_SECRET);
        const usuarioId = Number(payload.id);

        await prisma.notificacion.updateMany({
            where: { usuarioId, leida: false },
            data: { leida: true },
        });

        return NextResponse.json({ success: true, message: "Todas las notificaciones marcadas como leídas" }, { status: 200 });
    } catch (error) {
        console.error("Error en PUT /api/notificaciones/leer-todas:", error);
        return NextResponse.json(
            { success: false, message: "Error al marcar notificaciones como leídas" },
            { status: 500 }
        );
    }
}
