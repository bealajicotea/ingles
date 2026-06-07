import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET: Obtener todas las convocatorias
 * Endpoint: /api/convocatorias
 */
export async function GET() {
    try {
        const convocatorias = await prisma.convocatoria.findMany({
            orderBy: { fecha: "asc" },
        });
        return NextResponse.json({ success: true, data: convocatorias }, { status: 200 });
    } catch (error) {
        console.error("Error en GET /api/convocatorias:", error);
        return NextResponse.json(
            { success: false, message: "Error al obtener las convocatorias" },
            { status: 500 }
        );
    }
}

/**
 * POST: Crear una nueva convocatoria (Solo Admin lógicamente)
 * Endpoint: /api/convocatorias
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { tipo, descripcion, lugar, fecha, hora, profesor, nivel, estado } = body;

        // Validación de campos requeridos obligatorios
        if (!tipo || !descripcion || !lugar || !fecha || !hora || !profesor || !nivel) {
            return NextResponse.json(
                { success: false, message: "Faltan campos obligatorios para la convocatoria." },
                { status: 400 }
            );
        }

        // Insertar en la DB local usando los tipos de tu esquema
        const nuevaConvocatoria = await prisma.convocatoria.create({
            data: {
                tipo,
                descripcion,
                lugar,
                fecha: new Date(fecha), // Convertimos el string string de la fecha (YYYY-MM-DD) a DateTime de JS
                hora,
                profesor,
                nivel,
                estado: estado || "ABIERTA",
            },
        });

        return NextResponse.json(
            { success: true, message: "Convocatoria publicada con éxito", data: nuevaConvocatoria },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error en POST /api/convocatorias:", error);
        return NextResponse.json(
            { success: false, message: "Error interno al crear la convocatoria." },
            { status: 500 }
        );
    }
}

/**
 * PUT: Actualizar una convocatoria existente
 * Endpoint: /api/convocatorias?id=1
 */
export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = Number(searchParams.get("id"));
        if (!id) {
            return NextResponse.json(
                { success: false, message: "ID de convocatoria requerido." },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { tipo, descripcion, lugar, fecha, hora, profesor, nivel, estado } = body;

        const actualizada = await prisma.convocatoria.update({
            where: { id },
            data: {
                ...(tipo !== undefined && { tipo }),
                ...(descripcion !== undefined && { descripcion }),
                ...(lugar !== undefined && { lugar }),
                ...(fecha !== undefined && { fecha: new Date(fecha) }),
                ...(hora !== undefined && { hora }),
                ...(profesor !== undefined && { profesor }),
                ...(nivel !== undefined && { nivel }),
                ...(estado !== undefined && { estado }),
            },
        });

        return NextResponse.json({ success: true, data: actualizada }, { status: 200 });
    } catch (error) {
        console.error("Error en PUT /api/convocatorias:", error);
        return NextResponse.json(
            { success: false, message: "Error al actualizar la convocatoria." },
            { status: 500 }
        );
    }
}

/**
 * DELETE: Eliminar una convocatoria
 * Endpoint: /api/convocatorias?id=1
 */
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = Number(searchParams.get("id"));
        if (!id) {
            return NextResponse.json(
                { success: false, message: "ID de convocatoria requerido." },
                { status: 400 }
            );
        }

        await prisma.inscripcion.deleteMany({
            where: { convocatoriaId: id },
        });

        await prisma.convocatoria.delete({
            where: { id },
        });

        return NextResponse.json({ success: true, message: "Convocatoria eliminada." }, { status: 200 });
    } catch (error) {
        console.error("Error en DELETE /api/convocatorias:", error);
        return NextResponse.json(
            { success: false, message: "Error al eliminar la convocatoria." },
            { status: 500 }
        );
    }
}