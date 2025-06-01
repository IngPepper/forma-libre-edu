"use client";
import styles from './ListaPlanos.module.css';
import Link from "next/link";

export default function ListaPlanos({ planos = [] }) {
    if (!planos.length) {
        return <div className={styles.empty}>No hay planos disponibles.</div>;
    }

    return (
        <div className={styles.lista}>
            {planos.map(plano => (
                <div className={styles.card} key={plano.id}>
                    <img src={plano.imagen} alt={plano.titulo} className={styles.imagen} />
                    <div className={styles.contenido}>
                        <h3 className={styles.titulo}>{plano.titulo}</h3>
                        <p className={styles.descripcion}>{plano.descripcion}</p>
                        <h2 className={styles.titulo}>{plano.categoria}</h2>
                        <Link
                            className={styles.detalles}
                            href={`/levantamientos/${plano.id}`}
                        >
                            Ver detalles
                        </Link>
                        <div className={styles.botones}>
                            <button className={styles.comprar}>Comprar</button>
                            <button className={styles.descargar}>Descargar</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}