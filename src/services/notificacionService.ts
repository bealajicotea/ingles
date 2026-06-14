interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    noLeidas?: number;
}

export interface Notificacion {
    id: number;
    mensaje: string;
    tipo: "NUEVA_CONVOCATORIA" | "NOTA_ASIGNADA";
    leida: boolean;
    createdAt: string;
    usuarioId: number;
    convocatoriaId: number | null;
}

export const notificacionService = {
    async getMine(): Promise<{ notificaciones: Notificacion[]; noLeidas: number }> {
        const res = await fetch("/api/notificaciones/me");
        if (!res.ok) throw new Error("Error al obtener notificaciones");
        const json: ApiResponse<Notificacion[]> & { noLeidas?: number } = await res.json();
        return { notificaciones: json.data ?? [], noLeidas: json.noLeidas ?? 0 };
    },

    async marcarLeida(id: number): Promise<void> {
        const res = await fetch(`/api/notificaciones?id=${id}`, { method: "PUT" });
        if (!res.ok) throw new Error("Error al marcar notificación como leída");
    },

    async marcarTodasLeidas(): Promise<void> {
        const res = await fetch("/api/notificaciones/leer-todas", { method: "PUT" });
        if (!res.ok) throw new Error("Error al marcar notificaciones como leídas");
    },

    async eliminar(id: number): Promise<void> {
        const res = await fetch(`/api/notificaciones?id=${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Error al eliminar notificación");
    },

    async eliminarLeidas(): Promise<void> {
        const res = await fetch("/api/notificaciones/leidas", { method: "DELETE" });
        if (!res.ok) throw new Error("Error al eliminar notificaciones leídas");
    },
};
