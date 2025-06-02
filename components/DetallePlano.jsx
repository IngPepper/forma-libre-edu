// DetallePlano.jsx
"use client";
import styles from './DetallePlano.module.css';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

import ScrollToTopOnNavigation from "@/components/ScrollToTopOnNavigation";


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
                                         onBuy               // función que se dispara al comprar
                                     }) {
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
                        <Link href="/catalogo" className={styles.backBtn} title="Volver al catálogo">
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
                        <div className="noPadding">
                            <strong>Precio:</strong> <span className={styles.precio}>{precio}</span>
                        </div>
                    </div>
                    <button className={styles.comprar} onClick={onBuy}>
                        Comprar ahora
                    </button>
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
