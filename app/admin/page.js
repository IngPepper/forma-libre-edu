'use client';
import { useState, useEffect } from "react";
import AdminConsole from "@/components/(layout)/AdminConsole";

export default function AdminPage() {
    const [planos, setPlanos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("/data/planosMock.json")
            .then(res => {
                if (!res.ok) throw new Error("No se pudo cargar el archivo de planos");
                return res.json();
            })
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

    if (loading) return <section className="wrapper">Cargando...</section>;
    if (error) return <section className="wrapper"><div style={{color: "#a85353"}}>{error}</div></section>;

    return (
        <section className="wrapper">
            <h1 className={"smallerText"}>Admin Powers /</h1>
            <AdminConsole
                user={{ email: "admin@formalibre.com" }}
                planos={planos}
                setPlanos={setPlanos}
            />
        </section>
    );
}