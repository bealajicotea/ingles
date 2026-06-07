import { Inscripcion } from "@/generated/prisma/client";

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

export type CreateInscripcionInput = Omit<Inscripcion, "id">;
export type AsignarNotaInput = { inscripcionId: number; nota: number };

export const inscripcionService = {
    async getAll(): Promise<Inscripcion[]> {
        const res = await fetch("/api/inscripciones");
        if (!res.ok) throw new Error("Error al obtener las inscripciones");
        const json: ApiResponse<Inscripcion[]> = await res.json();
        return json.data ?? [];
    },

    async create(data: CreateInscripcionInput): Promise<Inscripcion> {
        const res = await fetch("/api/inscripciones", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Error al procesar la inscripción");
        const json: ApiResponse<Inscripcion> = await res.json();
        if (!json.data) throw new Error("Error al procesar la inscripción");
        return json.data;
    },

    async asignarNota({ inscripcionId, nota }: AsignarNotaInput): Promise<Inscripcion> {
        const res = await fetch(`/api/inscripciones?id=${inscripcionId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nota }),
        });
        if (!res.ok) throw new Error("Error al asignar la nota");
        const json: ApiResponse<Inscripcion> = await res.json();
        if (!json.data) throw new Error("Error al asignar la nota");
        return json.data;
    },

    async delete(id: number): Promise<{ success: boolean }> {
        const res = await fetch(`/api/inscripciones?id=${id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Error al cancelar la inscripción");
        const json: ApiResponse<{ success: boolean }> = await res.json();
        return json;
    },
};
