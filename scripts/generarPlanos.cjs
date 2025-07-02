// generarPlanos.cjs

const fs = require('fs');

const estadosConIcono = [
    { clave: "AGS", nombre: "Aguascalientes", icono: "🚉" },
    { clave: "BCN", nombre: "B California", icono: "🌵" },
    { clave: "BCS", nombre: "B.C. Sur", icono: "🏝️" },
    { clave: "CAM", nombre: "Campeche", icono: "🏰" },
    { clave: "CHP", nombre: "Chiapas", icono: "🌄" },
    { clave: "CHI", nombre: "Chihuahua", icono: "🐕" },         // CHI
    { clave: "CMX", nombre: "CDMX", icono: "🏙️" },              // CMX
    { clave: "COA", nombre: "Coahuila", icono: "🌵" },
    { clave: "COL", nombre: "Colima", icono: "🌋" },
    { clave: "DUR", nombre: "Durango", icono: "🌲" },
    { clave: "GRO", nombre: "Guerrero", icono: "🏖️" },
    { clave: "GTO", nombre: "Guanajuato", icono: "⛪" },
    { clave: "HGO", nombre: "Hidalgo", icono: "🗿" },
    { clave: "JAL", nombre: "Jalisco", icono: "🎶" },
    { clave: "MEX", nombre: "Edo Méx", icono: "🏞️" },
    { clave: "MIC", nombre: "Michoacán", icono: "🦋" },
    { clave: "MOR", nombre: "Morelos", icono: "🏵️" },
    { clave: "NAY", nombre: "Nayarit", icono: "🏄" },
    { clave: "NLE", nombre: "Nuevo León", icono: "⛰️" },        // NLE
    { clave: "OAX", nombre: "Oaxaca", icono: "🎭" },
    { clave: "PUE", nombre: "Puebla", icono: "🍬" },
    { clave: "QUE", nombre: "Querétaro", icono: "🏛️" },
    { clave: "ROO", nombre: "Quintana Roo", icono: "🏝️" },      // ROO
    { clave: "SLP", nombre: "S.L. Potosí", icono: "💧" },
    { clave: "SIN", nombre: "Sinaloa", icono: "🦐" },
    { clave: "SON", nombre: "Sonora", icono: "🌵" },
    { clave: "TAB", nombre: "Tabasco", icono: "🍃" },
    { clave: "TAM", nombre: "Tamaulipas", icono: "🦀" },
    { clave: "TLA", nombre: "Tlaxcala", icono: "🏺" },
    { clave: "VER", nombre: "Veracruz", icono: "🚢" },
    { clave: "YUC", nombre: "Yucatán", icono: "🦎" },
    { clave: "ZAC", nombre: "Zacatecas", icono: "⛏️" }
];

const categorias = ["Residencial", "Comercial", "Monumento", "Oficina", "Educativo", "Industrial"];

const nombresNiveles = [
    "Planta Baja", "Planta Alta", "Roof Garden", "Sótano", "Mezzanine", "Azotea",
    "Nivel 1", "Nivel 2", "Nivel 3", "Nivel 4", "Nivel 5", "Nivel 6", "Nivel 7", "Nivel 8", "Nivel 9", "Nivel 10"
];

function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomPrecio(base = 50, extra = 250) {
    return `$${base + Math.floor(Math.random() * extra)}`;
}

function randomMB() {
    return (1 + Math.random() * 2).toFixed(1) + " MB";
}

function randomMetrosCuadrados(min = 30, max = 200) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function crearNivel(i, idPlano) {
    return {
        nombre: nombresNiveles[i] || `Nivel ${i + 1}`,
        descripcion: [
            "Sala, comedor, cocina.",
            "Recámaras y baños.",
            "Espacio abierto.",
            "Estacionamiento subterráneo.",
            "Área social.",
            "Área de servicio."
        ][Math.floor(Math.random() * 6)],
        tamanoArchivo: randomMB(),
        tipoArchivo: "PDF",
        precio: randomPrecio(30, 120),
        infoExtra: [
            "Incluye detalles de acabados.",
            "Incluye instalaciones eléctricas.",
            "Ideal para reuniones.",
            "Con terraza panorámica.",
            "Incluye jardín interior."
        ][Math.floor(Math.random() * 5)],
        enlaces: [
            { label: "Ficha técnica", url: `/fichas/plano${idPlano}-nivel${i+1}` }
        ],
        foto: `https://placehold.co/400x200?text=P${idPlano}-N${i + 1}`,
        metrosCuadrados: randomMetrosCuadrados()
    };
}

function crearPlano(id) {
    const numNiveles = Math.floor(Math.random() * 16); // 0 a 15 niveles
    const nivelArr = Array.from({ length: numNiveles }, (_, i) => crearNivel(i, id));
    const estadoObj = randomFrom(estadosConIcono);
    const estadoNombreConIcono = `${estadoObj.nombre} ${estadoObj.icono}`;

    let metrosCuadrados;
    if (nivelArr.length > 0) {
        metrosCuadrados = nivelArr.reduce((acc, n) => acc + (Number(n.metrosCuadrados) || 0), 0);
    } else {
        metrosCuadrados = randomMetrosCuadrados();
    }

    return {
        imagen: `https://placehold.co/400x200?text=P+${id}`,
        titulo: randomFrom([
            "Plano Residencial Moderno",
            "Proyecto de Casa Contemporánea",
            "Diseño de Oficina Abierta",
            "Centro Educativo",
            "Monumento Urbano",
            "Edificio de Departamentos"
        ]),
        estado: estadoNombreConIcono,
        codigoEstado: estadoObj.clave,
        descripcion: randomFrom([
            "Proyecto residencial con varias plantas, listo para construcción.",
            "Diseño funcional y moderno para múltiples usos.",
            "Ideal para familias grandes o pequeñas oficinas.",
            "Con acabados de alta calidad y espacios abiertos.",
            "Incluye instalaciones listas para uso inmediato."
        ]),
        categoria: randomFrom(categorias),
        isDonated: Math.random() < 0.2 ? "donated" : "",
        precio: randomPrecio(),
        imagenGeneral: `https://placehold.co/400x200?text=Gen+${id}`,
        niveles: nivelArr,
        metrosCuadrados // <--- Aquí
    };
}

function crearPlanosFake(n = 20) {
    return Array.from({ length: n }, (_, i) => crearPlano(i + 1));
}

// --- USO PRINCIPAL ---
const planosFake = crearPlanosFake(50);

const outputDir = '../public/data';
const outputPath = `${outputDir}/planosMock.json`;

if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(planosFake, null, 2), 'utf-8');
console.log(`¡Listo! Archivo generado en ${outputPath}`);
