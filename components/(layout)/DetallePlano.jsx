"use client";
import styles from './DetallePlano.module.css';
import { FaArrowLeft, FaDownload, FaShoppingCart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from "@/context/UserContext";
import { useCart } from "@/context/CartContext";
import toast from 'react-hot-toast';
import ScrollToTopOnNavigation from "@/components/(utilities)/ScrollToTopOnNavigation";
import { useIsClient } from "@/components/(utilities)/useIsClient";
import ModalLoading from "@/components/(modals)/ModalLoading"; // <-- Nuevo
import { estadosConIcono } from "@/components/(utilities)/MapaMexico";

function parsePrecio(precio) {
    const parsed = Number(String(precio).replace(/[^0-9.]+/g, ""));
    return isNaN(parsed) ? 0 : parsed;
}

function calcularBundle(niveles, infoExtraPlano = "") {
    let suma = niveles.reduce((acc, n) => acc + parsePrecio(n.precio), 0);
    let sumaMetros = niveles.reduce((acc, n) => acc + (Number(n.metrosCuadrados) || 0), 0);
    return {
        nombre: "",
        descripcion: niveles.map(n => n.nombre).join(", "),
        precio: `$${Math.round(suma * 0.95)}`,
        tipoArchivo: niveles[0]?.tipoArchivo || "",
        tamanoArchivo: niveles.map(n => n.tamanoArchivo).join(" + "),
        metrosCuadrados: sumaMetros,
        infoExtra: infoExtraPlano,
        enlaces: niveles.flatMap(n => n.enlaces || [])
    };
}

export default function DetallePlano({
                                         id, imagen, titulo, descripcion, categoria, estado, isDonated,
                                         tamanoArchivo, tipoArchivo, precio, enlaces = [],
                                         infoExtra, niveles, imagenGeneral, metrosCuadrados
                                     }) {
    const isClient = useIsClient();
    const estadoObj = estadosConIcono.find(est =>
        est.clave === estado ||
        `${est.nombre} ${est.icono}` === estado ||
        est.nombre === estado
    );
    const { user } = useUser();
    const { addToCart, cart } = useCart();
    const tieneMembresia = user?.membresia === "premium" || user?.tieneMembresia === true;
    const [ultimaCategoria, setUltimaCategoria] = useState("");
    const [loadingAdd, setLoadingAdd] = useState(false); // <-- Loader

    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const cat = localStorage.getItem('ultimaCategoria');
            setUltimaCategoria(cat ?? "");
        }
    }, []);

    const hayNiveles = Array.isArray(niveles) && niveles.length > 0;
    const slides = hayNiveles
        ? [calcularBundle(niveles, infoExtra), ...niveles]
        : [];
    const [slideActivo, setSlideActivo] = useState(0);
    const slide = hayNiveles ? slides[slideActivo] : null;

    const idCarrito = hayNiveles
        ? slideActivo === 0
            ? `${id}-bundle`
            : `${id}-nivel${slideActivo}`
        : String(id);
    const itemEnCarrito = isClient ? cart.find(item => String(item.id) === idCarrito) : null;
    const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;

    // ---- handleAddToCart con loader mínimo de 400ms
    const handleAddToCart = async () => {
        setLoadingAdd(true);
        try {
            if (hayNiveles) {
                addToCart({
                    id: idCarrito,
                    imagen: imagenGeneral || imagen,
                    titulo: `${titulo} - ${slide.nombre}`,
                    descripcion: slide.descripcion,
                    categoria,
                    precio: parsePrecio(slide.precio),
                    tamanoArchivo: slide.tamanoArchivo,
                    tipoArchivo: slide.tipoArchivo,
                    isDonated
                }, 1);
            } else {
                addToCart({
                    id: String(id),
                    imagen,
                    titulo,
                    descripcion,
                    categoria,
                    precio: parsePrecio(precio),
                    tamanoArchivo,
                    tipoArchivo,
                    isDonated
                }, 1);
            }
            await new Promise(res => setTimeout(res, 400));
            toast.success("¡Producto agregado al carrito!", { duration: 1000 });
        } finally {
            setLoadingAdd(false);
        }
    };

    const handleDownload = () => {
        alert(`Descargando ${titulo}${hayNiveles ? ` - ${slide.nombre}` : ''}...`);
    };

    const prevSlide = () => setSlideActivo(a => (a === 0 ? slides.length - 1 : a - 1));
    const nextSlide = () => setSlideActivo(a => (a === slides.length - 1 ? 0 : a + 1));

    const [touchStartX, setTouchStartX] = useState(null);
    const [touchEndX, setTouchEndX] = useState(null);

    const [animacionSlide, setAnimacionSlide] = useState("");
    const handleSwipe = (direction) => {
        setAnimacionSlide(direction === "left" ? styles.slideLeft : styles.slideRight);
        setTimeout(() => {
            setAnimacionSlide("");
            if (direction === "left") nextSlide();
            else prevSlide();
        }, 250);
    };


    return (
        <section>
            <ModalLoading visible={loadingAdd} texto="Agregando al carrito..." />
            <ScrollToTopOnNavigation />
            <h1 className={styles.smallerText}>Detalles / </h1>
            <section className={styles.detalle}>
                <h2 className={styles.titulo}>{titulo}</h2>
                <div className={styles.chipRow}>
                    <div className={styles.miniWrapper}>
                        <span className={styles.categoria}>{categoria}</span>
                        {estado && (
                            <span className={styles.estado}>
        {estadoObj ? `${estadoObj.nombre} ${estadoObj.icono}` : estado}
      </span>
                        )}
                    </div>
                    <div>
                        <button
                            type="button"
                            className={`${styles.backBtn} ${styles.backBtnReset}`}
                            title="Regresar"
                            onClick={() => {
                                if (window.history.length > 2) router.back();
                                else router.push('/catalogo');
                            }}
                        >
                            <FaArrowLeft size={16} />
                        </button>
                        <span className={styles.invisible}>Atrás</span>
                    </div>
                </div>
                <div className={styles.detalleImageWrapper}>
                    <div className={styles.nivelLabel}>
                        {slideActivo === 0
                            ? (hayNiveles ? "Paquete completo" : "")
                            : slides[slideActivo]?.nombre || ""}
                    </div>
                    <img
                        src={
                            // Si hay niveles y NO estamos en el bundle (slideActivo > 0), muestra la foto del nivel si existe.
                            hayNiveles && slideActivo > 0
                                ? slides[slideActivo]?.foto || imagenGeneral || imagen
                                : imagenGeneral || imagen
                        }
                        alt={titulo}
                        className={`${styles.imagen} ${animacionSlide}`}
                        onTouchStart={e => setTouchStartX(e.targetTouches[0].clientX)}
                        onTouchMove={e => setTouchEndX(e.targetTouches[0].clientX)}
                        onTouchEnd={() => {
                            if (touchStartX === null || touchEndX === null) return;
                            const distance = touchStartX - touchEndX;
                            const minSwipeDistance = 50;
                            if (distance > minSwipeDistance) {
                                handleSwipe("left");
                            } else if (distance < -minSwipeDistance) {
                                handleSwipe("right");
                            }
                            setTouchStartX(null);
                            setTouchEndX(null);
                        }}
                    />
                    <div className={styles.carouselDots}>
                        {slides.map((_, i) => (
                            <div key={i} className={styles.dotWrapper}>
                                <span
                                    className={`${styles.carouselDot} ${i === slideActivo ? styles.active : ''}`}
                                    onClick={() => setSlideActivo(i)}
                                />
                                <span className={styles.dotNumber}>{i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.contenido}>
                    {hayNiveles ? (
                        <div className={styles.carouselContainer}>
                            <div className={styles.carouselNav}>
                                <button onClick={prevSlide} type="button" aria-label="Anterior" className={styles.carouselBtn}>
                                    <FaChevronLeft />
                                </button>
                                <span className={styles.carouselLabel}>
                                    {slide.nombre}
                                    {slideActivo === 0 && <span className={styles.bundleBadge}>Paquete</span>}
                                </span>
                                <button onClick={nextSlide} type="button" aria-label="Siguiente" className={styles.carouselBtn}>
                                    <FaChevronRight />
                                </button>
                            </div>
                            <p className={styles.descripcion}>{descripcion}</p>
                            <div className={styles.carouselSlide}>
                                <p className={styles.conjuntoPlanos}>{slide.descripcion}</p>
                                <div className={styles.flagWrapper}>
                                    {/*Tipo de archivo*/}
                                    <div className={styles.tipoDeArchivo}><strong>Tipo:</strong> {slide.tipoArchivo}
                                    </div>
                                    {/*Metros Cuadrados*/}
                                    <div className={styles.metros2}>
                                        <strong>m&sup2;:</strong> {slide.metrosCuadrados ? slide.metrosCuadrados : "N/D"}
                                    </div>
                                </div>
                                {!tieneMembresia && (
                                    <div><strong>Precio:</strong> <span className={styles.precio}>
  ${Number(parsePrecio(slide.precio)).toLocaleString()}
</span></div>
                                )}
                                {isDonated && isDonated.trim().length > 0 && (
                                    <div>
                                        <strong className={styles.categoriaDonated}>Donado</strong>
                                    </div>
                                )}
                                <div className={styles.extra}>{slide.infoExtra}</div>
                                <div>
                                    {tieneMembresia ? (
                                        <button className={styles.comprar} onClick={handleDownload}>
                                            <FaDownload style={{ marginRight: 10 }} />
                                            Descargar
                                        </button>
                                    ) : (
                                        <button
                                            className={styles.comprar}
                                            onClick={handleAddToCart}
                                            disabled={loadingAdd}
                                        >
                                            <FaShoppingCart style={{ marginRight: 10 }} />
                                            Agregar al carrito
                                            {isClient && cantidadEnCarrito > 0 && (
                                                <span className={styles.cantidadEnCarrito}>
                                                    &nbsp;({cantidadEnCarrito} en carrito)
                                                </span>
                                            )}
                                        </button>
                                    )}
                                </div>
                                {slide.enlaces && slide.enlaces.length > 0 && (
                                    <div className={styles.enlaces}>
                                        <strong>Enlaces relevantes:</strong>
                                        <ul>
                                            {slide.enlaces.map((enlace, i) => (
                                                <li key={i}>
                                                    <a href={enlace.url} target="_blank" rel="noopener noreferrer">
                                                        {enlace.label}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className={styles.datos}>
                                <div className="noPadding">
                                    <strong>Tipo:</strong> {tipoArchivo}
                                    <div className="noPadding">
                                        <strong>Tamaño:</strong> {tamanoArchivo}
                                    </div>
                                    <div className="noPadding">
                                        <strong>Superficie:</strong> {metrosCuadrados ? `${metrosCuadrados} m²` : "N/D"}
                                    </div>
                                </div>

                                {!tieneMembresia && (
                                    <div className="noPadding">
                                        <strong>Precio:</strong> <span className={styles.precio}>
  ${Number(parsePrecio(precio)).toLocaleString()}
</span>
                                    </div>
                                )}
                                {isDonated && isDonated.trim().length > 0 && (
                                    <div className="noPadding">
                                        <strong className={styles.categoriaDonated}>Donado</strong>
                                    </div>
                                )}
                            </div>
                            <div className={styles.extra}>
                                {infoExtra}
                            </div>
                            <div>
                                {tieneMembresia ? (
                                    <button className={styles.comprar} onClick={handleDownload}>
                                        <FaDownload style={{ marginRight: 10 }} />
                                        Descargar
                                    </button>
                                ) : (
                                    <button
                                        className={styles.comprar}
                                        onClick={handleAddToCart}
                                        disabled={loadingAdd}
                                    >
                                        <FaShoppingCart style={{ marginRight: 10 }} />
                                        Agregar al carrito
                                        {isClient && cantidadEnCarrito > 0 && (
                                            <span className={styles.cantidadEnCarrito}>
                                                &nbsp;({cantidadEnCarrito} en carrito)
                                            </span>
                                        )}
                                    </button>
                                )}
                            </div>
                            {enlaces.length > 0 && (
                                <div className={styles.enlaces}>
                                    <strong>Enlaces relevantes:</strong>
                                    <ul>
                                        {enlaces.map((enlace, i) => (
                                            <li key={i}>
                                                <a href={enlace.url} target="_blank" rel="noopener noreferrer">
                                                    {enlace.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </section>
    );
}
