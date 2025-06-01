"use client";
import styles from './Catalogo.module.css';
import ListaPlanos from './ListaPlanos';

const categorias = [
    "Todos", "Residencial", "Comercial", "Oficinas", "Industrial"
];

export default function Catalogo({ planos, onCategoriaChange, categoriaActual }) {
    return (
        <section className={styles.catalogo}>
            <nav className={styles.categorias}>
                {categorias.map(cat => (
                    <button
                        key={cat}
                        className={`${styles.categoriaBtn} ${categoriaActual === cat ? styles.activo : ''}`}
                        onClick={() => onCategoriaChange(cat)}
                        type="button"
                    >
                        {cat}
                    </button>
                ))}
            </nav>
            <ListaPlanos planos={planos} />
        </section>
    );
}