'use client';
import { useState, useEffect } from "react";
import { obtenerPlanos } from "@/lib/firebaseHelpers";
import AdminConsole from "@/components/(layout)/AdminConsole";
import Apploader from "@/components/(utilities)/AppLoader.jsx";
import MainFooter from "@/components/(layout)/MainFooter.jsx";

export default function AdminPage() {
    const [planos, setPlanos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        obtenerPlanos()
            .then(data => {
                setPlanos(data);
                setLoading(false);
            })
            .catch(err => {
                setError("Error cargando los planos: " + err.message);
                setPlanos([]);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <Apploader />;
    }

    if (error) return <section className="wrapper"><div style={{color: "#a85353"}}>{error}</div></section>;

    return (
        <>
            <div className={"add200"}></div>
            <section className="wrapper">
                <h1 className={"smallerText"}>Admin Powers /</h1>
                <AdminConsole
                    user={{ email: "admin@formalibre.com" }}
                    planos={planos}
                    setPlanos={setPlanos}
                />
            </section>
            <MainFooter />
        </>

    );
}