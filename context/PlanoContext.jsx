'use client';

import { createContext, useContext, useState, useEffect } from "react";
import {
    obtenerPlanos,
    agregarPlano,
    editarPlano,
    eliminarPlano,
    importarPlanos,
    // Puedes importar más helpers según los necesites
} from "@/lib/firebaseHelpers"; // Ajusta el path si es necesario

const PlanoContext = createContext();

export function PlanoProvider({ children }) {
    const [planos, setPlanos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Cargar planos al inicio (solo una vez)
    useEffect(() => {
        cargarPlanos();
    }, []);

    async function cargarPlanos() {
        setLoading(true);
        setError(null);
        try {
            const data = await obtenerPlanos();
            setPlanos(data);
        } catch (err) {
            setError("No se pudieron cargar los planos");
            setPlanos([]);
        } finally {
            setLoading(false);
        }
    }

    // Agregar un nuevo plano
    async function handleAgregarPlano(nuevoPlano) {
        try {
            await agregarPlano(nuevoPlano);
            await cargarPlanos(); // <--- recarga después de agregar
        } catch (err) {
            setError("No se pudo agregar el plano");
        }
    }

    // Editar un plano (sobreescribe todo el objeto)
    async function handleEditarPlano(id, data) {
        try {
            await editarPlano(id, data);
            await cargarPlanos(); // <--- recarga después de editar
        } catch (err) {
            setError("No se pudo editar el plano");
        }
    }

    // Eliminar un plano
    async function handleEliminarPlano(id) {
        try {
            await eliminarPlano(id);
            await cargarPlanos(); // <--- recarga después de eliminar
        } catch (err) {
            setError("No se pudo eliminar el plano");
        }
    }

    // (Opcional) Actualizar la foto de un nivel en un plano
    async function actualizarFotoNivel(idPlano, idxNivel, nuevaFoto) {
        const plano = planos.find(p => String(p.id) === String(idPlano));
        if (!plano) return;

        // Actualiza el nivel localmente
        const nuevosNiveles = plano.niveles.map((nivel, idx) =>
            idx === idxNivel ? { ...nivel, foto: nuevaFoto } : nivel
        );

        // Actualiza el plano en Firestore y localmente
        await handleEditarPlano(idPlano, { ...plano, niveles: nuevosNiveles });
    }

    // (Opcional) Agregar un nivel a un plano
    async function agregarNivelAPlano(idPlano, nuevoNivel) {
        const plano = planos.find(p => String(p.id) === String(idPlano));
        if (!plano) return;

        const nuevosNiveles = [...(plano.niveles || []), nuevoNivel];

        await handleEditarPlano(idPlano, { ...plano, niveles: nuevosNiveles });
    }

    async function handleImportarPlanos(planosArr) {
        try {
            await importarPlanos(planosArr);
            await cargarPlanos(); // Refresca la lista tras importar
        } catch (err) {
            setError("No se pudieron importar los planos");
        }
    }

    return (
        <PlanoContext.Provider value={{
            planos,
            setPlanos,
            loading,
            error,
            cargarPlanos,
            agregarPlano: handleAgregarPlano,
            editarPlano: handleEditarPlano,
            eliminarPlano: handleEliminarPlano,
            actualizarFotoNivel,
            agregarNivelAPlano,
            importarPlanos: handleImportarPlanos,
            // Puedes agregar más helpers según crezca tu admin
        }}>
            {children}
        </PlanoContext.Provider>
    );
}

// Custom hook para consumir el contexto
export function usePlano() {
    return useContext(PlanoContext);
}
