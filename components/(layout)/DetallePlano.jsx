"use client";
import styles from './DetallePlano.module.css';
import { FaArrowLeft, FaDownload, FaShoppingCart } from 'react-icons/fa';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import ScrollToTopOnNavigation from "@/components/(utilities)/ScrollToTopOnNavigation";

export default function DetallePlano({
                                         imagen,
                                         titulo,
                                         descripcion,
                                         categoria,
                                         tamanoArchivo,      // Ejemplo: "4.2 MB"
                                         tipoArchivo,        // Ejemplo: "DWG, PDF"
                                         precio,             // Ejemplo: "$199"
                                         enlaces = [],       // [{ label: 'Ver PDF', url: '...' }, ...]
                                         infoExtra,          // Texto extra o HTML
                                         perfil = {},        // Recibe perfil (puede traer tieneMembresia)
                                         onBuy               // función que se dispara al comprar
                                     }) {
    // Por defecto no hay membresía
    const tieneMembresia = perfil.tieneMembresia;

    // Estado para la última categoría
    const [ultimaCategoria, setUltimaCategoria] = useState("");

    // Al montar, lee localStorage
    useEffect(() => {
        if (typeof window !== "undefined") {
            const cat = localStorage.getItem('ultimaCategoria');
            setUltimaCategoria(cat ?? "");
        }
    }, []);

    // Handler para descarga (simulado, cámbialo por lógica real si lo necesitas)
    const handleDownload = () => {
        alert(`Descargando ${titulo}...`);
        // Aquí puedes poner tu lógica de descarga real, si aplica
    };

    return (
        <>
            <ScrollToTopOnNavigation />
            <h1 className={styles.smallerText}>Detalles / </h1>
            <section className={styles.detalle}>
                <div className={styles.imagenBox}>
                    <img src={imagen} alt={titulo} className={styles.imagen} />
                </div>
                <div className={styles.contenido}>
                    {/* Categoría tipo chip */}
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
                    </div>

                    {/* BOTÓN QUE CAMBIA SEGÚN MEMBRESÍA */}
                    <div>
                        {tieneMembresia ? (
                            <button className={styles.comprar} onClick={handleDownload}>
                                <FaDownload style={{ marginRight: 10 }}/>
                                Descargar
                            </button>
                        ) : (
                            <button className={styles.comprar} onClick={onBuy}>
                                <FaShoppingCart style={{ marginRight: 10 }} />
                                Comprar ahora
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
        </>
    );
}
