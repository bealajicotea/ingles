"use client";

import { useState } from "react";
import { useConvocatorias } from "@/hooks/useConvocatorias";
import ConvocatoriaFormModal, { Convocatoria } from "@/components/ConvocatoriaFormModal";

export default function ConvocatoriasPage() {
    const {
        convocatorias,
        isLoading,
        createConvocatoria,
        updateConvocatoria,
        deleteConvocatoria,
        isCreating,
        isUpdating,
        isDeleting,
    } = useConvocatorias();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingConvocatoria, setEditingConvocatoria] = useState<Convocatoria | null>(null);

    const handleOpenCreate = () => {
        setEditingConvocatoria(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (convocatoria: any) => {
        setEditingConvocatoria(convocatoria);
        setIsModalOpen(true);
    };

    const handleFormSave = async (data: Omit<Convocatoria, "id">) => {
        try {
            if (editingConvocatoria) {
                await updateConvocatoria({
                    id: editingConvocatoria.id,
                    data,
                });
            } else {
                await createConvocatoria(data);
            }
        } catch (error) {
            console.error("Error al procesar la convocatoria:", error);
            alert("Hubo un error al guardar la convocatoria.");
            throw error;
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("¿Estás seguro de que deseas eliminar esta convocatoria?")) {
            try {
                await deleteConvocatoria(id);
            } catch (error) {
                console.error("Error al eliminar:", error);
            }
        }
    };

    const isSaving = isCreating || isUpdating;

    return (
        <div className="min-h-screen bg-zinc-950 p-6 text-zinc-100 md:p-10">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Gestión de Convocatorias</h1>
                    <p className="text-sm text-zinc-400">Crea, edita y administra las convocatorias y exámenes del centro.</p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                    + Nueva Convocatoria
                </button>
            </div>

            {isLoading ? (
                <div className="flex h-40 items-center justify-center text-zinc-400">
                    <p className="animate-pulse">Cargando convocatorias...</p>
                </div>
            ) : convocatorias.length === 0 ? (
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-12 text-center">
                    <p className="text-zinc-400">No hay convocatorias registradas.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-800 bg-zinc-900/50 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                <th className="p-4">Tipo / Nivel</th>
                                <th className="p-4">Descripción</th>
                                <th className="p-4">Lugar</th>
                                <th className="p-4">Fecha / Hora</th>
                                <th className="p-4">Profesor</th>
                                <th className="p-4">Estado</th>
                                <th className="p-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800 text-sm">
                            {convocatorias.map((convocatoria: any) => (
                                <tr key={convocatoria.id} className="hover:bg-zinc-800/30 transition-colors">
                                    <td className="p-4 font-medium text-white">
                                        <div>{convocatoria.tipo}</div>
                                        <span className="inline-block mt-1 rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-400">
                                            Nivel {convocatoria.nivel}
                                        </span>
                                    </td>
                                    <td className="p-4 text-zinc-300 max-w-xs truncate">{convocatoria.descripcion}</td>
                                    <td className="p-4 text-zinc-300">{convocatoria.lugar}</td>
                                    <td className="p-4 text-zinc-300">
                                        <div>{convocatoria.fecha}</div>
                                        <div className="text-xs text-zinc-500">{convocatoria.hora}</div>
                                    </td>
                                    <td className="p-4 text-zinc-300">{convocatoria.profesor}</td>
                                    <td className="p-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${convocatoria.estado === "ABIERTA"
                                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                    : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                                                }`}
                                        >
                                            {convocatoria.estado}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleOpenEdit(convocatoria)}
                                            className="rounded bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-200 hover:bg-zinc-700 transition"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(convocatoria.id)}
                                            disabled={isDeleting}
                                            className="rounded bg-red-950/40 border border-red-900/30 px-2.5 py-1 text-xs font-medium text-red-400 hover:bg-red-900/40 transition disabled:opacity-50"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ConvocatoriaFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editingConvocatoria={editingConvocatoria}
                onSave={handleFormSave}
                isSaving={isSaving}
            />
        </div>
    );
}
