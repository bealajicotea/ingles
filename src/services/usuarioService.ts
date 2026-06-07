import { Usuario } from "@/generated/prisma/client";

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

export type CreateUsuarioInput = Omit<Usuario, "id">;
export type UpdateUsuarioInput = Partial<CreateUsuarioInput>;

export const usuarioService = {
    async getAll(): Promise<Usuario[]> {
        const res = await fetch("/api/usuarios");
        if (!res.ok) throw new Error("Error al obtener los usuarios");
        const json: ApiResponse<Usuario[]> = await res.json();
        return json.data ?? [];
    },

    async getById(id: number): Promise<Usuario> {
        const res = await fetch(`/api/usuarios?id=${id}`);
        if (!res.ok) throw new Error(`Error al obtener el usuario con ID ${id}`);
        const json: ApiResponse<Usuario> = await res.json();
        if (!json.data) throw new Error("Usuario no encontrado");
        return json.data;
    },

    async create(data: CreateUsuarioInput): Promise<Usuario> {
        const res = await fetch("/api/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Error al crear el usuario");
        const json: ApiResponse<Usuario> = await res.json();
        if (!json.data) throw new Error("Error al crear el usuario");
        return json.data;
    },

    async update(id: number, data: UpdateUsuarioInput): Promise<Usuario> {
        const res = await fetch(`/api/usuarios?id=${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Error al actualizar el usuario");
        const json: ApiResponse<Usuario> = await res.json();
        if (!json.data) throw new Error("Error al actualizar el usuario");
        return json.data;
    },

    async delete(id: number): Promise<{ success: boolean }> {
        const res = await fetch(`/api/usuarios?id=${id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Error al eliminar el usuario");
        return res.json();
    },
};
