import DetallePlano from "@/components/(layout)/DetallePlano";

export default async function LevantamientoDetallePage({ params }) {
    const res = await fetch('http://localhost:3000/data/planosMock.json', { cache: 'no-store' });
    const planosData = await res.json();

    const id = String(params.id);
    const plano = planosData.find(p => String(p.id) === id);

    if (!plano) {
        return (
            <div style={{ padding: "3em 0", textAlign: "center", color: "#a85353" }}>
                <h2>Plano no encontrado</h2>
                <p>El plano solicitado no existe o fue removido.</p>
            </div>
        );
    }

    return (
        <section className={"wrapper"}>
            <DetallePlano {...plano} />
            <div className={"add500"}></div>
        </section>
    );
}
