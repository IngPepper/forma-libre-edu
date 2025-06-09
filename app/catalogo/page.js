"use client";
import { Suspense } from "react";
import { useEffect, useState, useMemo } from "react";
import Catalogo from "../../components/(layout)/Catalogo";
import { useRouter, useSearchParams } from "next/navigation";
import ScrollToTopOnNavigation from "@/components/(utilities)/ScrollToTopOnNavigation";

// Componente hijo con hooks
function CatalogoPageInner() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Ahora usamos 'estado' en lugar de 'cat' como parámetro en la URL
    const estadoParam = searchParams.get('estado') || "Todos";
    const [planosMock, setPlanosMock] = useState([]);
    const [estados, setEstados] = useState(["Todos"]);
    const perfil = { tieneMembresia: true };

    useEffect(() => {
        fetch("/data/planosMock.json")
            .then(res => res.json())
            .then(data => {
                setPlanosMock(data);
                // Extrae todos los estados únicos (si falta, lo agrupa como 'Sin Estado')
                const lista = data.map(p => p.estado && p.estado.trim() ? p.estado : "Sin Estado");
                // Si no quieres mostrar 'Sin Estado', simplemente filtra después
                const unicos = Array.from(new Set(lista));
                setEstados(["Todos", ...unicos.filter(e => e !== "Sin Estado")]); // Quita 'Sin Estado' de los filtros si quieres
            })
            .catch((err) => {
                console.error("Error al cargar JSON:", err);
                setPlanosMock([]);
                setEstados(["Todos"]);
            });
    }, []);

    // Cambia el parámetro de búsqueda cuando seleccionas un estado
    const handleEstadoChange = (nuevoEstado) => {
        if (nuevoEstado === "Todos") {
            router.push("/catalogo"); // Limpia el query param
        } else {
            router.push(`/catalogo?estado=${encodeURIComponent(nuevoEstado)}`);
        }
    };

    // Filtra los planos por el estado seleccionado
    const planosFiltrados = useMemo(() => {
        if (estadoParam === "Todos") return planosMock;
        // Los que no tienen estado se consideran solo en 'Todos'
        return planosMock.filter(
            p => (p.estado && p.estado.trim() ? p.estado : "Sin Estado") === estadoParam
        );
    }, [planosMock, estadoParam]);

    return (
        <main>
            <ScrollToTopOnNavigation />
            <Catalogo
                planos={planosFiltrados}
                onCategoriaChange={handleEstadoChange}   // nombre del prop no afecta, pero podrías renombrar a onEstadoChange
                categoriaActual={estadoParam}            // igual, puedes cambiar a estadoActual en el hijo y aquí
                categorias={estados}                     // igual, puedes cambiar a estados en el hijo y aquí
                perfil={perfil}
            />
        </main>
    );
}

// El export por default solo regresa Suspense con el hijo
export default function CatalogoPage() {
    return (
        <Suspense fallback={<div>Cargando catálogo...</div>}>
            <CatalogoPageInner />
        </Suspense>
    );
}
