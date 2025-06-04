import styles from './ListaPlanos.module.css';
import Link from "next/link";
import { useUser } from "@/context/UserContext"; // Importa el hook del contexto

export default function ListaPlanos({ planos = [] }) {
    const { user } = useUser(); // Obtén el usuario global

    if (!planos.length) {
        return <div className={styles.empty}>No hay planos disponibles.</div>;
    }

    const isSingle = planos.length === 1;

    // Handler para guardar la categoría antes de navegar
    const handleGuardarCategoria = (categoria) => {
        if (categoria) {
            localStorage.setItem('ultimaCategoria', categoria);
        }
    };

    // Lógica para saber si tiene membresía (ajusta según cómo guardes en el contexto)
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
                                <button className={styles.comprar}>Comprar</button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
