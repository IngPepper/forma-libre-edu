import { useState, useEffect, useRef, useMemo } from "react";
import styles from './Catalogo.module.css';
import ListaPlanos from './ListaPlanos';
import { BsBox2Heart } from "react-icons/bs";
import { TbFlagHeart } from "react-icons/tb";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { useUser } from "@/context/UserContext";
import SearchBar from "@/components/(utilities)/SearchBar.jsx";
import filtrarPlanos from "@/lib/searchHelpers";
import MainFooter from "@/components/(layout)/MainFooter.jsx";
import { estadosConIcono } from "@/components/(utilities)/MapaMexico";

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

function normalizarEstado(str) {
    if (!str) return "";
    return String(str)
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // quita acentos
        .replace(/[^\w\s]/gi, '') // quita emojis y símbolos raros
        .trim()
        .toLowerCase();
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

    // Estado para búsqueda
    const [searchQuery, setSearchQuery] = useState("");

    // Filtrar planos por estado/categoría y búsqueda
    const planosFiltrados = useMemo(() => {
        let resultado = planos.filter(p => {
            // Usa 'estado' para filtrar
            const estadoPlano = typeof p.estado === "string" ? p.estado.trim() : "";
            const categoriaPlano = typeof p.categoria === "string" ? p.categoria.trim() : "";

            // Filtra con normalización
            const pasaEstado = categoriaActual === "Todos"
                || normalizarEstado(estadoPlano) === normalizarEstado(categoriaActual);

            const pasaCategoria = tipoCategoriaActual === "Todos"
                || categoriaPlano === tipoCategoriaActual;

            return pasaEstado && pasaCategoria;
        });
        if (searchQuery.trim() !== "") {
            resultado = filtrarPlanos(resultado, searchQuery);
        }
        return resultado;
    }, [planos, categoriaActual, tipoCategoriaActual, searchQuery]);

    // Scroll infinito sobre resultados filtrados
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const loaderRef = useRef(null);

    useEffect(() => {
        setVisibleCount(PAGE_SIZE); // Reinicia al cambiar filtros o búsqueda
    }, [categoriaActual, tipoCategoriaActual, planosFiltrados, searchQuery]);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setVisibleCount(prev => Math.min(prev + PAGE_SIZE, planosFiltrados.length));
            }
        }, { threshold: 0.1 });

        const loader = loaderRef.current;
        if (loader) observer.observe(loader);

        return () => {
            if (loader) observer.unobserve(loader);
        };
    }, [planosFiltrados.length]);

    const planosVisibles = planosFiltrados.slice(0, visibleCount);

    // Ordena las listas de filtros
    const categoriasOrdenadas =
        categorias[0] === "Todos"
            ? ["Todos", ...categorias.slice(1).sort((a, b) => a.localeCompare(b, "es"))]
            : [...categorias].sort((a, b) => a.localeCompare(b, "es"));

    const tiposCategoriaOrdenados =
        tiposCategoria[0] === "Todos"
            ? ["Todos", ...tiposCategoria.slice(1).sort((a, b) => a.localeCompare(b, "es"))]
            : [...tiposCategoria].sort((a, b) => a.localeCompare(b, "es"));
    return (
        <>
                <section className={styles.catalogo}>
                    <h1 className={styles.smallerText}>Auto CAD / Editables</h1>

                    <nav className={usarDropdown ? styles.categorias : styles.categorias}>
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
                                        {categoriasOrdenadas.map(cat => {
                                            if (cat === "Todos") {
                                                return <option key={cat} value={cat}>Todos</option>;
                                            }
                                            const est = estadosConIcono.find(eObj => eObj.clave === cat);
                                            return (
                                                <option key={cat} value={cat}>
                                                    {est ? `${est.nombre} ${est.icono}` : cat}
                                                </option>
                                            );
                                        })}
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

                        {/* Barra de búsqueda */}
                        <div className={styles.barraBusquedaCounter}>
                            <SearchBar
                                onSearch={setSearchQuery}
                                placeholder="Buscar..."
                            />
                            <span className={styles.resultCount}>
                {planosFiltrados.length === 1 ? "1" : `${planosFiltrados.length}`}
              </span>
                        </div>
                    </nav>

                    {/* AQUÍ ES CLAVE: Cada plano tiene su id real de Firestore */}
                    <ListaPlanos planos={planosVisibles} perfil={user} />

                    {/* Loader visual o mensaje si se cargan todos */}
                    {visibleCount < planosFiltrados.length ? (
                        <div ref={loaderRef} className={styles.loader}>Cargando más resultados...</div>
                    ) : (
                        planosFiltrados.length === 0 ? <div className={styles.noResults}>Sin resultados.</div> : null
                    )}
                </section>
            <div className={"min"}></div>
            <MainFooter />
        </>
    );
}
