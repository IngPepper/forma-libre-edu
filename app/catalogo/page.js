"use client";
import { Suspense } from "react";
import { useEffect, useState, useMemo } from "react";
import Catalogo from "../../components/(layout)/Catalogo";
import { useRouter, useSearchParams } from "next/navigation";
import ScrollToTopOnNavigation from "@/components/(utilities)/ScrollToTopOnNavigation";

export default function CatalogoPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

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

    const handleCategoriaChange = (cat) => {
        router.push(`/catalogo?cat=${encodeURIComponent(cat)}`);
    };

    const planosFiltrados = useMemo(
        () => categoria === "Todos"
            ? planosMock
            : planosMock.filter(p => p.categoria === categoria),
        [planosMock, categoria]
    );

    return (
        <Suspense fallback={<div>Cargando catálogo...</div>}>
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
        </Suspense>
    );
}
