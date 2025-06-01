"use client";
import { useState } from "react";
import Catalogo from '../../components/Catalogo';
import Link from "next/link";
import MainNav from "@/components/MainNav";
import MainFooter from "@/components/MainFooter";

// ¡El array original NUNCA CAMBIA!
const planosMock = [
    {
        id: 1,
        imagen: "https://placehold.co/400x200?text=Plano+1",
        titulo: "Casa Moderna",
        descripcion: "Plano arquitectónico residencial de una casa moderna.",
        categoria: "Oficinas"
    },
    {
        id: 2,
        imagen: "https://placehold.co/400x200?text=Plano+1",
        titulo: "Casa Moderna",
        descripcion: "Plano arquitectónico residencial de una casa moderna.",
        categoria: "Comercial"
    },
    {
        id: 3,
        imagen: "https://placehold.co/400x200?text=Plano+1",
        titulo: "Casa Moderna",
        descripcion: "Plano arquitectónico residencial de una casa moderna.",
        categoria: "Residencial"
    },
    {
        id: 4,
        imagen: "https://placehold.co/400x200?text=Plano+4",
        titulo: "Bodega Industrial",
        descripcion: "Plano para almacén de gran tamaño.",
        categoria: "Industrial"
    },

];

export default function CatalogoPage() {
    const [categoria, setCategoria] = useState("Todos");

    // SIEMPRE FILTRA SOBRE planosMock, NUNCA SOBRE PLANOS FILTRADOS ANTERIORES
    const planosFiltrados = categoria === "Todos"
        ? planosMock
        : planosMock.filter(p => p.categoria === categoria);

    return (
        <main>
            <div className="container">
                <h1>Catálogo</h1>
            </div>
            <Catalogo
                planos={planosFiltrados}
                onCategoriaChange={setCategoria}
                categoriaActual={categoria}
            />
        </main>
    );
}