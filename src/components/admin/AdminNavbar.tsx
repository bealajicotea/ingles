import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "clave_secreta_super_segura_para_la_uci"
);

export default async function AdminNavbar() {
    let username = "";

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token");
        if (token) {
            const { payload } = await jwtVerify(token.value, JWT_SECRET);
            username = payload.username as string;
        }
    } catch {
        // Token inválido, mostrar sin nombre
    }

    return (
        <nav className="bg-zinc-950 border-b border-zinc-800 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-8">
                        <Link href="/admin" className="text-xl font-bold tracking-wider text-indigo-400">
                            UCI - Panel Admin
                        </Link>
                        <div className="hidden md:flex items-center space-x-4">
                            <Link
                                href="/admin/convocatorias"
                                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-zinc-800 transition"
                            >
                                Convocatorias
                            </Link>
                            <Link
                                href="/admin/usuarios"
                                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-zinc-800 transition"
                            >
                                Usuarios
                            </Link>
                            <Link
                                href="/admin/calificaciones"
                                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-zinc-800 transition"
                            >
                                Calificaciones
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {username && (
                            <span className="text-xs text-zinc-400 font-mono">{username} · ADMIN</span>
                        )}
                        <form action={async () => {
                            "use server";
                            const c = await cookies();
                            c.delete("auth_token");
                            redirect("/login");
                        }}>
                            <button
                                type="submit"
                                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-medium transition"
                            >
                                Cerrar Sesión
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </nav>
    );
}
