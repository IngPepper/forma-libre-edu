// generarPlanos.cjs

const fs = require('fs');

const estadosConIcono = [
    { nombre: "Aguascalientes", icono: "🚉" },
    { nombre: "Baja California", icono: "🌵" },
    { nombre: "Baja California Sur", icono: "🏝️" },
    { nombre: "Campeche", icono: "🏰" },
    { nombre: "Chiapas", icono: "🌄" },
    { nombre: "Chihuahua", icono: "🐕" },
    { nombre: "Ciudad de México", icono: "🏙️" },
    { nombre: "Coahuila", icono: "🌵" },
    { nombre: "Colima", icono: "🌋" },
    { nombre: "Durango", icono: "🌲" },
    { nombre: "Estado de México", icono: "🏞️" },
    { nombre: "Guanajuato", icono: "⛪" },
    { nombre: "Guerrero", icono: "🏖️" },
    { nombre: "Hidalgo", icono: "🗿" },
    { nombre: "Jalisco", icono: "🎶" },
    { nombre: "Michoacán", icono: "🦋" },
    { nombre: "Morelos", icono: "🏵️" },
    { nombre: "Nayarit", icono: "🏄" },
    { nombre: "Nuevo León", icono: "⛰️" },
    { nombre: "Oaxaca", icono: "🎭" },
    { nombre: "Puebla", icono: "🍬" },
    { nombre: "Querétaro", icono: "🏛️" },
    { nombre: "Quintana Roo", icono: "🏝️" },
    { nombre: "San Luis Potosí", icono: "💧" },
    { nombre: "Sinaloa", icono: "🦐" },
    { nombre: "Sonora", icono: "🌵" },
    { nombre: "Tabasco", icono: "🍃" },
    { nombre: "Tamaulipas", icono: "🦀" },
    { nombre: "Tlaxcala", icono: "🏺" },
    { nombre: "Veracruz", icono: "🚢" },
    { nombre: "Yucatán", icono: "🦎" },
    { nombre: "Zacatecas", icono: "⛏️" }
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
        // Aquí agregas la imagen para el nivel:
        foto: `https://placehold.co/400x200?text=P${idPlano}-N${i + 1}`
    };
}

function crearPlano(id) {
    const numNiveles = Math.floor(Math.random() * 16); // 0 a 15 niveles
    const nivelArr = Array.from({ length: numNiveles }, (_, i) => crearNivel(i, id));
    const estadoObj = randomFrom(estadosConIcono);
    const estadoNombreConIcono = `${estadoObj.nombre} ${estadoObj.icono}`;

    return {
        id: id,
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
        niveles: nivelArr
    };
}

function crearPlanosFake(n = 20) {
    return Array.from({ length: n }, (_, i) => crearPlano(i + 1));
}

// --- USO PRINCIPAL ---
const planosFake = crearPlanosFake(25);

// Guarda el archivo en /public/data/planosMock.json (asegúrate que la carpeta exista)
const outputDir = './public/data';
const outputPath = `${outputDir}/planosMock.json`;

if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(planosFake, null, 2), 'utf-8');
console.log(`¡Listo! Archivo generado en ${outputPath}`);
