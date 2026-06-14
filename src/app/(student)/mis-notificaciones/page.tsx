"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useNotificaciones } from "@/hooks/useNotificaciones";
import Navbar from "@/components/Navbar";

export default function MisNotificacionesPage() {
    const { usuario } = useAuth();
    const router = useRouter();
    const { notificaciones, isLoading, marcarLeida, eliminar, eliminarLeidas } = useNotificaciones();

    useEffect(() => {
        if (!usuario) router.push("/login");
    }, [usuario, router]);

    const noLeidas = notificaciones.filter((n) => !n.leida);

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col">
            <Navbar />

            <main className="flex-1 p-8 max-w-4xl w-full mx-auto space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Notificaciones</h1>
                        <p className="text-sm text-slate-400">
                            {noLeidas.length > 0
                                ? `${noLeidas.length} notificaciones sin leer`
                                : notificaciones.length > 0
                                    ? "Todas las notificaciones están leídas"
                                    : "No hay notificaciones"}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {noLeidas.length > 0 && (
                            <button
                                onClick={() => noLeidas.forEach((n) => marcarLeida(n.id))}
                                className="text-xs bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded transition font-medium cursor-pointer"
                            >
                                Marcar todas leídas
                            </button>
                        )}
                        {notificaciones.some((n) => n.leida) && (
                            <button
                                onClick={() => eliminarLeidas()}
                                className="text-xs bg-red-600/20 hover:bg-red-600/40 border border-red-700/30 px-3 py-1.5 rounded transition font-medium cursor-pointer"
                            >
                                Limpiar leídas
                            </button>
                        )}
                    </div>
                </div>

                {isLoading ? (
                    <p className="text-slate-400 text-center py-12 animate-pulse">Cargando notificaciones...</p>
                ) : notificaciones.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-4xl mb-3">🔔</p>
                        <p className="text-slate-400">No tienes notificaciones.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {notificaciones.map((n) => (
                            <div
                                key={n.id}
                                className={`rounded-xl p-4 border transition ${
                                    n.leida
                                        ? "bg-slate-800/30 border-slate-700/30"
                                        : "bg-slate-800 border-indigo-500/30"
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-lg mt-0.5">
                                        {n.tipo === "NUEVA_CONVOCATORIA" ? "📢" : "📝"}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={n.tipo === "NUEVA_CONVOCATORIA" ? "/convocatorias" : "/mis-inscripciones"}
                                                onClick={() => { if (!n.leida) marcarLeida(n.id); }}
                                                className={`text-sm hover:underline ${n.leida ? "text-slate-400" : "text-slate-100 font-medium"}`}
                                            >
                                                {n.mensaje}
                                            </Link>
                                            {!n.leida && (
                                                <span className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1.5">
                                            {new Date(n.createdAt).toLocaleDateString("es-ES", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => eliminar(n.id)}
                                        className="text-slate-600 hover:text-red-400 transition text-xs cursor-pointer p-1"
                                        title="Eliminar"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
