"use client";

import { useRef } from "react";

function aFormatoHoraInput(hora: string): string {
    if (/^\d{2}:\d{2}$/.test(hora)) return hora;
    const m = hora.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!m) return hora;
    let h = Number(m[1]);
    if (m[3].toUpperCase() === "PM" && h !== 12) h += 12;
    if (m[3].toUpperCase() === "AM" && h === 12) h = 0;
    return `${String(h).padStart(2, "0")}:${m[2]}`;
}

export interface Convocatoria {
    id: number;
    descripcion: string;
    lugar: string;
    fecha: string;
    hora: string;
    profesor: string;
    nivel: string;
    estado: string;
}

interface ConvocatoriaFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingConvocatoria: Convocatoria | null;
    onSave: (data: Omit<Convocatoria, "id">) => Promise<void>;
    isSaving: boolean;
}

export default function ConvocatoriaFormModal({
    isOpen,
    onClose,
    editingConvocatoria,
    onSave,
    isSaving,
}: ConvocatoriaFormModalProps) {
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formRef.current) return;

        const formData = new FormData(formRef.current);
        const data = {
            descripcion: formData.get("descripcion") as string,
            lugar: formData.get("lugar") as string,
            fecha: formData.get("fecha") as string,
            hora: formData.get("hora") as string,
            profesor: formData.get("profesor") as string,
            nivel: formData.get("nivel") as string,
            estado: formData.get("estado") as string,
        };

        await onSave(data);
        onClose();
        formRef.current.reset();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-4">
                    {editingConvocatoria ? "Editar Convocatoria" : "Nueva Convocatoria"}
                </h2>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Nivel de Idioma</label>
                            <select
                                name="nivel"
                                required
                                defaultValue={editingConvocatoria?.nivel || ""}
                                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 p-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="" disabled>Seleccionar nivel</option>
                                <option value="A1">A1</option>
                                <option value="A2">A2</option>
                                <option value="B1">B1</option>
                                <option value="B2">B2</option>
                                <option value="C1">C1</option>
                                <option value="C2">C2</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Descripción</label>
                        <textarea
                            name="descripcion"
                            rows={3}
                            required
                            defaultValue={editingConvocatoria?.descripcion || ""}
                            placeholder="Detalles sobre los requisitos o el aula..."
                            className="w-full rounded-lg bg-zinc-800 border border-zinc-700 p-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Fecha</label>
                            <input
                                type="date"
                                name="fecha"
                                required
                                defaultValue={editingConvocatoria?.fecha ? new Date(editingConvocatoria.fecha).toISOString().split('T')[0] : ""}
                                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 p-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Hora</label>
                            <input
                                type="time"
                                name="hora"
                                required
                                defaultValue={editingConvocatoria ? aFormatoHoraInput(editingConvocatoria.hora) : ""}
                                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 p-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Lugar</label>
                        <input
                            type="text"
                            name="lugar"
                            required
                            defaultValue={editingConvocatoria?.lugar || ""}
                            placeholder="Ej. Laboratorio 3, Edificio Central"
                            className="w-full rounded-lg bg-zinc-800 border border-zinc-700 p-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Profesor</label>
                            <input
                                type="text"
                                name="profesor"
                                required
                                defaultValue={editingConvocatoria?.profesor || ""}
                                placeholder="Nombre del docente"
                                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 p-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Estado</label>
                            <select
                                name="estado"
                                defaultValue={editingConvocatoria?.estado || "ABIERTA"}
                                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 p-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="ABIERTA">Abierta</option>
                                <option value="CERRADA">Cerrada</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition disabled:opacity-50"
                        >
                            {isSaving ? "Guardando..." : editingConvocatoria ? "Actualizar" : "Crear"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
