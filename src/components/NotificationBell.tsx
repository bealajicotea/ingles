"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNotificaciones } from "@/hooks/useNotificaciones";

export default function NotificationBell() {
    const [abierto, setAbierto] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { notificaciones, noLeidas, marcarLeida, marcarTodasLeidas } = useNotificaciones();

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setAbierto(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleClick = (n: typeof notificaciones[number]) => {
        if (!n.leida) marcarLeida(n.id);
        setAbierto(false);
        if (n.tipo === "NUEVA_CONVOCATORIA") {
            router.push("/convocatorias");
        } else {
            router.push("/mis-inscripciones");
        }
    };

    const noLeidasList = notificaciones.filter((n) => !n.leida).slice(0, 5);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setAbierto(!abierto)}
                className="relative p-2 text-slate-300 hover:text-white transition cursor-pointer"
                title="Notificaciones"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {noLeidas > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {noLeidas > 9 ? "9+" : noLeidas}
                    </span>
                )}
            </button>

            {abierto && (
                <div className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50">
                    <div className="p-3 border-b border-zinc-700 flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-200">
                            Notificaciones {noLeidas > 0 && `(${noLeidas})`}
                        </span>
                        {noLeidas > 0 && (
                            <button
                                onClick={() => marcarTodasLeidas()}
                                className="text-xs text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
                            >
                                Leer todas
                            </button>
                        )}
                    </div>

                    <div className="max-h-72 overflow-y-auto">
                        {noLeidasList.length === 0 ? (
                            <p className="text-xs text-slate-500 text-center py-6">No hay notificaciones pendientes</p>
                        ) : (
                            noLeidasList.map((n) => (
                                <button
                                    key={n.id}
                                    onClick={() => handleClick(n)}
                                    className="w-full text-left p-3 border-b border-zinc-800 hover:bg-zinc-800 transition cursor-pointer"
                                >
                                    <div className="flex items-start gap-2">
                                        <span className="mt-0.5 text-xs">
                                            {n.tipo === "NUEVA_CONVOCATORIA" ? "📢" : "📝"}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-slate-300 line-clamp-2">{n.mensaje}</p>
                                            <p className="text-[10px] text-slate-500 mt-1">
                                                {new Date(n.createdAt).toLocaleDateString("es-ES", {
                                                    day: "numeric",
                                                    month: "short",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                        <span className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0 mt-1.5" />
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    <LinkInline onClick={() => setAbierto(false)} href="/mis-notificaciones" className="block text-center text-xs text-indigo-400 hover:text-indigo-300 py-2.5 border-t border-zinc-700 transition">
                        Ver historial de notificaciones
                    </LinkInline>
                </div>
            )}
        </div>
    );
}

function LinkInline({ href, className, children, onClick }: { href: string; className: string; children: React.ReactNode; onClick?: () => void }) {
    const router = useRouter();
    return (
        <button onClick={() => { onClick?.(); router.push(href); }} className={className + " w-full cursor-pointer"}>
            {children}
        </button>
    );
}
