"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        const formData = new FormData(e.currentTarget);
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            setErrorMsg("Las contraseñas no coinciden.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName: formData.get("firstName"),
                    lastName: formData.get("lastName"),
                    username: formData.get("username"),
                    email: formData.get("email"),
                    password,
                }),
            });

            const result = await res.json();

            if (result.success) {
                setSuccessMsg("¡Cuenta creada! Redirigiendo al login...");
                setTimeout(() => router.push("/login"), 1500);
            } else {
                setErrorMsg(result.message || "Error al registrar.");
            }
        } catch {
            setErrorMsg("Error de red al intentar registrar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-xl max-w-md w-full space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-white">
                        Crear Cuenta
                    </h1>
                    <p className="text-sm text-slate-400">
                        Regístrate como estudiante en el portal UCI.
                    </p>
                </div>

                {errorMsg && (
                    <div className="bg-red-900/30 border border-red-500/40 text-red-300 text-xs p-3 rounded-lg text-center font-medium animate-fade-in">
                        {errorMsg}
                    </div>
                )}

                {successMsg && (
                    <div className="bg-green-900/30 border border-green-500/40 text-green-300 text-xs p-3 rounded-lg text-center font-medium animate-fade-in">
                        {successMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label htmlFor="firstName" className="text-xs font-semibold uppercase tracking-wider text-slate-400">Nombre</label>
                            <input id="firstName" name="firstName" type="text" required placeholder="Tu nombre" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="lastName" className="text-xs font-semibold uppercase tracking-wider text-slate-400">Apellidos</label>
                            <input id="lastName" name="lastName" type="text" required placeholder="Tus apellidos" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="username" className="text-xs font-semibold uppercase tracking-wider text-slate-400">Usuario</label>
                        <input id="username" name="username" type="text" required placeholder="Ej. juan.perez" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm" />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email</label>
                        <input id="email" name="email" type="email" required placeholder="correo@ejemplo.com" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-400">Contraseña</label>
                            <input id="password" name="password" type="password" required minLength={6} placeholder="Mín. 6 caracteres" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wider text-slate-400">Confirmar</label>
                            <input id="confirmPassword" name="confirmPassword" type="password" required placeholder="Repite la contraseña" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800/40 disabled:text-slate-500 text-white font-medium text-sm py-3 rounded-lg transition-all shadow-lg shadow-purple-600/10 cursor-pointer disabled:cursor-not-allowed flex justify-center items-center"
                    >
                        {loading ? (
                            <span>Creando cuenta...</span>
                        ) : (
                            "Crear Cuenta"
                        )}
                    </button>
                </form>

                <p className="text-center text-xs text-slate-400">
                    ¿Ya tienes cuenta? <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">Inicia sesión</Link>
                </p>
            </div>
        </div>
    );
}
