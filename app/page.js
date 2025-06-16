"use client";
import styles from "./page.module.css";
import styles2 from "../components/(layout)/ContentSection.module.css"
import ContentSection from "@/components/(layout)/ContentSection";
import TripticoGeneral from "@/components/(layout)/TripticoGeneral";

import SearchBar  from "@/components/(utilities)/SearchBar";
import Image from "next/image";
import romboRojo from '@/public/assets/im16h_rombo_rojo.jpg';
import imageTest from '@/public/assets/im19h_rotulador_lineas.jpg';
import Link from "next/link";
import ScrollToTopOnNavigation from "@/components/(utilities)/ScrollToTopOnNavigation";
import CollapsibleSection from "@/components/(utilities)/CollapsibleSection";

import React, { useState, useEffect } from "react";
import filtrarPlanos from '@/lib/searchHelpers.js';

import { obtenerPlanos } from "@/lib/firebaseHelpers";
import MainFooter from "@/components/(layout)/MainFooter.jsx";

// Si tu imagen está en public/, usa "/fondo.jpg"
// Si es de internet, usa la url completa y configúralo en next.config.js

export default function Home() {
    const [planos, setPlanos] = useState([]);
    const [filteredPlanos, setFilteredPlanos] = useState([]);
    //const [hasSearched, setHasSearched] = useState(false);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        obtenerPlanos().then(data => {
            setPlanos(data);
            setLoading(false);
        });
    }, []);

    const handleSearch = (q) => {
        setQuery(q);
        setFilteredPlanos(filtrarPlanos(planos, q));
    };

    if (loading) {
        return (
            <></>
        );
    }

    return (
        <>
            <div className="wrapper">
                <ScrollToTopOnNavigation />
                <h1 className={"smallerText"}>Inicio /</h1>
                {/* --- SEARCH BAR --- */}
                <SearchBar onSearch={handleSearch} autoFocus={false} />
                {/* --- RESULTADOS FILTRADOS --- */}
                {query.trim() !== "" && (
                    <section className={styles2.wrapperTop}>
                        <h3 style={{
                            color: "#2b2b2b",
                            margin: "1rem 0",


                        }}>Resultados de búsqueda:</h3>
                        {filteredPlanos.length === 0 ? (
                            <div style={{
                                color: "#953232",
                                margin: "0",
                                background: "#f9f9f9",
                                borderRadius: "10px",
                                boxShadow:"var(--sombra)",
                                padding: "1rem",

                            }}>
                                No se encontraron resultados.
                            </div>
                        ) : (
                            <ul style={{ padding: 0, listStyle: "none" }}>
                                {filteredPlanos.map((plano, idx) => (
                                    <li
                                        key={plano.id}
                                        className={`${styles.catalogoItem} ${styles.resultItemAnim}`}
                                        style={{
                                            background: "#f9f9f9",
                                            margin: "1rem 0",
                                            borderRadius: "10px",
                                            boxShadow: "var(--sombra)",
                                            padding: "1rem",
                                            cursor: "pointer",
                                            transition: "background 0.2s",
                                            animationDelay: `${idx * 60}ms`, // <-- AQUÍ ya tienes idx
                                        }}
                                    >
                                        <Link href={`/levantamientos/${plano.id}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                                            <h4>{plano.titulo}</h4>
                                            <p>
                                                <b>Categoría:</b> {plano.categoria} &nbsp;
                                                <b>Estado:</b> {plano.estado || plano.isDonated || "N/A"}
                                            </p>
                                            <p>{plano.descripcion}</p>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                )}
                <CollapsibleSection
                    maxHeight = {600}
                >
                    {/*Principal con barra de búsqueda*/}
                    <ContentSection className={`topContent ${styles2.wrapperTop}`} title="Comparte, encuentra y descarga">
                        {/* Imagen de fondo */}
                        <div className={styles.backgroundImage}>
                            <Image
                                src={romboRojo}
                                alt="Fondo artístico"
                                fill
                                style={{ objectFit: "cover" }}
                                placeholder={"blur"}
                                priority

                            />
                        </div>
                        {/* Contenido encima */}
                        <div className={styles.contentOverlay}>
                            <Link href={"/formulario"} ><button>
                                ¡Comparte!
                            </button></Link>
                            <Image
                                src={imageTest}
                                alt="Imagen ilustrativa"
                                width={1024}
                                height={300}
                                style={{ margin: "2rem auto", display: "block", borderRadius: "12px", objectFit: "cover" }}
                                placeholder={"blur"}
                            />
                            <h2 className={styles.textColor}>La arquitectura y el diseño son para todos.</h2>
                            <div className={styles.textColor}>
                                <h3>Forma Libre es más que una plataforma de planos:</h3> <br/>
                                Es un estudio digital y una comunidad creativa que busca democratizar el acceso al conocimiento arquitectónico. El proyecto nace del deseo de compartir, inspirar y acompañar a quienes quieren crear, transformar o simplemente imaginar espacios — ya sean estudiantes, profesionistas o curiosos del diseño.

                                No solo vendes planos: creas una puerta de entrada a la arquitectura como experiencia abierta, colaborativa y contemporánea.</div>
                            <div className="centerContent">
                            </div>
                            <p className={styles.textColor}>Si has desarrollado un plano, un proyecto arquitectónico o una idea innovadora, súbelo a nuestra plataforma y permite que más personas aprendan, se inspiren y lleven sus propios proyectos al siguiente nivel.<br/>
                                Aquí, cada aporte cuenta y puede abrir nuevas posibilidades para la comunidad.<br/>
                                ¡Juntos hacemos que el diseño llegue más lejos!</p>
                        </div>
                    </ContentSection>

                </CollapsibleSection>
                <TripticoGeneral />
                {/* Bienvenida */}
                <ContentSection
                    title="Bienvenido a Forma Libre"
                    image="/assets/im01h_acentos_rojos.jpg"
                >
                    <p className={styles.textColor}>
                        <b>El diseño y el conocimiento arquitectónico al alcance de todos.</b>
                        <br /><br />
                        Somos tu punto de partida para explorar planos de calidad listos para descargar y aplicar. <br />
                        Forma Libre te conecta con ideas, inspiración y recursos para construir y transformar espacios con sentido.
                    </p>
                    <div>
                        <Link href="/catalogo" className={styles.textColor}>
                            Explorar Catálogo
                        </Link>
                    </div>
                </ContentSection>

                {/* Precios

                <ContentPriceCard
                    image={romboRojo}
                    title="Planes"
                    details={<ul>
                        <li>Acceso ilimitado</li>
                        <li>Soporte premium</li>
                        <li>Descargas instantáneas</li>
                    </ul>}
                    onBuy={(type, price) => alert(`Compraste: ${type} por $${price}`)}/>*/}

                <ContentSection
                    title="Quiénes Somos"
                    image="/assets/im01h_acentos_rojos.jpg"
                    reverse
                >
                    <p className={styles.textColor}>
                        <b>Forma Libre</b> es una comunidad creativa fundada por arquitectos apasionados, diseñadores y especialistas en tecnología.
                        Nuestro propósito es democratizar el acceso al conocimiento arquitectónico, facilitando recursos de calidad para estudiantes, profesionistas y entusiastas.
                        <br /><br />
                        <b>Misión:</b> Impulsar la creatividad y la formación compartiendo planos, herramientas y contenido educativo sin barreras.<br />
                        <b>Valores:</b> Colaboración, accesibilidad, innovación, integridad.
                    </p>
                </ContentSection>
                <ContentSection
                    title="¿Por qué elegir Forma Libre?"
                    image="/assets/im31h_paisaje_abstracto.jpg"
                >
                    <p className={styles.textColor}>
                        En Forma Libre combinamos la pasión por el diseño con la tecnología y la colaboración.
                        Nos distinguimos por ofrecer un catálogo cuidadosamente curado, recursos accesibles y una comunidad abierta donde el aprendizaje es continuo.
                        <br /><br />
                        Creemos que el acceso a planos de calidad no debe ser exclusivo ni complicado. Por eso, ofrecemos un espacio donde puedes descubrir, compartir y crecer, sin barreras ni burocracia.
                        <br /><br />
                        Nuestro compromiso es contigo: acompañarte en cada etapa de tu proceso creativo y ayudarte a lograr resultados profesionales, sin importar si eres principiante o experto.
                    </p>
                </ContentSection>
                <ContentSection
                    title="Beneficios de usar Forma Libre"
                    image="/assets/im32h_rombos_lineas.jpg"
                    reverse
                >
                    <div className={"wrapper"}>
                        <ul className={styles.textColor}>
                            <li><b>Catálogo variado y actualizado</b>: Encuentra desde planos clásicos hasta propuestas innovadoras, siempre revisadas por profesionales.</li>
                            <li><b>Accesibilidad</b>: Descarga, aprende y comparte sin costos ocultos ni procesos complicados.</li>
                            <li><b>Comunidad activa</b>: Participa, pregunta, recibe retroalimentación y conecta con personas con tus mismos intereses.</li>
                            <li><b>Inspiración y aprendizaje</b>: Acceso a contenido educativo, ejemplos prácticos y tendencias del mundo arquitectónico.</li>
                            <li><b>Comparte tu trabajo</b>: Publica tus propios diseños y obtén reconocimiento, consejos y nuevas oportunidades.</li>
                        </ul>
                    </div>
                </ContentSection>
            </div>
            <div className={"add100"}></div>
            <MainFooter/>
        </>
    );
}
