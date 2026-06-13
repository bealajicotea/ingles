"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useConvocatorias } from "@/hooks/useConvocatorias";
import { useInscripciones } from "@/hooks/useInscripciones";
import Navbar from "@/components/Navbar";

export default function ConvocatoriasPublicPage() {
    const { usuario } = useAuth();
    const { convocatorias, isLoading } = useConvocatorias();
    const { inscribirEstudiante } = useInscripciones();

    const [misInscripcionesIds, setMisInscripcionesIds] = useState<number[]>([]);
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [feedbackMsg, setFeedbackMsg] = useState<{ texto: string; tipo: "success" | "error" } | null>(null);

    useEffect(() => {
        if (!usuario) return;
        fetch("/api/inscripciones/me")
            .then((res) => res.json())
            .then((json) => {
                if (json.success) {
                    setMisInscripcionesIds(json.data.map((i: any) => i.convocatoriaId));
                }
            })
            .catch(console.error);
    }, [usuario]);

    const handleInscribir = async (convocatoriaId: number) => {
        if (!usuario) return;
        setLoadingId(convocatoriaId);
        setFeedbackMsg(null);

        try {
            await inscribirEstudiante({
                usuarioId: usuario.id,
                convocatoriaId,
                nota: null,
            } as any);
            setMisInscripcionesIds((prev) => [...prev, convocatoriaId]);
            setFeedbackMsg({ texto: "¡Inscripción exitosa!", tipo: "success" });
        } catch (err: any) {
            const msg = err?.message || "Error al inscribirse.";
            setFeedbackMsg({ texto: msg, tipo: "error" });
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col">
            <Navbar />

            <main className="flex-1 p-8 max-w-5xl w-full mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold tracking-tight">Oferta de Convocatorias y Cursos</h1>
                    <span className="bg-slate-800 px-3 py-1 text-xs rounded-full border border-slate-700 text-slate-400">
                        {convocatorias.length} Disponibles
                    </span>
                </div>

                {feedbackMsg && (
                    <div className={`p-4 rounded-lg text-sm border ${feedbackMsg.tipo === "success" ? "bg-green-900/40 border-green-500 text-green-200" : "bg-red-900/40 border-red-500 text-red-200"}`}>
                        {feedbackMsg.tipo === "success" ? "✅" : "⚠️"} {feedbackMsg.texto}
                    </div>
                )}

                {isLoading ? (
                    <p className="text-slate-400 text-center py-12 animate-pulse">Cargando convocatorias...</p>
                ) : convocatorias.length === 0 ? (
                    <p className="text-slate-400 text-center py-12">No hay convocatorias vigentes publicadas por el administrador.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {convocatorias.map((conv: any) => {
                            const estaCerrada = conv.estado === "CERRADA";
                            const yaInscrito = misInscripcionesIds.includes(conv.id);

                            return (
                                <div key={conv.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col justify-between hover:border-slate-600 transition-colors">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs px-2 py-0.5 rounded-md bg-blue-900 text-blue-200 font-semibold uppercase">
                                                {conv.tipo}
                                            </span>
                                            <span className={`text-xs px-2 py-0.5 rounded font-bold ${estaCerrada ? "bg-red-900 text-red-200" : "bg-green-900 text-green-200"}`}>
                                                {conv.estado}
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-bold text-slate-100">{conv.nivel}</h3>
                                            <p className="text-xs text-slate-400">Profesor: {conv.profesor}</p>
                                        </div>

                                        <p className="text-sm text-slate-300 bg-slate-850 p-3 rounded-lg border border-slate-750">
                                            {conv.descripcion}
                                        </p>

                                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 bg-slate-900/50 p-2 rounded-lg">
                                            <div>📍 <b>Lugar:</b> {conv.lugar}</div>
                                            <div>⏰ <b>Hora:</b> {conv.hora}</div>
                                            <div className="col-span-2 border-t border-slate-700/50 mt-1 pt-1">
                                                📅 <b>Fecha del Evento:</b> {new Date(conv.fecha).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        {!usuario ? (
                                            <div className="w-full py-2 px-4 rounded-lg text-center text-xs text-slate-400 bg-slate-700/50">
                                                Inicia sesión para inscribirte
                                            </div>
                                        ) : yaInscrito ? (
                                            <div className="w-full py-2 px-4 rounded-lg text-center text-xs text-emerald-400 bg-emerald-900/20 border border-emerald-700/30 font-medium">
                                                ✅ Ya inscrito
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleInscribir(conv.id)}
                                                disabled={estaCerrada || loadingId === conv.id}
                                                className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-all ${estaCerrada
                                                        ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                                                        : loadingId === conv.id
                                                            ? "bg-blue-800 text-blue-300 cursor-wait"
                                                            : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"
                                                    }`}
                                            >
                                                {estaCerrada
                                                    ? "Convocatoria Cerrada"
                                                    : loadingId === conv.id
                                                        ? "Procesando Inscripción..."
                                                        : "Inscribirme en este Curso"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
