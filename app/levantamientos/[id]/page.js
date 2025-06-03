'use client';
import { use, useEffect, useState } from "react";
import DetallePlano from '@/components/DetallePlano';
import ScrollToTopOnNavigation from "@/components/ScrollToTopOnNavigation";


export default function LevantamientoDetalle({ params }) {
    const { id } = use(params);

    const [plano, setPlano] = useState(null);
    const [loading, setLoading] = useState(true);

    // Simulación de perfil
    const perfil = { tieneMembresia: true };

    useEffect(() => {
        fetch('/data/planosMock.json')
            .then(res => res.json())
            .then(data => {
                const found = data.find(p => String(p.id) === String(id));
                setPlano(found || null);
                setLoading(false);
            })
            .catch(() => {
                setPlano(null);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div>Cargando...</div>;
    if (!plano) return <div>Plano no encontrado.</div>;

    return (
        <section className="wrapper">
            <ScrollToTopOnNavigation />
            <DetallePlano
                imagen={plano.imagen}
                titulo={plano.titulo}
                descripcion={plano.descripcion}
                categoria={plano.categoria}
                tamanoArchivo={plano.tamanoArchivo}
                tipoArchivo={plano.tipoArchivo}
                precio={plano.precio}
                infoExtra={plano.infoExtra}
                enlaces={plano.enlaces}
                perfil={perfil}
                onBuy={() => alert(`¡Compra iniciada para ${plano.titulo}!`)}
            />
        </section>
    );
}
