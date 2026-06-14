import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificacionService } from "@/services/notificacionService";

export const useNotificaciones = () => {
    const queryClient = useQueryClient();

    const notificacionesQuery = useQuery({
        queryKey: ["notificaciones"],
        queryFn: notificacionService.getMine,
        staleTime: 0,
        refetchInterval: 15000,
    });

    const marcarLeidaMutation = useMutation({
        mutationFn: (id: number) => notificacionService.marcarLeida(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notificaciones"] });
        },
    });

    const marcarTodasLeidasMutation = useMutation({
        mutationFn: () => notificacionService.marcarTodasLeidas(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notificaciones"] });
        },
    });

    const eliminarMutation = useMutation({
        mutationFn: (id: number) => notificacionService.eliminar(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notificaciones"] });
        },
    });

    const eliminarLeidasMutation = useMutation({
        mutationFn: () => notificacionService.eliminarLeidas(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notificaciones"] });
        },
    });

    return {
        notificaciones: notificacionesQuery.data?.notificaciones ?? [],
        noLeidas: notificacionesQuery.data?.noLeidas ?? 0,
        isLoading: notificacionesQuery.isLoading,
        marcarLeida: marcarLeidaMutation.mutateAsync,
        marcarTodasLeidas: marcarTodasLeidasMutation.mutateAsync,
        eliminar: eliminarMutation.mutateAsync,
        eliminarLeidas: eliminarLeidasMutation.mutateAsync,
    };
};
