export const authService = {
    async login(payload: Record<string, any>) {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        return res.json();
    },

    // Si el día de mañana usas un backend externo (NestJS, Django, etc.), 
    // solo tendrás que cambiar las URLs de este archivo.
};