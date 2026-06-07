import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        const usuarios = await prisma.usuario.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
                tipoDeUsuario: true,
            },
            orderBy: { id: "desc" },
        });

        return NextResponse.json({ success: true, data: usuarios }, { status: 200 });
    } catch (error) {
        console.error("Error en GET /api/usuarios:", error);
        return NextResponse.json(
            { success: false, message: "Error al obtener usuarios" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const {
            username, email, password, firstName, lastName, tipoDeUsuario,
            facultad, anoEscolar, grupo, carrera, curso, nivel
        } = body;

        if (!username || !email || !password || !firstName || !lastName) {
            return NextResponse.json(
                { success: false, message: "Faltan campos obligatorios" },
                { status: 400 }
            );
        }

        const userExists = await prisma.usuario.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });

        if (userExists) {
            return NextResponse.json(
                { success: false, message: "El username o el email ya existen" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const nuevoUsuario = await prisma.usuario.create({
            data: {
                username,
                email,
                password: hashedPassword,
                firstName,
                lastName,
                tipoDeUsuario: tipoDeUsuario || "ESTUDIANTE",
                facultad,
                anoEscolar: anoEscolar ? parseInt(anoEscolar, 10) : null,
                grupo,
                carrera,
                curso,
                nivel,
            },
            select: {
                id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
                tipoDeUsuario: true,
            },
        });

        return NextResponse.json(
            { success: true, message: "Usuario creado", data: nuevoUsuario },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error en POST /api/usuarios:", error);
        return NextResponse.json(
            { success: false, message: "Error interno del servidor" },
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
                { success: false, message: "ID de usuario requerido." },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { username, email, password, firstName, lastName, tipoDeUsuario } = body;

        const updateData: any = {};
        if (username !== undefined) updateData.username = username;
        if (email !== undefined) updateData.email = email;
        if (firstName !== undefined) updateData.firstName = firstName;
        if (lastName !== undefined) updateData.lastName = lastName;
        if (tipoDeUsuario !== undefined) updateData.tipoDeUsuario = tipoDeUsuario;
        if (password !== undefined && password !== "") {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const actualizado = await prisma.usuario.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
                tipoDeUsuario: true,
            },
        });

        return NextResponse.json({ success: true, data: actualizado }, { status: 200 });
    } catch (error) {
        console.error("Error en PUT /api/usuarios:", error);
        return NextResponse.json(
            { success: false, message: "Error al actualizar el usuario." },
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
                { success: false, message: "ID de usuario requerido." },
                { status: 400 }
            );
        }

        await prisma.inscripcion.deleteMany({
            where: { usuarioId: id },
        });

        await prisma.usuario.delete({
            where: { id },
        });

        return NextResponse.json({ success: true, message: "Usuario eliminado." }, { status: 200 });
    } catch (error) {
        console.error("Error en DELETE /api/usuarios:", error);
        return NextResponse.json(
            { success: false, message: "Error al eliminar el usuario." },
            { status: 500 }
        );
    }
}
