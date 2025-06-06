// /app/levantamientos/[id]/page.jsx
import DetallePlano from "@/components/(layout)/DetallePlano";
// Si tu mock está en /public/data/planosMock.json, impórtalo así:
import planosData from "@/public/data/planosMock.json"; // Ajusta la ruta si es necesario

export default async function LevantamientoDetallePage({ params }) {
    const { id } = params;

    // Busca el plano correspondiente
    const plano = planosData.find(p => String(p.id) === String(id));

    if (!plano) {
        return (
            <div style={{
                padding: "3em 0",
                textAlign: "center",
                color: "#a85353"
            }}>
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