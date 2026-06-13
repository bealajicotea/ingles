import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "clave_secreta_super_segura_para_la_uci"
);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json(
                { success: false, message: "Usuario y contraseña requeridos." },
                { status: 400 }
            );
        }

        // 1. Buscar usuario en la base de datos
        const usuario = await prisma.usuario.findUnique({
            where: { username },
        });

        if (!usuario) {
            return NextResponse.json(
                { success: false, message: "Credenciales incorrectas." },
                { status: 401 }
            );
        }

        // 2. Verificar contraseña encriptada
        const passwordValido = await bcrypt.compare(password, usuario.password);
        if (!passwordValido) {
            return NextResponse.json(
                { success: false, message: "Credenciales incorrectas." },
                { status: 401 }
            );
        }

        // 3. Crear el payload del JWT con los datos necesarios (incluyendo el rol)
        const token = await new SignJWT({
            id: usuario.id,
            username: usuario.username,
            rol: usuario.rol, // 'ADMIN' o 'ESTUDIANTE'
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("2h") // Expira en 2 horas
            .sign(JWT_SECRET);

        // 4. Guardar el token en una cookie HttpOnly segura
        const cookieStore = await cookies();
        cookieStore.set("auth_token", token, {
            httpOnly: true, // No accesible desde JavaScript en el navegador
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 2, // 2 horas en segundos
            path: "/",
        });

        return NextResponse.json(
            {
                success: true,
                message: "Login exitoso",
                token,
                usuario: {
                    id: usuario.id,
                    username: usuario.username,
                    rol: usuario.rol,
                },
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error en POST /api/auth/login:", error);
        return NextResponse.json(
            { success: false, message: "Error interno en el servidor." },
            { status: 500 }
        );
    }
}