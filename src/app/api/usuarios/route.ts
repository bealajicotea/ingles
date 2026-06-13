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
                rol: true,
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
            username, email, password, firstName, lastName, rol,
            facultad, anoEscolar, grupo, carrera, curso, nivel
        } = body;

        if (!username || !password) {
            return NextResponse.json(
                { success: false, message: "Faltan campos obligatorios" },
                { status: 400 }
            );
        }

        const existingByUsername = await prisma.usuario.findUnique({
            where: { username },
        });

        if (existingByUsername) {
            return NextResponse.json(
                { success: false, message: "El username ya existe" },
                { status: 400 }
            );
        }

        if (email) {
            const existingByEmail = await prisma.usuario.findUnique({
                where: { email },
            });
            if (existingByEmail) {
                return NextResponse.json(
                    { success: false, message: "El email ya existe" },
                    { status: 400 }
                );
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const nuevoUsuario = await prisma.usuario.create({
            data: {
                username,
                ...(email && { email }),
                ...(firstName && { firstName }),
                ...(lastName && { lastName }),
                password: hashedPassword,
                rol: rol || "ESTUDIANTE",
                ...(facultad && { facultad }),
                ...(anoEscolar && { anoEscolar: parseInt(anoEscolar, 10) }),
                ...(grupo && { grupo }),
                ...(carrera && { carrera }),
                ...(curso && { curso }),
                ...(nivel && { nivel }),
            },
            select: {
                id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
                rol: true,
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
        const { username, email, password, firstName, lastName, rol } = body;

        const updateData: any = {};
        if (username !== undefined) updateData.username = username;
        if (email !== undefined) updateData.email = email;
        if (firstName !== undefined) updateData.firstName = firstName;
        if (lastName !== undefined) updateData.lastName = lastName;
        if (rol !== undefined) updateData.rol = rol;
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
                rol: true,
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
