"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
    const { usuario, logout } = useAuth();

    return (
        <nav className="bg-zinc-950 border-b border-zinc-800 text-white p-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <div className="flex space-x-6 items-center">
                    <span className="font-bold text-indigo-400 text-xl tracking-tight">UCI Portal</span>

                    {usuario?.rol === "ESTUDIANTE" && (
                        <div className="flex space-x-4 text-sm text-slate-300">
                            <Link href="/convocatorias" className="hover:text-white transition">Convocatorias</Link>
                            <Link href="/mis-inscripciones" className="hover:text-white transition">Mis Inscripciones</Link>
                        </div>
                    )}
                    {usuario?.rol === "ADMIN" && (
                        <div className="flex space-x-4 text-sm text-slate-300">
                            <Link href="/admin/convocatorias" className="hover:text-white transition">Convocatorias</Link>
                            <Link href="/admin/usuarios" className="hover:text-white transition">Usuarios</Link>
                            <Link href="/admin/calificaciones" className="hover:text-white transition">Calificaciones</Link>
                        </div>
                    )}
                </div>

                <div>
                    {usuario ? (
                        <div className="flex items-center space-x-3">
                            <NotificationBell />
                            <Link href={`/perfil/${usuario.id}`} className="text-xs bg-zinc-800 px-2.5 py-1 rounded text-zinc-300 font-mono hover:bg-zinc-700 transition">
                                {usuario.username} ({usuario.rol})
                            </Link>
                            <button
                                onClick={logout}
                                className="text-xs bg-red-600 hover:bg-red-500 px-3 py-1.5 rounded transition font-medium text-white cursor-pointer"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    ) : (
                        <Link href="/login" className="text-sm bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded transition font-medium">
                            Iniciar Sesión
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
