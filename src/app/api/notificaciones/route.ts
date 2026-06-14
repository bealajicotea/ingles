import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const notificaciones = await prisma.notificacion.findMany({
            include: { usuario: { select: { id: true, username: true } } },
            orderBy: { createdAt: "desc" },
            take: 100,
        });
        return NextResponse.json({ success: true, data: notificaciones }, { status: 200 });
    } catch (error) {
        console.error("Error en GET /api/notificaciones:", error);
        return NextResponse.json(
            { success: false, message: "Error al obtener notificaciones" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = Number(searchParams.get("id"));

        if (!id) {
            return NextResponse.json(
                { success: false, message: "ID de notificación requerido." },
                { status: 400 }
            );
        }

        const actualizada = await prisma.notificacion.update({
            where: { id },
            data: { leida: true },
        });

        return NextResponse.json({ success: true, data: actualizada }, { status: 200 });
    } catch (error) {
        console.error("Error en PUT /api/notificaciones:", error);
        return NextResponse.json(
            { success: false, message: "Error al marcar notificación como leída" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = Number(searchParams.get("id"));

        if (!id) {
            return NextResponse.json(
                { success: false, message: "ID de notificación requerido." },
                { status: 400 }
            );
        }

        await prisma.notificacion.delete({ where: { id } });

        return NextResponse.json({ success: true, message: "Notificación eliminada" }, { status: 200 });
    } catch (error) {
        console.error("Error en DELETE /api/notificaciones:", error);
        return NextResponse.json(
            { success: false, message: "Error al eliminar notificación" },
            { status: 500 }
        );
    }
}
