import prisma from "@/lib/prisma";

export default async function AdminDashboard() {
    // Consultas directas y coherentes con la base de datos
    const conteoUsuarios = await prisma.usuario.count();

    // Agregamos un bloque try/catch por si aún estás corriendo las migraciones de Convocatoria
    let conteoConvocatorias = 0;
    try {
        conteoConvocatorias = await prisma.convocatoria.count();
    } catch (e) {
        console.log("Tabla convocatoria no lista todavía.");
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard de Administración</h1>
                <p className="text-slate-400">Bienvenido al sistema de gestión de convocatorias y cursos.</p>
            </div>

            {/* Grid de Métricas Rápidas */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {/* Tarjeta Usuarios */}
                <div className="bg-slate-800 overflow-hidden shadow rounded-lg border border-slate-700">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-slate-400 truncate">Usuarios Registrados</dt>
                                    <dd className="text-3xl font-semibold text-white">{conteoUsuarios}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tarjeta Convocatorias */}
                <div className="bg-slate-800 overflow-hidden shadow rounded-lg border border-slate-700">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-slate-400 truncate">Convocatorias Activas</dt>
                                    <dd className="text-3xl font-semibold text-white">{conteoConvocatorias}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección Informativa / Accesos Rápidos */}
            <div className="bg-slate-800 p-6 rounded-lg shadow border border-slate-700">
                <h2 className="text-xl font-bold text-slate-200 mb-4">Acciones del Sistema</h2>
                <p className="text-slate-400 mb-4">
                    Usa la barra de navegación superior para dar de alta nuevos estudiantes/profesores o para publicar los resultados de los exámenes de las convocatorias vigentes.
                </p>
            </div>
        </div>
    );
}