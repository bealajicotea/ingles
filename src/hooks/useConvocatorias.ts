import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { convocatoriaService, CreateConvocatoriaInput, UpdateConvocatoriaInput } from "@/services/convocatoriaService";

export const useConvocatorias = () => {
    const queryClient = useQueryClient();

    // Query: Obtener todas las convocatorias
    const convocatoriasQuery = useQuery({
        queryKey: ["convocatorias"],
        queryFn: convocatoriaService.getAll,
    });

    // Mutation: Crear convocatoria
    const createConvocatoriaMutation = useMutation({
        mutationFn: (data: CreateConvocatoriaInput) => convocatoriaService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["convocatorias"] });
        },
    });

    // Mutation: Actualizar convocatoria
    const updateConvocatoriaMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateConvocatoriaInput }) =>
            convocatoriaService.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["convocatorias"] });
            queryClient.invalidateQueries({ queryKey: ["convocatorias", variables.id] });
        },
    });

    // Mutation: Eliminar convocatoria
    const deleteConvocatoriaMutation = useMutation({
        mutationFn: (id: number) => convocatoriaService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["convocatorias"] });
        },
    });

    return {
        convocatorias: convocatoriasQuery.data ?? [],
        isLoading: convocatoriasQuery.isLoading,
        isError: convocatoriasQuery.isError,
        error: convocatoriasQuery.error,
        createConvocatoria: createConvocatoriaMutation.mutateAsync,
        isCreating: createConvocatoriaMutation.isPending,
        updateConvocatoria: updateConvocatoriaMutation.mutateAsync,
        isUpdating: updateConvocatoriaMutation.isPending,
        deleteConvocatoria: deleteConvocatoriaMutation.mutateAsync,
        isDeleting: deleteConvocatoriaMutation.isPending,
    };
};