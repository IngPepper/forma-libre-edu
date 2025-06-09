
export default function filtrarPlanos(planos, query) {
    if (!query) return planos;
    const q = query.toLowerCase().trim();
    return planos.filter(plano =>
        (plano.titulo && plano.titulo.toLowerCase().includes(q)) ||
        (plano.categoria && plano.categoria.toLowerCase().includes(q)) ||
        (plano.estado && plano.estado.toLowerCase().includes(q)) ||
        (plano.isDonated && plano.isDonated.toLowerCase().includes(q))
    );
}