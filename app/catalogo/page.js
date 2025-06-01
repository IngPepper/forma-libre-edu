"use client";
import { useEffect, useState } from "react";
import Catalogo from "../../components/Catalogo";

export default function CatalogoPage() {
    const [categoria, setCategoria] = useState("Todos");
    const [planosMock, setPlanosMock] = useState([]);
    const [categorias, setCategorias] = useState(["Todos"]);
    const perfil = { tieneMembresia: true };

    useEffect(() => {
        fetch("/data/planosMock.json")
            .then(res => res.json())
            .then(data => {
                console.log("Planos cargados:", data);
                setPlanosMock(data);
                const cats = Array.from(new Set(data.map(p => p.categoria).filter(Boolean)));
                console.log("Categorias extraídas:", cats);
                setCategorias(["Todos", ...cats]);
            })
            .catch((err) => {
                console.error("Error al cargar JSON:", err);
                setPlanosMock([]);
                setCategorias(["Todos"]);
            });
    }, []);

    const planosFiltrados = categoria === "Todos"
        ? planosMock
        : planosMock.filter(p => p.categoria === categoria);

    return (
        <main>
            <Catalogo
                planos={planosFiltrados}
                onCategoriaChange={setCategoria}
                categoriaActual={categoria}
                categorias={categorias}
                perfil={perfil}
            />
        </main>
    );
}