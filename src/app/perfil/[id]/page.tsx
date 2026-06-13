"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";

interface PerfilUsuario {
    id: number;
    username: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    rol: string;
    facultad: string | null;
    anoEscolar: number | null;
    grupo: string | null;
    carrera: string | null;
    curso: string | null;
    nivel: string | null;
    certificado: boolean;
}

export default function PerfilPage() {
    const { id } = useParams<{ id: string }>();
    const { usuario } = useAuth();
    const router = useRouter();
    const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
    const [loading, setLoading] = useState(true);
    const [editando, setEditando] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [form, setForm] = useState<Record<string, string>>({});

    const esPropietario = usuario?.id === Number(id);

    useEffect(() => {
        if (!usuario) {
            router.push("/login");
            return;
        }
        fetch(`/api/usuarios?id=${id}`)
            .then((res) => res.json())
            .then((json) => {
                if (json.success) {
                    setPerfil(json.data);
                    setForm({
                        firstName: json.data.firstName || "",
                        lastName: json.data.lastName || "",
                        email: json.data.email || "",
                        facultad: json.data.facultad || "",
                        anoEscolar: json.data.anoEscolar?.toString() || "",
                        grupo: json.data.grupo || "",
                        carrera: json.data.carrera || "",
                        curso: json.data.curso || "",
                    });
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id, usuario, router]);

    const handleChange = (campo: string, valor: string) => {
        setForm((prev) => ({ ...prev, [campo]: valor }));
    };

    const handleGuardar = async () => {
        setGuardando(true);
        try {
            const res = await fetch(`/api/usuarios?id=${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const json = await res.json();
            if (json.success) {
                setPerfil((prev) => prev ? { ...prev, ...json.data } : null);
                setEditando(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setGuardando(false);
        }
    };

    const handleCancelar = () => {
        if (!perfil) return;
        setForm({
            firstName: perfil.firstName || "",
            lastName: perfil.lastName || "",
            email: perfil.email || "",
            facultad: perfil.facultad || "",
            anoEscolar: perfil.anoEscolar?.toString() || "",
            grupo: perfil.grupo || "",
            carrera: perfil.carrera || "",
            curso: perfil.curso || "",
        });
        setEditando(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
                <p className="animate-pulse">Cargando perfil...</p>
            </div>
        );
    }

    if (!perfil) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
                <p className="text-red-400">Usuario no encontrado</p>
            </div>
        );
    }

    const inputCls = "w-full rounded-lg bg-zinc-800 border border-zinc-700 p-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500";
    const labelCls = "text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1";

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col">
            <Navbar />

            <main className="flex-1 p-8 max-w-3xl w-full mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Perfil de {perfil.firstName || perfil.username}</h1>
                        <p className="text-sm text-slate-400">Información detallada del usuario</p>
                    </div>
                    {esPropietario && !editando && (
                        <button
                            onClick={() => setEditando(true)}
                            className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition"
                        >
                            Editar Perfil
                        </button>
                    )}
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <label className={labelCls}>Nombre</label>
                            {editando ? (
                                <input type="text" value={form.firstName} onChange={(e) => handleChange("firstName", e.target.value)} className={inputCls} />
                            ) : (
                                <p className="text-white font-medium">{perfil.firstName || "—"}</p>
                            )}
                        </div>
                        <div>
                            <label className={labelCls}>Apellidos</label>
                            {editando ? (
                                <input type="text" value={form.lastName} onChange={(e) => handleChange("lastName", e.target.value)} className={inputCls} />
                            ) : (
                                <p className="text-white font-medium">{perfil.lastName || "—"}</p>
                            )}
                        </div>
                        <div>
                            <label className={labelCls}>Usuario</label>
                            <p className="text-white font-medium">{perfil.username}</p>
                        </div>
                        <div>
                            <label className={labelCls}>Email</label>
                            {editando ? (
                                <input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} className={inputCls} />
                            ) : (
                                <p className="text-white font-medium">{perfil.email || "—"}</p>
                            )}
                        </div>
                        <div>
                            <label className={labelCls}>Rol</label>
                            <p className="text-white font-medium">{perfil.rol}</p>
                        </div>
                        <div>
                            <label className={labelCls}>Facultad</label>
                            {editando ? (
                                <input type="text" value={form.facultad} onChange={(e) => handleChange("facultad", e.target.value)} className={inputCls} />
                            ) : (
                                <p className="text-white font-medium">{perfil.facultad || "—"}</p>
                            )}
                        </div>
                        <div>
                            <label className={labelCls}>Carrera</label>
                            {editando ? (
                                <input type="text" value={form.carrera} onChange={(e) => handleChange("carrera", e.target.value)} className={inputCls} />
                            ) : (
                                <p className="text-white font-medium">{perfil.carrera || "—"}</p>
                            )}
                        </div>
                        <div>
                            <label className={labelCls}>Curso</label>
                            {editando ? (
                                <input type="text" value={form.curso} onChange={(e) => handleChange("curso", e.target.value)} className={inputCls} />
                            ) : (
                                <p className="text-white font-medium">{perfil.curso || "—"}</p>
                            )}
                        </div>
                        <div>
                            <label className={labelCls}>Grupo</label>
                            {editando ? (
                                <input type="text" value={form.grupo} onChange={(e) => handleChange("grupo", e.target.value)} className={inputCls} />
                            ) : (
                                <p className="text-white font-medium">{perfil.grupo || "—"}</p>
                            )}
                        </div>
                        <div>
                            <label className={labelCls}>Año Escolar</label>
                            {editando ? (
                                <input type="number" value={form.anoEscolar} onChange={(e) => handleChange("anoEscolar", e.target.value)} className={inputCls} />
                            ) : (
                                <p className="text-white font-medium">{perfil.anoEscolar ?? "—"}</p>
                            )}
                        </div>
                        <div>
                            <label className={labelCls}>Nivel de Idioma</label>
                            <p className="text-white font-medium">{perfil.nivel || "—"}</p>
                        </div>
                        <div>
                            <label className={labelCls}>Certificado</label>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${perfil.certificado ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-800 text-zinc-400"}`}>
                                {perfil.certificado ? "Certificado" : "No certificado"}
                            </span>
                        </div>
                    </div>

                    {editando && (
                        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-700">
                            <button
                                onClick={handleCancelar}
                                disabled={guardando}
                                className="rounded bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleGuardar}
                                disabled={guardando}
                                className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition disabled:opacity-50"
                            >
                                {guardando ? "Guardando..." : "Guardar Cambios"}
                            </button>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => router.back()}
                    className="rounded bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition"
                >
                    ← Volver
                </button>
            </main>
        </div>
    );
}
