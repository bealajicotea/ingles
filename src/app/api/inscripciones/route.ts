import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET: Obtener todas las inscripciones (útil para que el Admin vea quién se inscribió y califique)
 */
export async function GET() {
    try {
        const inscripciones = await prisma.inscripcion.findMany({
            include: {
                usuario: {
                    select: { id: true, firstName: true, lastName: true, email: true, username: true }
                },
                convocatoria: true,
            },
            orderBy: { id: "desc" },
        });
        return NextResponse.json({ success: true, data: inscripciones }, { status: 200 });
    } catch (error) {
        console.error("Error en GET /api/inscripciones:", error);
        return NextResponse.json({ success: false, message: "Error al obtener inscripciones" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = Number(searchParams.get("id"));
        if (!id) {
            return NextResponse.json(
                { success: false, message: "ID de inscripción requerido." },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { nota } = body;

        const nivelesValidos = ["A1", "A2", "B1", "B2", "C1", "C2"];
        if (nota !== null && !nivelesValidos.includes(nota)) {
            return NextResponse.json(
                { success: false, message: "La nota debe ser un nivel CEFR válido: A1, A2, B1, B2, C1, C2." },
                { status: 400 }
            );
        }

        const actualizada = await prisma.inscripcion.update({
            where: { id },
            data: { nota },
            include: {
                usuario: { select: { id: true, firstName: true, lastName: true, username: true, certificado: true } },
                convocatoria: true,
            },
        });

        const nivelesAprobados = ["A2", "B1", "B2", "C1", "C2"];
        const aprobado = nota !== null && nivelesAprobados.includes(nota);

        if (aprobado && !actualizada.usuario.certificado) {
            await prisma.usuario.update({
                where: { id: actualizada.usuario.id },
                data: { certificado: true },
            });
        }

        await prisma.notificacion.create({
            data: {
                usuarioId: actualizada.usuario.id,
                tipo: "NOTA_ASIGNADA",
                mensaje: `Se ha asignado tu nota para la convocatoria "${actualizada.convocatoria.descripcion}": ${nota || "—"}`,
                convocatoriaId: actualizada.convocatoria.id,
            },
        });

        const result = {
            ...actualizada,
            usuario: {
                ...actualizada.usuario,
                certificado: aprobado ? true : actualizada.usuario.certificado,
            },
        };

        return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error) {
        console.error("Error en PUT /api/inscripciones:", error);
        return NextResponse.json(
            { success: false, message: "Error al actualizar la inscripción." },
            { status: 500 }
        );
    }
}

/**
 * POST: Inscribir a un estudiante en una convocatoria
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { usuarioId, convocatoriaId } = body;

        if (!usuarioId || !convocatoriaId) {
            return NextResponse.json(
                { success: false, message: "Faltan parámetros obligatorios (usuarioId o convocatoriaId)." },
                { status: 400 }
            );
        }

        // 1. Verificar si ya existe la inscripción para evitar duplicados
        const existente = await prisma.inscripcion.findFirst({
            where: {
                usuarioId: Number(usuarioId),
                convocatoriaId: Number(convocatoriaId),
            },
        });

        if (existente) {
            return NextResponse.json(
                { success: false, message: "Ya estás inscrito en esta convocatoria." },
                { status: 400 }
            );
        }

        // 2. Crear la inscripción en la DB
        const nuevaInscripcion = await prisma.inscripcion.create({
            data: {
                usuarioId: Number(usuarioId),
                convocatoriaId: Number(convocatoriaId),
                nota: null, // La nota inicia vacía hasta que el Admin califique
            },
        });

        return NextResponse.json(
            { success: true, message: "Inscripción completada con éxito.", data: nuevaInscripcion },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error en POST /api/inscripciones:", error);
        return NextResponse.json(
            { success: false, message: "Error interno al procesar la inscripción." },
            { status: 500 }
        );
    }
}