import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Aseguramos consistencia: Si no hay token, fuera del admin.
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token");

    if (!token) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col">
            <AdminNavbar />

            {/* Contenedor del contenido dinámico */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8">
                {children}
            </main>
        </div>
    );
}