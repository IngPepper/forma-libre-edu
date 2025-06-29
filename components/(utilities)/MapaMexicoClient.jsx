"use client";
import React, { useState, useEffect } from "react";
import MapaMexico from "./MapaMexico";
import { obtenerPlanos } from "@/lib/firebaseHelpers.js";


// Función para contar planos por estado
function getConteoPorEstado(planos) {
    const conteo = {};
    planos.forEach(plano => {
        if (plano.codigoEstado) {
            conteo[plano.codigoEstado] = (conteo[plano.codigoEstado] || 0) + 1;
        }
    });
    return conteo;
}

export default function MapaMexicoClient() {
    const [planos, setPlanos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        obtenerPlanos()
            .then(data => setPlanos(data))
            .finally(() => setLoading(false));
    }, []);

    const conteo = getConteoPorEstado(planos);

    if (loading) return <div>Cargando mapa...</div>;

    return (
        <>
            <h1>Planos por estado /</h1>
            <MapaMexico planosPorEstado={conteo} />
            <p>
                Filtra los planos disponibles, solo haz click en el estado.
            </p>
        </>
    );
}