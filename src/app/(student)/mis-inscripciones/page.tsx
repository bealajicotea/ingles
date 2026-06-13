"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";

interface InscripcionConConvocatoria {
    id: number;
    nota: string | null;
    convocatoria: {
        id: number;
        nivel: string;
        descripcion: string;
        fecha: string;
        hora: string;
        lugar: string;
        profesor: string;
        estado: string;
    };
}

export default function MisInscripcionesPage() {
    const { usuario } = useAuth();
    const router = useRouter();
    const [inscripciones, setInscripciones] = useState<InscripcionConConvocatoria[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!usuario) {
            router.push("/login");
            return;
        }
        fetch("/api/inscripciones/me")
            .then((res) => res.json())
            .then((json) => {
                if (json.success) {
                    setInscripciones(json.data);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [usuario, router]);

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col">
            <Navbar />

            <main className="flex-1 p-8 max-w-5xl w-full mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Mis Inscripciones</h1>
                    <p className="text-sm text-slate-400">Consulta tus notas y resultados de las convocatorias.</p>
                </div>

                {loading ? (
                    <p className="text-slate-400 text-center py-12 animate-pulse">Cargando inscripciones...</p>
                ) : inscripciones.length === 0 ? (
                    <p className="text-slate-400 text-center py-12">No tienes inscripciones registradas.</p>
                ) : (
                    <div className="space-y-4">
                        {inscripciones.map((ins) => {
                            const { convocatoria: c } = ins;
                            const notaAsignada = ins.nota !== null;

                            return (
                                <div key={ins.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-100">{c.nivel}</h3>
                                            <p className="text-xs text-slate-400">{c.descripcion}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-0.5 rounded font-bold ${c.estado === "ABIERTA" ? "bg-green-900 text-green-200" : "bg-red-900 text-red-200"}`}>
                                            {c.estado}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 bg-slate-900/50 p-3 rounded-lg">
                                        <div>📅 Fecha: {new Date(c.fecha).toLocaleDateString()}</div>
                                        <div>⏰ Hora: {c.hora}</div>
                                        <div>📍 Lugar: {c.lugar}</div>
                                        <div>👨‍🏫 Profesor: {c.profesor}</div>
                                    </div>

                                    <div className="border-t border-slate-700 pt-3 flex items-center justify-between">
                                        {notaAsignada ? (
                                            <div className="flex items-center gap-3">
                                                <span className="text-3xl font-bold text-emerald-400">{ins.nota}</span>
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${["A2", "B1", "B2", "C1", "C2"].includes(ins.nota!) ? "bg-emerald-900/40 text-emerald-300" : "bg-red-900/40 text-red-300"}`}>
                                                    {["A2", "B1", "B2", "C1", "C2"].includes(ins.nota!) ? "Aprobado" : "Suspenso"}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-xs font-medium px-3 py-1 rounded bg-yellow-900/30 text-yellow-400 border border-yellow-700/30">
                                                ⏳ Pendiente de calificación
                                            </span>
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
