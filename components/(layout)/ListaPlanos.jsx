import styles from './ListaPlanos.module.css';
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { useCart } from "@/context/CartContext";

// Helper para limpiar y convertir el precio
function parsePrecio(precio) {
    const parsed = Number(String(precio).replace(/[^0-9.]+/g, ""));
    return isNaN(parsed) ? 0 : parsed;
}

export default function ListaPlanos({ planos = [] }) {
    const { user } = useUser();
    const { addToCart } = useCart(); // <--- ¡Importante!

    if (!planos.length) {
        return <div className={styles.empty}>No hay planos disponibles.</div>;
    }

    const isSingle = planos.length === 1;

    const handleGuardarCategoria = (categoria) => {
        if (categoria) {
            localStorage.setItem('ultimaCategoria', categoria);
        }
    };

    const tieneMembresia = user?.membresia === "premium" || user?.tieneMembresia === true;

    return (
        <div className={styles.lista}>
            {planos.map(plano => (
                <div
                    key={plano.id}
                    className={`${styles.card} ${isSingle ? styles.singleCard : ""}`}
                >
                    <img src={plano.imagen} alt={plano.titulo} className={styles.imagen} />
                    <div className={styles.contenido}>
                        <h3 className={styles.titulo}>{plano.titulo}</h3>
                        <p className={styles.descripcion}>{plano.descripcion}</p>
                        <h2 className={styles.categoria}>{plano.categoria}</h2>
                        {typeof plano?.isDonated === "string" && plano.isDonated.length > 0 && (
                            <h2 className={styles.categoriaDonated}>{plano.isDonated}</h2>
                        )}
                        <Link
                            className={styles.detalles}
                            href={`/levantamientos/${plano.id}`}
                            onClick={() => {
                                handleGuardarCategoria(plano.categoria);
                                window.scrollTo(0, 0);
                            }}
                        >
                            Ver detalles
                        </Link>
                        <div className={styles.botones}>
                            {tieneMembresia ? (
                                <button className={styles.descargar}>Descargar</button>
                            ) : (
                                <button
                                    className={styles.comprar}
                                    onClick={() => addToCart({
                                        id: String(plano.id),
                                        imagen: plano.imagen,
                                        titulo: plano.titulo,
                                        descripcion: plano.descripcion,
                                        categoria: plano.categoria,
                                        precio: parsePrecio(plano.precio),
                                        tamanoArchivo: plano.tamanoArchivo,
                                        tipoArchivo: plano.tipoArchivo,
                                        isDonated: plano.isDonated
                                    }, 1)}
                                >
                                    Agregar al carrito
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
