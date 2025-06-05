"use client";
import styles from './DetallePlano.module.css';
import { FaArrowLeft, FaDownload, FaShoppingCart } from 'react-icons/fa';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useUser } from "@/context/UserContext";
import { useCart } from "@/context/CartContext";
import toast from 'react-hot-toast';
import ScrollToTopOnNavigation from "@/components/(utilities)/ScrollToTopOnNavigation";

function parsePrecio(precio) {
    // Devuelve número, si no se puede (ej: "¡Gratis!") regresa 0
    const parsed = Number(String(precio).replace(/[^0-9.]+/g, ""));
    return isNaN(parsed) ? 0 : parsed;
}

export default function DetallePlano({
                                         id,
                                         imagen,
                                         titulo,
                                         descripcion,
                                         categoria,
                                         isDonated,
                                         tamanoArchivo,
                                         tipoArchivo,
                                         precio,
                                         enlaces = [],
                                         infoExtra,
                                     }) {
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

    const handleDownload = () => {
        alert(`Descargando ${titulo}...`);
    };

    // Encuentra el item actual en el carrito para mostrar la cantidad
    const itemEnCarrito = cart.find(item => String(item.id) === String(id));
    const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;

    // Handler para agregar al carrito
    const handleAddToCart = () => {
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
        toast.success("¡Producto agregado al carrito!");
    };

    return (
        <section className={"wrapper"}>
            <ScrollToTopOnNavigation />
            <h1 className={styles.smallerText}>Detalles / </h1>
            <section className={styles.detalle}>
                <div className={styles.imagenBox}>
                    <img src={imagen} alt={titulo} className={styles.imagen} />
                </div>
                <div className={styles.contenido}>
                    <div className={styles.chipRow}>
                        {categoria && (
                            <span className={styles.categoria}>{categoria}</span>
                        )}
                        <Link
                            href={ultimaCategoria && ultimaCategoria.length > 0 ? `/catalogo?cat=${encodeURIComponent(ultimaCategoria)}` : "/catalogo"}
                            className={styles.backBtn}
                            title="Volver a la categoría"
                        >
                            <FaArrowLeft size={16} />
                        </Link>
                    </div>

                    <h2 className={styles.titulo}>{titulo}</h2>
                    <p className={styles.descripcion}>{descripcion}</p>
                    <div className={styles.datos}>
                        <div className="noPadding">
                            <strong>Tamaño:</strong> {tamanoArchivo}
                        </div>
                        <div className="noPadding">
                            <strong>Tipo:</strong> {tipoArchivo}
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

                    <div>
                        {tieneMembresia ? (
                            <button className={styles.comprar} onClick={handleDownload}>
                                <FaDownload style={{ marginRight: 10 }}/>
                                Descargar
                            </button>
                        ) : (
                            <button
                                className={styles.comprar}
                                onClick={handleAddToCart}
                            >
                                <FaShoppingCart style={{ marginRight: 10 }} />
                                Agregar al carrito
                                {cantidadEnCarrito > 0 && (
                                    <span className={styles.cantidadEnCarrito}>
                                        &nbsp;({cantidadEnCarrito} en carrito)
                                    </span>
                                )}
                            </button>
                        )}
                    </div>

                    <div className={styles.extra}>
                        {infoExtra}
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
                </div>
            </section>
        </section>
    );
}
