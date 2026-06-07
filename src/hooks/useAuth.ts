import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/authService";

export function useAuth() {
    const router = useRouter();
    const { token, usuario, setAuth, clearAuth } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const login = async (payload: Record<string, any>) => {
        setLoading(true);
        setErrorMsg("");
        try {
            const result = await authService.login(payload);

            if (result.success) {
                // Guardamos en Zustand (y automáticamente en localStorage)
                // Nota: Asegúrate de que tu endpoint /api/auth/login devuelva el token y el usuario en su JSON
                setAuth(result.token || "mock_token_jwt", result.data || result.usuario);

                router.push("/dashboard");
            } else {
                setErrorMsg(result.message || "Credenciales inválidas.");
            }
        } catch (err) {
            setErrorMsg("Error de red al intentar conectar.");
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        clearAuth();
        router.push("/login");
    };

    return {
        token,
        usuario,
        loading,
        errorMsg,
        login,
        logout,
    };
}