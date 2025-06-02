"use client";
import styles from './ListaPlanos.module.css';
import Link from "next/link";

export default function ListaPlanos({ planos = [], perfil }) {
    if (!planos.length) {
        return <div className={styles.empty}>No hay planos disponibles.</div>;
    }

    const isSingle = planos.length === 1;

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
                        >
                            Ver detalles
                        </Link>
                        <div className={styles.botones}>
                            {perfil?.tieneMembresia ? (
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