import fs from "fs";
import path from "path";
import DetallePlano from "@/components/(layout)/DetallePlano";

export default function LevantamientoDetallePage({ params }) {
    // Obtén la ruta absoluta al archivo JSON
    const filePath = path.join(process.cwd(), "public", "data", "planosMock.json");
    // Lee el archivo sincronamente (¡esto solo corre en server, es seguro!)
    const fileData = fs.readFileSync(filePath, "utf8");
    const planosData = JSON.parse(fileData);

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

