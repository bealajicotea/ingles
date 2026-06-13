"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useInscripciones } from "@/hooks/useInscripciones";
import { useConvocatorias } from "@/hooks/useConvocatorias";

export default function CalificacionesPage() {
    const { inscripciones, isLoading } = useInscripciones();
    const { convocatorias } = useConvocatorias();
    const queryClient = useQueryClient();

    const [filtroConvocatoriaId, setFiltroConvocatoriaId] = useState<number | "todas">("todas");
    const [notasEditadas, setNotasEditadas] = useState<Record<number, string>>({});
    const [savingId, setSavingId] = useState<number | null>(null);
    const [feedbackId, setFeedbackId] = useState<{ id: number; tipo: "ok" | "error" } | null>(null);

    const filtradas = filtroConvocatoriaId === "todas"
        ? inscripciones
        : inscripciones.filter((i: any) => i.convocatoriaId === filtroConvocatoriaId);

    const nivelesCefr = ["A1", "A2", "B1", "B2", "C1", "C2"];

    const handleGuardarNota = async (inscripcionId: number) => {
        const valor = notasEditadas[inscripcionId];
        if (valor === undefined || valor.trim() === "") return;

        const nota = valor.trim();
        if (!nivelesCefr.includes(nota)) {
            setFeedbackId({ id: inscripcionId, tipo: "error" });
            setTimeout(() => setFeedbackId(null), 2000);
            return;
        }

        setSavingId(inscripcionId);

        try {
            const res = await fetch(`/api/inscripciones?id=${inscripcionId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nota }),
            });

            const json = await res.json();

            if (json.success) {
                queryClient.invalidateQueries({ queryKey: ["inscripciones"] });
                setFeedbackId({ id: inscripcionId, tipo: "ok" });
                setNotasEditadas((prev) => {
                    const next = { ...prev };
                    delete next[inscripcionId];
                    return next;
                });
                setTimeout(() => setFeedbackId(null), 2000);
            } else {
                setFeedbackId({ id: inscripcionId, tipo: "error" });
                setTimeout(() => setFeedbackId(null), 2000);
            }
        } catch {
            setFeedbackId({ id: inscripcionId, tipo: "error" });
            setTimeout(() => setFeedbackId(null), 2000);
        } finally {
            setSavingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Calificaciones</h1>
                <p className="text-sm text-zinc-400">Asigna y actualiza las notas de los estudiantes inscritos.</p>
            </div>

            <div className="flex items-center gap-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Filtrar por convocatoria:</label>
                <select
                    value={filtroConvocatoriaId === "todas" ? "todas" : filtroConvocatoriaId}
                    onChange={(e) => setFiltroConvocatoriaId(e.target.value === "todas" ? "todas" : Number(e.target.value))}
                    className="rounded-lg bg-zinc-800 border border-zinc-700 p-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="todas">Todas las convocatorias</option>
                    {convocatorias.map((c: any) => (
                        <option key={c.id} value={c.id}>
                            {c.nivel} - {c.descripcion} ({c.estado})
                        </option>
                    ))}
                </select>
            </div>

            {isLoading ? (
                <div className="flex h-40 items-center justify-center text-zinc-400">
                    <p className="animate-pulse">Cargando inscripciones...</p>
                </div>
            ) : filtradas.length === 0 ? (
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-12 text-center">
                    <p className="text-zinc-400">No hay inscripciones para mostrar.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-800 bg-zinc-900/50 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                <th className="p-4">Estudiante</th>
                                <th className="p-4">Convocatoria / Nivel</th>
                                <th className="p-4">Nota Actual</th>
                                <th className="p-4">Nueva Nota</th>
                                <th className="p-4 text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800 text-sm">
                            {filtradas.map((ins: any) => (
                                <tr key={ins.id} className="hover:bg-zinc-800/30 transition-colors">
                                    <td className="p-4 font-medium text-white">
                                        {ins.usuario.firstName} {ins.usuario.lastName}
                                        <div className="text-xs text-zinc-500">{ins.usuario.username}</div>
                                    </td>
                                    <td className="p-4 text-zinc-300">
                                        <span className="inline-block rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-400">
                                            {ins.convocatoria.nivel}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {ins.nota !== null && ins.nota !== undefined ? (
                                            <span className={`font-bold ${["A2", "B1", "B2", "C1", "C2"].includes(ins.nota) ? "text-emerald-400" : "text-red-400"}`}>
                                                {ins.nota}
                                            </span>
                                        ) : (
                                            <span className="text-zinc-500">—</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <select
                                            value={notasEditadas[ins.id] ?? ""}
                                            onChange={(e) =>
                                                setNotasEditadas((prev) => ({
                                                    ...prev,
                                                    [ins.id]: e.target.value,
                                                }))
                                            }
                                            className="w-28 rounded-lg bg-zinc-800 border border-zinc-700 p-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="">Seleccionar</option>
                                            {nivelesCefr.map((nivel) => (
                                                <option key={nivel} value={nivel}>{nivel}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="p-4 text-right">
                                        {savingId === ins.id ? (
                                            <span className="text-xs text-zinc-400">Guardando...</span>
                                        ) : feedbackId !== null && feedbackId.id === ins.id ? (
                                            <span className={`text-xs font-semibold ${feedbackId.tipo === "ok" ? "text-emerald-400" : "text-red-400"}`}>
                                                {feedbackId.tipo === "ok" ? "✓ Guardado" : "✗ Error"}
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => handleGuardarNota(ins.id)}
                                                disabled={!notasEditadas[ins.id] || notasEditadas[ins.id].trim() === ""}
                                                className="rounded bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 transition disabled:opacity-50"
                                            >
                                                Guardar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
