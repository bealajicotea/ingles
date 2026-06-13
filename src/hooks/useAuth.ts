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
                setAuth(result.token || "mock_token_jwt", result.data || result.usuario);

                const role = result.data?.rol || result.usuario?.rol || result.data?.tipoDeUsuario || result.usuario?.tipoDeUsuario;
                if (role === "ADMIN") {
                    router.push("/admin");
                } else {
                    router.push("/dashboard");
                }
            } else {
                setErrorMsg(result.message || "Credenciales inválidas.");
            }
        } catch (err) {
            setErrorMsg("Error de red al intentar conectar.");
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
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
