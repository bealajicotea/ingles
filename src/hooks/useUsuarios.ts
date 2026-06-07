import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usuarioService, CreateUsuarioInput, UpdateUsuarioInput } from "@/services/usuarioService";

export const useUsuarios = () => {
    const queryClient = useQueryClient();

    // Query: Obtener todos los usuarios
    const usuariosQuery = useQuery({
        queryKey: ["usuarios"],
        queryFn: usuarioService.getAll,
    });

    // Mutation: Crear usuario
    const createUsuarioMutation = useMutation({
        mutationFn: (data: CreateUsuarioInput) => usuarioService.create(data),
        onSuccess: () => {
            // Invalida la caché para refrescar la lista automáticamente
            queryClient.invalidateQueries({ queryKey: ["usuarios"] });
        },
    });

    // Mutation: Actualizar usuario
    const updateUsuarioMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateUsuarioInput }) =>
            usuarioService.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["usuarios"] });
            queryClient.invalidateQueries({ queryKey: ["usuarios", variables.id] });
        },
    });

    // Mutation: Eliminar usuario
    const deleteUsuarioMutation = useMutation({
        mutationFn: (id: number) => usuarioService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["usuarios"] });
        },
    });

    return {
        usuarios: usuariosQuery.data ?? [],
        isLoading: usuariosQuery.isLoading,
        isError: usuariosQuery.isError,
        error: usuariosQuery.error,
        createUsuario: createUsuarioMutation.mutateAsync,
        isCreating: createUsuarioMutation.isPending,
        updateUsuario: updateUsuarioMutation.mutateAsync,
        isUpdating: updateUsuarioMutation.isPending,
        deleteUsuario: deleteUsuarioMutation.mutateAsync,
        isDeleting: deleteUsuarioMutation.isPending,
    };
};

// Hook independiente para buscar un solo usuario si lo necesitas en una vista de detalle
export const useUsuarioDetalle = (id: number) => {
    return useQuery({
        queryKey: ["usuarios", id],
        queryFn: () => usuarioService.getById(id),
        enabled: !!id, // Evita que se ejecute si el id no es válido
    });
};