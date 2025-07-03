export default function FailurePage() {
    return (
        <section style={{ padding: "3em 1em", textAlign: "center" }}>
            <h1>Pago rechazado</h1>
            <p>No pudimos procesar tu pago. Intenta nuevamente o usa otro método.</p>
            <a href="/checkout">Intentar de nuevo</a>
            <div className={"min"}></div>
            <div className={"min"}></div>
        </section>
    );
}