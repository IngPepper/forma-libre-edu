'use client';
import { useState, useEffect } from "react";
import { obtenerPlanos } from "@/lib/firebaseHelpers";
import AdminConsole from "@/components/(layout)/AdminConsole";
import LoadingPage from "@/components/(utilities)/LoadingPage";

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
        return <LoadingPage />;
    }

    if (error) return <section className="wrapper"><div style={{color: "#a85353"}}>{error}</div></section>;

    return (
        <section className="wrapper">
            <h1 className={"smallerText"}>Admin Powers /</h1>
            <div className={"add500"}></div>
            <div className={"add500"}></div>
            <AdminConsole
                user={{ email: "admin@formalibre.com" }}
                planos={planos}
                setPlanos={setPlanos}
            />
        </section>
    );
}