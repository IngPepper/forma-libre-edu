import { useState, useEffect } from "react";
import styles from './Catalogo.module.css';
import ListaPlanos from './ListaPlanos';
import { BsBox2Heart } from "react-icons/bs";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { useUser } from "@/context/UserContext"; // ← Importa el contexto
import RequireAccount from "@/components/(utilities)/RequireAccount";

// Hook para detectar móvil
function useMobile(breakpoint = 640) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= breakpoint);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, [breakpoint]);

    return isMobile;
}

export default function Catalogo({
                                     planos,
                                     onCategoriaChange,
                                     categoriaActual,
                                     categorias = ["Todos"],
                                 }) {
    const isMobile = useMobile(640);
    const usarDropdown = isMobile || (categorias.length > 5);
    const { user } = useUser(); // ← Saca el perfil/usuario desde el contexto

    return (
        <RequireAccount>
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
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <MdOutlineArrowDropDown className={styles.iconDropdown} />
                            </div>
                        </div>
                    ) : (
                        categorias.map(cat => (
                            <button
                                key={cat}
                                className={`${styles.categoriaBtn} ${categoriaActual === cat ? styles.activo : ""}`}
                                onClick={() => onCategoriaChange(cat)}
                            >
                                {cat}
                            </button>
                        ))
                    )}
                </nav>
                {/* ...tu contenido, por ejemplo: */}
                <ListaPlanos planos={planos} perfil={user} /> {/* ← Manda el usuario/perfil a ListaPlanos */}
            </section>
        </RequireAccount>
    );
}
