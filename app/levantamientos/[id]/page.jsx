"use client";
import React from "react";
import DetallePlano from "@/components/(layout)/DetallePlano";
import RequireAccount from "@/components/(utilities)/RequireAccount.jsx";
import { obtenerPlanoPorId } from "@/lib/firebaseHelpers";
import LoadingPage from "@/components/(utilities)/LoadingPage.jsx";
import MainFooter from "@/components/(layout)/MainFooter.jsx";

export default function LevantamientoDetallePage({ params }) {
    // ¡ESTO es lo nuevo!
    const { id } = React.use(params);

    const [plano, setPlano] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (!id) return;
        obtenerPlanoPorId(id).then(p => {
            setPlano(p);
            setLoading(false);
        });
    }, [id]);

    if (loading) {
        return <LoadingPage />;
    }

    if (!plano) {
        return (
            <div style={{ padding: "3em 0", textAlign: "center", color: "#a85353" }}>
                <h2>Plano no encontrado</h2>
                <p>El plano solicitado no existe o fue removido.</p>
            </div>
        );
    }

    return (
        <>
                <section className={"wrapper"}>
                    <DetallePlano {...plano} />
                </section>
        <MainFooter />
        </>
    );
}
