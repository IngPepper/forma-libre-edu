import { useState, useEffect, useRef } from "react";
import styles from './Catalogo.module.css';
import ListaPlanos from './ListaPlanos';
import { BsBox2Heart } from "react-icons/bs";
import { TbFlagHeart } from "react-icons/tb";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { useUser } from "@/context/UserContext";
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

const PAGE_SIZE = 8;

export default function Catalogo({
                                     planos = [],
                                     onCategoriaChange,
                                     categoriaActual = "Todos",
                                     categorias = ["Todos"],
                                     tiposCategoria = ["Todos"],
                                     tipoCategoriaActual = "Todos",
                                     onTipoCategoriaChange,
                                     perfil,
                                 }) {
    const isMobile = useMobile(640);
    const usarDropdown = isMobile || (categorias.length > 5);
    const { user } = useUser();

    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const loaderRef = useRef(null);

    // Reiniciar al cambiar filtros o lista
    useEffect(() => {
        setVisibleCount(PAGE_SIZE);
    }, [categoriaActual, tipoCategoriaActual, planos]);

    // Trigger de scroll infinito
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setVisibleCount(prev => Math.min(prev + PAGE_SIZE, planos.length));
            }
        }, { threshold: 0.1 });

        const loader = loaderRef.current;
        if (loader) observer.observe(loader);

        return () => {
            if (loader) observer.unobserve(loader);
        };
    }, [planos.length]);

    const planosVisibles = planos.slice(0, visibleCount);

    const categoriasOrdenadas =
        categorias[0] === "Todos"
            ? ["Todos", ...categorias.slice(1).sort((a, b) => a.localeCompare(b, "es"))]
            : [...categorias].sort((a, b) => a.localeCompare(b, "es"));

    const tiposCategoriaOrdenados =
        tiposCategoria[0] === "Todos"
            ? ["Todos", ...tiposCategoria.slice(1).sort((a, b) => a.localeCompare(b, "es"))]
            : [...tiposCategoria].sort((a, b) => a.localeCompare(b, "es"));

    return (
        <RequireAccount>
            <section className={styles.catalogo}>
                <h1 className={styles.smallerText}>Auto CAD / Editables</h1>
                <nav className={usarDropdown ? styles.categorias : styles.categoriasRow}>
                    <section className={styles.miniFlex}>
                        <div className={styles.dropdownContainer}>
                            <span className={styles.leyenda}>
                                <TbFlagHeart className={styles.iconLeyenda} />
                                Estados
                            </span>
                            <div className={styles.selectWrapper}>
                                <select
                                    className={styles.dropdown}
                                    value={categoriaActual}
                                    onChange={e => onCategoriaChange(e.target.value)}
                                >
                                    {categoriasOrdenadas.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <MdOutlineArrowDropDown className={styles.iconDropdown} />
                            </div>
                        </div>

                        <div className={styles.dropdownContainer}>
                            <span className={styles.leyenda}>
                                <BsBox2Heart className={styles.iconLeyenda} />
                                Categoría
                            </span>
                            <div className={styles.selectWrapper}>
                                <select
                                    className={styles.dropdown}
                                    value={tipoCategoriaActual}
                                    onChange={e => onTipoCategoriaChange(e.target.value)}
                                >
                                    {tiposCategoriaOrdenados.map(tipo => (
                                        <option key={tipo} value={tipo}>{tipo}</option>
                                    ))}
                                </select>
                                <MdOutlineArrowDropDown className={styles.iconDropdown} />
                            </div>
                        </div>
                    </section>
                </nav>

                <ListaPlanos planos={planosVisibles} perfil={user} />

                {/* Loader visual o mensaje si se cargan todos */}
                {visibleCount < planos.length ? (
                    <div ref={loaderRef} className={styles.loader}>Cargando más resultados...</div>
                ) : (
                    planos.length === 0 ? <div className={styles.noResults}>Sin resultados.</div> : null
                )}
            </section>
        </RequireAccount>
    );
}
