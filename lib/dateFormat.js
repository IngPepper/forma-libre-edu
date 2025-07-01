// helpers/dateFormat.js
export function formatoBonitoFecha(fechaIso) {
    if (!fechaIso) return "";
    const fecha = new Date(fechaIso);
    // Ej: "13 de junio de 2025"
    const bonita = fecha.toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
    // Reemplaza el último " de " por " del "
    return bonita.replace(/ de (\d{4})$/, " del $1");
}