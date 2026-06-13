import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UsuarioLogueado {
    id: number;
    username: string;
    rol: "ADMIN" | "ESTUDIANTE";
}

interface AuthState {
    token: string | null;
    usuario: UsuarioLogueado | null;
    setAuth: (token: string, usuario: UsuarioLogueado) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            usuario: null,
            setAuth: (token, usuario) => set({ token, usuario }),
            clearAuth: () => set({ token: null, usuario: null }),
        }),
        {
            name: "uci-auth",
        }
    )
);
