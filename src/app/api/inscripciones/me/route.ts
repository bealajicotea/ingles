import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import prisma from "@/lib/prisma";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "clave_secreta_super_segura_para_la_uci"
);

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token");

        if (!token) {
            return NextResponse.json(
                { success: false, message: "No autenticado." },
                { status: 401 }
            );
        }

        const { payload } = await jwtVerify(token.value, JWT_SECRET);
        const usuarioId = Number(payload.id);

        const inscripciones = await prisma.inscripcion.findMany({
            where: { usuarioId },
            include: { convocatoria: true },
            orderBy: { id: "desc" },
        });

        return NextResponse.json({ success: true, data: inscripciones }, { status: 200 });

    } catch (error) {
        console.error("Error en GET /api/inscripciones/me:", error);
        return NextResponse.json(
            { success: false, message: "No autenticado." },
            { status: 401 }
        );
    }
}
