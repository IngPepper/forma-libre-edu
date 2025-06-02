"use client";
import styles from "./page.module.css";
import styles2 from "../components/ContentSection.module.css"
import ContentSection from "@/components/ContentSection";
import TripticoGeneral from "@/components/TripticoGeneral";

import SearchBar  from "@/components/SearchBar";
import Image from "next/image";
import ContentPriceCard from "@/components/ContentPriceCard";
import romboRojo from '@/public/assets/im16h_rombo_rojo.jpg';
import imageTest from '@/public/assets/im19h_rotulador_lineas.jpg';
import Link from "next/link";

// Si tu imagen está en public/, usa "/fondo.jpg"
// Si es de internet, usa la url completa y configúralo en next.config.js

export default function Home() {
    return (
        <div>
            <div className="wrapper">
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
                        <SearchBar />
                        <p className={styles.textColor}>Haz tuyo el espacio, comparte la forma</p>
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
                            <button >¡Comparte!</button>
                        </div>
                        <p className={styles.textColor}>Si has desarrollado un plano, un proyecto arquitectónico o una idea innovadora, súbelo a nuestra plataforma y permite que más personas aprendan, se inspiren y lleven sus propios proyectos al siguiente nivel.<br/>
                            Aquí, cada aporte cuenta y puede abrir nuevas posibilidades para la comunidad.<br/>
                            ¡Juntos hacemos que el diseño llegue más lejos!</p>
                    </div>
                </ContentSection>
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

                {/* Precios */}
                <ContentPriceCard
                    image={romboRojo}
                    title="Planes"
                    details={<ul>
                        <li>Acceso ilimitado</li>
                        <li>Soporte premium</li>
                        <li>Descargas instantáneas</li>
                    </ul>}
                    onBuy={(type, price) => alert(`Compraste: ${type} por $${price}`)}/>
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
            </div>
        </div>
    );
}
