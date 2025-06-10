"use client";
import { Suspense } from "react";
import { useEffect, useState, useMemo } from "react";
import Catalogo from "../../components/(layout)/Catalogo";
import { useRouter, useSearchParams } from "next/navigation";
import ScrollToTopOnNavigation from "@/components/(utilities)/ScrollToTopOnNavigation";

import SearchBar from "@/components/(utilities)/SearchBar";
import filtrarPlanos from "@/lib/searchHelpers";

import { obtenerPlanos } from "@/lib/firebaseHelpers";


function CatalogoPageInner() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const estadoParam = searchParams.get('estado') || "Todos";
    const categoriaParam = searchParams.get('categoria') || "Todos";

    const [planosMock, setPlanosMock] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const perfil = { tieneMembresia: true };

    const [searchQuery, setSearchQuery] = useState("");
    const handleSearch = (q) => setSearchQuery(q);

    // --- Cargar datos firebase
    useEffect(() => {
        setLoading(true);
        obtenerPlanos()
            .then(data => {
                setPlanosMock(data);
                setLoading(false);
            })
            .catch((err) => {
                setError("Error cargando el catálogo: " + err.message);
                setPlanosMock([]);
                setLoading(false);
            });
    }, []);

    // --- Calcular categorías y estados filtrados según la selección del otro
    const estadosDisponibles = useMemo(() => {
        let filtrados = planosMock;
        if (categoriaParam !== "Todos") {
            filtrados = planosMock.filter(p =>
                typeof p.categoria === "string" && p.categoria.trim() === categoriaParam
            );
        }
        return ["Todos", ...Array.from(
            new Set(filtrados.map(p =>
                typeof p.estado === "string" ? p.estado.trim() : ""
            ).filter(Boolean))
        ).filter(e => e && e !== "Sin Estado" && e !== "Todos")];
    }, [planosMock, categoriaParam]);

    const categoriasDisponibles = useMemo(() => {
        let filtrados = planosMock;
        if (estadoParam !== "Todos") {
            filtrados = planosMock.filter(p =>
                typeof p.estado === "string" && p.estado.trim() === estadoParam
            );
        }
        return ["Todos", ...Array.from(
            new Set(filtrados.map(p =>
                typeof p.categoria === "string" ? p.categoria.trim() : ""
            ).filter(Boolean))
        ).filter(c => c && c !== "Sin Categoría" && c !== "Todos")];
    }, [planosMock, estadoParam]);

    // --- Si el valor seleccionado ya no existe en la lista, resetea a "Todos"
    useEffect(() => {
        if (
            estadoParam !== "Todos" &&
            !estadosDisponibles.includes(estadoParam)
        ) {
            handleEstadoChange("Todos");
        }
        // eslint-disable-next-line
    }, [categoriaParam, estadosDisponibles]);

    useEffect(() => {
        if (
            categoriaParam !== "Todos" &&
            !categoriasDisponibles.includes(categoriaParam)
        ) {
            handleCategoriaChange("Todos");
        }
        // eslint-disable-next-line
    }, [estadoParam, categoriasDisponibles]);

    // --- Handlers de los dropdowns
    const handleEstadoChange = (nuevoEstado) => {
        const params = new URLSearchParams(searchParams);
        if (nuevoEstado === "Todos") params.delete("estado");
        else params.set("estado", nuevoEstado);
        router.push(`/catalogo?${params.toString()}`);
    };

    const handleCategoriaChange = (nuevaCategoria) => {
        const params = new URLSearchParams(searchParams);
        if (nuevaCategoria === "Todos") params.delete("categoria");
        else params.set("categoria", nuevaCategoria);
        router.push(`/catalogo?${params.toString()}`);
    };

    // --- Filtro combinado
    const planosFiltrados = useMemo(() => {
        // Primero filtras por estado/categoría
        let resultado = planosMock.filter(p => {
            const estadoPlano = typeof p.estado === "string" ? p.estado.trim() : "";
            const categoriaPlano = typeof p.categoria === "string" ? p.categoria.trim() : "";
            const pasaEstado = estadoParam === "Todos" || estadoPlano === estadoParam;
            const pasaCategoria = categoriaParam === "Todos" || categoriaPlano === categoriaParam;
            return pasaEstado && pasaCategoria;
        });
        // Después, si hay búsqueda, filtramos también por el texto:
        if (searchQuery.trim() !== "") {
            resultado = filtrarPlanos(resultado, searchQuery);
        }
        return resultado;
    }, [planosMock, estadoParam, categoriaParam, searchQuery]);

    if (loading) return <section style={{padding: "2rem", textAlign: "center"}}>Cargando catálogo...</section>;
    if (error) return <section style={{padding: "2rem", color: "#a85353", textAlign: "center"}}>{error}</section>;

    return (
        <main>
            <ScrollToTopOnNavigation />

            <section className={"wrapper"}>
                <SearchBar onSearch={handleSearch} placeholder="Buscar en catálogo..." />
            </section>

            <Catalogo
                planos={planosFiltrados}
                categorias={estadosDisponibles}
                categoriaActual={estadoParam}
                onCategoriaChange={handleEstadoChange}
                tiposCategoria={categoriasDisponibles}
                tipoCategoriaActual={categoriaParam}
                onTipoCategoriaChange={handleCategoriaChange}
                perfil={perfil}
            />
        </main>
    );
}

export default function CatalogoPage() {
    return (
        <Suspense fallback={<div>Cargando catálogo...</div>}>
            <CatalogoPageInner />
        </Suspense>
    );
}
