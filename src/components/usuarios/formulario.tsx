"use client";

import { useState, useEffect } from "react";

export default function UsuariosPage() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);

    // Ejemplo de consumo de tu GET
    useEffect(() => {
        fetch("/api/usuarios")
            .then((res) => res.json())
            .then((res) => {
                if (res.success) setUsuarios(res.data);
            });
    }, []);

    // Ejemplo de consumo de tu POST
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const response = await fetch("/api/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        alert(result.message);
        setLoading(false);
    };

    return (
        <div>
            {/* Aquí pones tu formulario con el onSubmit={handleSubmit} */}
        </div>
    );
}