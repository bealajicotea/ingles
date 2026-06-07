import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, email, password, firstName, lastName } = body;

        if (!username || !email || !password || !firstName || !lastName) {
            return NextResponse.json(
                { success: false, message: "Faltan campos obligatorios." },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { success: false, message: "La contraseña debe tener al menos 6 caracteres." },
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
                { success: false, message: "El usuario o email ya está registrado." },
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
                tipoDeUsuario: "ESTUDIANTE",
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
            { success: true, data: nuevoUsuario },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error en POST /api/auth/register:", error);
        return NextResponse.json(
            { success: false, message: "Error interno del servidor." },
            { status: 500 }
        );
    }
}
