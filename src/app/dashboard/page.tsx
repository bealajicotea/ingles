"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";

export default function DashboardPage() {
    const { usuario } = useAuth();
    const router = useRouter();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (isHydrated && !usuario) {
            router.push("/login");
        }
    }, [isHydrated, usuario, router]);

    if (!isHydrated || !usuario) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center font-medium">
                Cargando espacio de trabajo...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col">
            <Navbar />

            <main className="flex-1 p-8 max-w-5xl w-full mx-auto space-y-6">
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
                    <h1 className="text-2xl font-bold text-purple-400">
                        ¡Hola de nuevo, {usuario.username}!
                    </h1>
                    <p className="text-slate-300 mt-1 text-sm">
                        Bienvenido al sistema unificado de convocatorias y exámenes institucionales.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-2">
                        <h2 className="text-lg font-semibold text-slate-200">Resumen del Perfil</h2>
                        <div className="text-sm text-slate-400 space-y-1">
                            <p><b>Rol asignado:</b> {usuario.tipoDeUsuario}</p>
                            <p><b>Identificador de cuenta:</b> #{usuario.id}</p>
                        </div>
                    </div>

                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-3 flex flex-col justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-200">Accesos Rápidos</h2>
                            <p className="text-sm text-slate-400">
                                {usuario.tipoDeUsuario === "ADMIN"
                                    ? "Tienes privilegios para emitir regulaciones, aperturar cursos y registrar calificaciones."
                                    : "Puedes revisar tus notas vigentes e inscribirte en convocatorias abiertas."}
                            </p>
                        </div>

                        <div className="space-y-2">
                            {usuario.tipoDeUsuario === "ADMIN" && (
                                <button
                                    onClick={() => router.push("/admin/convocatorias")}
                                    className="w-full bg-purple-600 hover:bg-purple-500 text-sm font-medium p-2 rounded transition-colors text-white"
                                >
                                    Ir a Panel de Control de Convocatorias
                                </button>
                            )}

                            {usuario.tipoDeUsuario === "ESTUDIANTE" && (
                                <>
                                    <button
                                        onClick={() => router.push("/convocatorias")}
                                        className="w-full bg-blue-600 hover:bg-blue-500 text-sm font-medium p-2 rounded transition-colors text-white"
                                    >
                                        Ver convocatorias disponibles
                                    </button>
                                    <button
                                        onClick={() => router.push("/mis-inscripciones")}
                                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-sm font-medium p-2 rounded transition-colors text-white"
                                    >
                                        Ver mis resultados
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
