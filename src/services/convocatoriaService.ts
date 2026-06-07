interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

export type CreateConvocatoriaInput = {
    tipo: string;
    descripcion: string;
    lugar: string;
    fecha: string;
    hora: string;
    profesor: string;
    nivel: string;
    estado?: string;
};

export type UpdateConvocatoriaInput = Partial<CreateConvocatoriaInput>;

export interface Convocatoria {
    id: number;
    tipo: string;
    descripcion: string;
    lugar: string;
    fecha: string;
    hora: string;
    profesor: string;
    nivel: string;
    estado: string;
}

export const convocatoriaService = {
    async getAll(): Promise<Convocatoria[]> {
        const res = await fetch("/api/convocatorias");
        if (!res.ok) throw new Error("Error al obtener las convocatorias");
        const json: ApiResponse<Convocatoria[]> = await res.json();
        return json.data ?? [];
    },

    async getById(id: number): Promise<Convocatoria> {
        const res = await fetch(`/api/convocatorias?id=${id}`);
        if (!res.ok) throw new Error(`Error al obtener la convocatoria ${id}`);
        const json: ApiResponse<Convocatoria> = await res.json();
        if (!json.data) throw new Error("Convocatoria no encontrada");
        return json.data;
    },

    async create(data: CreateConvocatoriaInput): Promise<Convocatoria> {
        const res = await fetch("/api/convocatorias", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Error al crear la convocatoria");
        const json: ApiResponse<Convocatoria> = await res.json();
        if (!json.data) throw new Error("Error al crear la convocatoria");
        return json.data;
    },

    async update(id: number, data: UpdateConvocatoriaInput): Promise<Convocatoria> {
        const res = await fetch(`/api/convocatorias?id=${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Error al actualizar la convocatoria");
        const json: ApiResponse<Convocatoria> = await res.json();
        if (!json.data) throw new Error("Error al actualizar la convocatoria");
        return json.data;
    },

    async delete(id: number): Promise<{ success: boolean }> {
        const res = await fetch(`/api/convocatorias?id=${id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Error al eliminar la convocatoria");
        return res.json();
    },
};