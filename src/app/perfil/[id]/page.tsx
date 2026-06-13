"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";

interface PerfilUsuario {
    id: number;
    username: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    rol: string;
    facultad: string | null;
    anoEscolar: number | null;
    grupo: string | null;
    carrera: string | null;
    curso: string | null;
    nivel: string | null;
    certificado: boolean;
}

export default function PerfilPage() {
    const { id } = useParams<{ id: string }>();
    const { usuario } = useAuth();
    const router = useRouter();
    const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!usuario) {
            router.push("/login");
            return;
        }
        fetch(`/api/usuarios?id=${id}`)
            .then((res) => res.json())
            .then((json) => {
                if (json.success) {
                    setPerfil(json.data);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id, usuario, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
                <p className="animate-pulse">Cargando perfil...</p>
            </div>
        );
    }

    if (!perfil) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
                <p className="text-red-400">Usuario no encontrado</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col">
            <Navbar />

            <main className="flex-1 p-8 max-w-3xl w-full mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Perfil de {perfil.firstName || perfil.username}</h1>
                    <p className="text-sm text-slate-400">Información detallada del usuario</p>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Nombre</label>
                            <p className="text-white font-medium">{perfil.firstName || "—"}</p>
                        </div>
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Apellidos</label>
                            <p className="text-white font-medium">{perfil.lastName || "—"}</p>
                        </div>
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Usuario</label>
                            <p className="text-white font-medium">{perfil.username}</p>
                        </div>
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email</label>
                            <p className="text-white font-medium">{perfil.email || "—"}</p>
                        </div>
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Rol</label>
                            <p className="text-white font-medium">{perfil.rol}</p>
                        </div>
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Facultad</label>
                            <p className="text-white font-medium">{perfil.facultad || "—"}</p>
                        </div>
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Carrera</label>
                            <p className="text-white font-medium">{perfil.carrera || "—"}</p>
                        </div>
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Curso</label>
                            <p className="text-white font-medium">{perfil.curso || "—"}</p>
                        </div>
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Grupo</label>
                            <p className="text-white font-medium">{perfil.grupo || "—"}</p>
                        </div>
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Año Escolar</label>
                            <p className="text-white font-medium">{perfil.anoEscolar ?? "—"}</p>
                        </div>
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Nivel de Idioma</label>
                            <p className="text-white font-medium">{perfil.nivel || "—"}</p>
                        </div>
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Certificado</label>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${perfil.certificado ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-800 text-zinc-400"}`}>
                                {perfil.certificado ? "Certificado" : "No certificado"}
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => router.back()}
                    className="rounded bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition"
                >
                    ← Volver
                </button>
            </main>
        </div>
    );
}
