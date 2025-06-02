"use client";
import styles from './Catalogo.module.css';
import ListaPlanos from './ListaPlanos';
import { BsBox2Heart } from "react-icons/bs";
import { MdOutlineArrowDropDown } from "react-icons/md";

export default function Catalogo({
                                     planos,
                                     onCategoriaChange,
                                     categoriaActual,
                                     categorias = ["Todos"],
                                     perfil,
                                 }) {
    // Asegura que categorias sea siempre un array, nunca undefined ni null
    const usarDropdown = Array.isArray(categorias) && categorias.length > 5;

    return (
        <section className={styles.catalogo}>
            <h1 className={styles.smallerText}>Auto CAD / Editables</h1>
            <nav className={usarDropdown ? styles.categorias : styles.categoriasRow}>
                {usarDropdown ? (
                    <div className={styles.dropdownContainer}>
                        <span className={styles.leyenda}>
                            <BsBox2Heart className={styles.iconLeyenda} />
                            Selecciona la categoría
                        </span>
                        <div className={styles.selectWrapper}>
                            <select
                                className={styles.dropdown}
                                value={categoriaActual}
                                onChange={e => onCategoriaChange(e.target.value)}
                            >
                                {categorias.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                            <MdOutlineArrowDropDown className={styles.iconDropdown} />
                        </div>
                    </div>
                ) : (
                    categorias.map(cat => (
                        <button
                            key={cat}
                            className={`${styles.categoriaBtn} ${categoriaActual === cat ? styles.activo : ''}`}
                            onClick={() => onCategoriaChange(cat)}
                            type="button"
                        >
                            <BsBox2Heart className={styles.iconBtn} />
                            {cat}
                        </button>
                    ))
                )}
            </nav>
            <ListaPlanos planos={planos} perfil={perfil} />
        </section>
    );
}