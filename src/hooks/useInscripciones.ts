import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inscripcionService, CreateInscripcionInput, AsignarNotaInput } from "@/services/inscripcionService";

export const useInscripciones = () => {
    const queryClient = useQueryClient();

    // Query: Obtener todas las inscripciones (vista de control/admin)
    const inscripcionesQuery = useQuery({
        queryKey: ["inscripciones"],
        queryFn: inscripcionService.getAll,
    });

    // Mutation: Inscribir estudiante
    const inscribirEstudianteMutation = useMutation({
        mutationFn: (data: CreateInscripcionInput) => inscripcionService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inscripciones"] });
            // Opcional: Invalida convocatorias por si necesitas reflejar cambios de cupo/estado en el cliente
            queryClient.invalidateQueries({ queryKey: ["convocatorias"] });
        },
    });

    // Mutation: Calificar con nota (Profesor/Admin)
    const asignarNotaMutation = useMutation({
        mutationFn: (data: AsignarNotaInput) => inscripcionService.asignarNota(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inscripciones"] });
        },
    });

    // Mutation: Cancelar inscripción (Darse de baja)
    const deleteInscripcionMutation = useMutation({
        mutationFn: (id: number) => inscripcionService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inscripciones"] });
        },
    });

    return {
        inscripciones: inscripcionesQuery.data ?? [],
        isLoading: inscripcionesQuery.isLoading,
        isError: inscripcionesQuery.isError,
        error: inscripcionesQuery.error,
        inscribirEstudiante: inscribirEstudianteMutation.mutateAsync,
        isInscribiendo: inscribirEstudianteMutation.isPending,
        asignarNota: asignarNotaMutation.mutateAsync,
        isAsignandoNota: asignarNotaMutation.isPending,
        cancelarInscripcion: deleteInscripcionMutation.mutateAsync,
        isCanceling: deleteInscripcionMutation.isPending,
    };
};