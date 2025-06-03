"use client";
import { useEffect, useState, useMemo } from "react";
import Catalogo from "../../components/Catalogo";
import { useRouter, useSearchParams } from "next/navigation";
import ScrollToTopOnNavigation from "@/components/ScrollToTopOnNavigation";

export default function CatalogoPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Lee la categoría actual del query param 'cat', o "Todos" por default
    const categoria = searchParams.get('cat') || "Todos";

    const [planosMock, setPlanosMock] = useState([]);
    const [categorias, setCategorias] = useState(["Todos"]);
    const perfil = { tieneMembresia: true };

    useEffect(() => {
        fetch("/data/planosMock.json")
            .then(res => res.json())
            .then(data => {
                setPlanosMock(data);
                const cats = Array.from(new Set(data.map(p => p.categoria).filter(Boolean)));
                setCategorias(["Todos", ...cats]);
            })
            .catch((err) => {
                console.error("Error al cargar JSON:", err);
                setPlanosMock([]);
                setCategorias(["Todos"]);
            });
    }, []);

    // Cuando el usuario cambie de categoría, actualiza la URL
    const handleCategoriaChange = (cat) => {
        router.push(`/catalogo?cat=${encodeURIComponent(cat)}`);
        // No necesitas setCategoria, porque cambia por el search param
    };

    // Filtra planos según la categoría de la URL
    const planosFiltrados = useMemo(
        () => categoria === "Todos"
            ? planosMock
            : planosMock.filter(p => p.categoria === categoria),
        [planosMock, categoria]
    );

    return (
        <main>
            <ScrollToTopOnNavigation />
            <Catalogo
                planos={planosFiltrados}
                onCategoriaChange={handleCategoriaChange}
                categoriaActual={categoria}
                categorias={categorias}
                perfil={perfil}
            />
        </main>
    );
}
