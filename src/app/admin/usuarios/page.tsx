"use client";

import { useState } from "react";
import { useUsuarios } from "@/hooks/useUsuarios";
import UsuarioFormModal, { Usuario, UsuarioFormData } from "@/components/UsuarioFormModal";
import { CreateUsuarioInput } from "@/services/usuarioService";

export default function UsuariosPage() {
    const {
        usuarios,
        isLoading,
        createUsuario,
        updateUsuario,
        deleteUsuario,
        isCreating,
        isUpdating,
        isDeleting,
    } = useUsuarios();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);

    const handleOpenCreate = () => {
        setEditingUsuario(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (usuario: any) => {
        setEditingUsuario(usuario);
        setIsModalOpen(true);
    };

    const handleFormSave = async (data: UsuarioFormData) => {
        try {
            if (editingUsuario) {
                await updateUsuario({
                    id: editingUsuario.id,
                    data,
                });
            } else {
                await createUsuario(data as CreateUsuarioInput);
            }
        } catch (error) {
            console.error("Error al procesar el usuario:", error);
            alert("Hubo un error al guardar el usuario.");
            throw error;
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
            try {
                await deleteUsuario(id);
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
                    <h1 className="text-3xl font-bold tracking-tight text-white">Gestión de Usuarios</h1>
                    <p className="text-sm text-zinc-400">Crea, edita y administra los usuarios del centro.</p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                    + Nuevo Usuario
                </button>
            </div>

            {isLoading ? (
                <div className="flex h-40 items-center justify-center text-zinc-400">
                    <p className="animate-pulse">Cargando usuarios...</p>
                </div>
            ) : usuarios.length === 0 ? (
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-12 text-center">
                    <p className="text-zinc-400">No hay usuarios registrados.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-800 bg-zinc-900/50 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                                <th className="p-4">Nombre Completo</th>
                                <th className="p-4">Username</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Rol</th>
                                <th className="p-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800 text-sm">
                            {usuarios.map((usuario: any) => (
                                <tr key={usuario.id} className="hover:bg-zinc-800/30 transition-colors">
                                    <td className="p-4 font-medium text-white">
                                        {usuario.firstName} {usuario.lastName}
                                    </td>
                                    <td className="p-4 text-zinc-300">{usuario.username}</td>
                                    <td className="p-4 text-zinc-300">{usuario.email}</td>
                                    <td className="p-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${usuario.rol === "ADMIN"
                                                    ? "bg-red-950/40 border border-red-900/30 text-red-400"
                                                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                }`}
                                        >
                                            {usuario.rol}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleOpenEdit(usuario)}
                                            className="rounded bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-200 hover:bg-zinc-700 transition"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(usuario.id)}
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

            <UsuarioFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editingUsuario={editingUsuario}
                onSave={handleFormSave}
                isSaving={isSaving}
            />
        </div>
    );
}
