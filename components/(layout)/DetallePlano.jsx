"use client";
import styles from './DetallePlano.module.css';
import { FaArrowLeft, FaDownload, FaShoppingCart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useUser } from "@/context/UserContext";
import { useCart } from "@/context/CartContext";
import toast from 'react-hot-toast';
import ScrollToTopOnNavigation from "@/components/(utilities)/ScrollToTopOnNavigation";
import { useIsClient } from "@/components/(utilities)/useIsClient"; // <--- Importante

function parsePrecio(precio) {
    const parsed = Number(String(precio).replace(/[^0-9.]+/g, ""));
    return isNaN(parsed) ? 0 : parsed;
}

function calcularBundle(niveles) {
    let suma = niveles.reduce((acc, n) => acc + parsePrecio(n.precio), 0);
    return {
        nombre:"",
        descripcion: niveles.map(n => n.nombre).join(", "),
        precio: `$${suma}`,
        tipoArchivo: niveles.map(n => n.tipoArchivo).join(" + "),
        tamanoArchivo: niveles.map(n => n.tamanoArchivo).join(" + "),
        infoExtra: "Incluye todas las plantas en un solo paquete.",
        enlaces: niveles.flatMap(n => n.enlaces || [])
    };
}

export default function DetallePlano({
                                         id, imagen, titulo, descripcion, categoria, estado, isDonated,
                                         tamanoArchivo, tipoArchivo, precio, enlaces = [],
                                         infoExtra, niveles, imagenGeneral
                                     }) {
    const isClient = useIsClient(); // <--- Hook para saber si es cliente

    const { user } = useUser();
    const { addToCart, cart } = useCart();
    const tieneMembresia = user?.membresia === "premium" || user?.tieneMembresia === true;
    const [ultimaCategoria, setUltimaCategoria] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const cat = localStorage.getItem('ultimaCategoria');
            setUltimaCategoria(cat ?? "");
        }
    }, []);

    const hayNiveles = Array.isArray(niveles) && niveles.length > 0;
    const slides = hayNiveles ? [calcularBundle(niveles), ...niveles] : [];
    const [slideActivo, setSlideActivo] = useState(0);
    const slide = hayNiveles ? slides[slideActivo] : null;

    const idCarrito = hayNiveles
        ? slideActivo === 0
            ? `${id}-bundle`
            : `${id}-nivel${slideActivo}`
        : String(id);
    const itemEnCarrito = isClient ? cart.find(item => String(item.id) === idCarrito) : null; // Solo en cliente
    const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;

    const handleAddToCart = () => {
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
        toast.success("¡Producto agregado al carrito!", { duration: 1000 });
    };

    const handleDownload = () => {
        alert(`Descargando ${titulo}${hayNiveles ? ` - ${slide.nombre}` : ''}...`);
    };

    const prevSlide = () => setSlideActivo(a => (a === 0 ? slides.length - 1 : a - 1));
    const nextSlide = () => setSlideActivo(a => (a === slides.length - 1 ? 0 : a + 1));

    return (
        <section>
            <ScrollToTopOnNavigation />
            <h1 className={styles.smallerText}>Detalles / </h1>
            <section className={styles.detalle}>
                <div className={styles.detalleImageWrapper}>
                    <div className={styles.imagenBox}>
                        <img src={imagenGeneral || imagen} alt={titulo} className={styles.imagen} />
                    </div>
                    <div className={styles.carouselDots}>
                        {slides.map((_, i) => (
                            <span
                                key={i}
                                className={`${styles.carouselDot} ${i === slideActivo ? styles.active : ''}`}
                                onClick={() => setSlideActivo(i)}
                            ></span>
                        ))}
                    </div>
                </div>
                <div className={styles.contenido}>
                    <div className={styles.chipRow}>
                        <div className={styles.miniWrapper}>
                            <span className={styles.categoria}>{categoria}</span>
                            {estado && <span className={styles.estado}>{estado}</span>}
                        </div>
                        <div>
                            <Link
                                href={ultimaCategoria && ultimaCategoria.length > 0 ? `/catalogo?cat=${encodeURIComponent(ultimaCategoria)}` : "/catalogo"}
                                className={styles.backBtn}
                                title="Volver a la categoría"
                            >
                                <FaArrowLeft size={16} />
                            </Link>
                            <span>Atrás</span>
                        </div>
                    </div>

                    <h2 className={styles.titulo}>{titulo}</h2>
                    {hayNiveles ? (
                        <div className={styles.carouselContainer}>
                            <div className={styles.carouselNav}>
                                <button onClick={prevSlide} type="button" aria-label="Anterior" className={styles.carouselBtn}>
                                    <FaChevronLeft />
                                </button>
                                <span className={styles.carouselLabel}>
                                    {slide.nombre}
                                    {slideActivo === 0 && <span className={styles.bundleBadge}>Bundle</span>}
                                </span>
                                <button onClick={nextSlide} type="button" aria-label="Siguiente" className={styles.carouselBtn}>
                                    <FaChevronRight />
                                </button>
                            </div>
                            <p className={styles.descripcion}>{descripcion}</p>
                            <div className={styles.carouselSlide}>
                                <p>{slide.descripcion}</p>
                                <div><strong>Tipo:</strong> {slide.tipoArchivo}</div>
                                <div><strong>Tamaño:</strong> {slide.tamanoArchivo}</div>
                                {!tieneMembresia && (
                                    <div><strong>Precio:</strong> <span className={styles.precio}>{slide.precio}</span></div>
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
                                        >
                                            <FaShoppingCart style={{ marginRight: 10 }} />
                                            Agregar al carrito
                                            {/* Solo muestra cantidadEnCarrito si es cliente */}
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
                                </div>
                                <div className="noPadding">
                                    <strong>Tamaño:</strong> {tamanoArchivo}
                                </div>
                                {!tieneMembresia && (
                                    <div className="noPadding">
                                        <strong>Precio:</strong> <span className={styles.precio}>{precio}</span>
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
                                    >
                                        <FaShoppingCart style={{ marginRight: 10 }} />
                                        Agregar al carrito
                                        {/* Solo muestra cantidadEnCarrito si es cliente */}
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
