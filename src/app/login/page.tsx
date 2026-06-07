"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
    const { login, loading, errorMsg } = useAuth();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const payload = Object.fromEntries(formData.entries());
        login(payload); // Consume directamente la lógica del custom hook
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-xl max-w-md w-full space-y-6">

                {/* Cabecera del Formulario */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-white">
                        ¡Bienvenido!
                    </h1>
                    <p className="text-sm text-slate-400">
                        Ingresa al portal UCI para gestionar convocatorias y notas.
                    </p>
                </div>

                {/* Alerta de Error Desplegable */}
                {errorMsg && (
                    <div className="bg-red-900/30 border border-red-500/40 text-red-300 text-xs p-3 rounded-lg text-center font-medium animate-fade-in">
                        ⚠️ {errorMsg}
                    </div>
                )}

                {/* Formulario Nativo */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Input: Usuario */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="username"
                            className="text-xs font-semibold uppercase tracking-wider text-slate-400"
                        >
                            Usuario
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            placeholder="Ej. juan.perez"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                        />
                    </div>

                    {/* Input: Contraseña */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="password"
                            className="text-xs font-semibold uppercase tracking-wider text-slate-400"
                        >
                            Contraseña
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                        />
                    </div>

                    {/* Botón de Envío Dinámico */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800/40 disabled:text-slate-500 text-white font-medium text-sm py-3 rounded-lg transition-all shadow-lg shadow-purple-600/10 cursor-pointer disabled:cursor-not-allowed flex justify-center items-center"
                    >
                        {loading ? (
                            <div className="flex items-center space-x-2">
                                {/* Spinner ultra-básico en CSS nativo */}
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>Validando identidad...</span>
                            </div>
                        ) : (
                            "Iniciar Sesión"
                        )}
                    </button>

                </form>

                    <p className="text-center text-xs text-slate-400">
                        ¿No tienes cuenta? <Link href="/register" className="text-purple-400 hover:text-purple-300 font-medium">Regístrate aquí</Link>
                    </p>

            </div>
        </div>
    );
}