"use client";

import { useRef } from "react";

export interface Usuario {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    tipoDeUsuario: "ADMIN" | "ESTUDIANTE";
}

export interface UsuarioFormData {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    tipoDeUsuario: "ADMIN" | "ESTUDIANTE";
    password?: string;
}

interface UsuarioFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingUsuario: Usuario | null;
    onSave: (data: UsuarioFormData) => Promise<void>;
    isSaving: boolean;
}

export default function UsuarioFormModal({
    isOpen,
    onClose,
    editingUsuario,
    onSave,
    isSaving,
}: UsuarioFormModalProps) {
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formRef.current) return;

        const formData = new FormData(formRef.current);
        const data: UsuarioFormData = {
            username: formData.get("username") as string,
            email: formData.get("email") as string,
            firstName: formData.get("firstName") as string,
            lastName: formData.get("lastName") as string,
            tipoDeUsuario: formData.get("tipoDeUsuario") as "ADMIN" | "ESTUDIANTE",
        };

        const password = formData.get("password") as string;
        if (password) {
            data.password = password;
        }

        await onSave(data);
        onClose();
        formRef.current.reset();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-4">
                    {editingUsuario ? "Editar Usuario" : "Nuevo Usuario"}
                </h2>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Nombre</label>
                            <input
                                type="text"
                                name="firstName"
                                required
                                defaultValue={editingUsuario?.firstName || ""}
                                placeholder="Nombre del usuario"
                                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 p-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Apellidos</label>
                            <input
                                type="text"
                                name="lastName"
                                required
                                defaultValue={editingUsuario?.lastName || ""}
                                placeholder="Apellidos del usuario"
                                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 p-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Username</label>
                            <input
                                type="text"
                                name="username"
                                required
                                defaultValue={editingUsuario?.username || ""}
                                placeholder="Nombre de usuario"
                                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 p-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                defaultValue={editingUsuario?.email || ""}
                                placeholder="correo@ejemplo.com"
                                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 p-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                                Contraseña {editingUsuario ? "(dejar vacío para mantener)" : ""}
                            </label>
                            <input
                                type="password"
                                name="password"
                                required={!editingUsuario}
                                placeholder={editingUsuario ? "••••••••" : "Contraseña"}
                                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 p-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">Rol</label>
                            <select
                                name="tipoDeUsuario"
                                defaultValue={editingUsuario?.tipoDeUsuario || "ESTUDIANTE"}
                                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 p-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="ESTUDIANTE">Estudiante</option>
                                <option value="ADMIN">Administrador</option>
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
                            {isSaving ? "Guardando..." : editingUsuario ? "Actualizar" : "Crear"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
