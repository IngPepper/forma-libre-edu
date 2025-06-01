"use client";
import styles from "./page.module.css";
import styles2 from "../components/ContentSection.module.css"
import ContentSection from "@/components/ContentSection";
import SearchBar  from "@/components/SearchBar";
import Image from "next/image";
import ContentPriceCard from "@/components/ContentPriceCard";
import romboRojo from '@/public/assets/im16h_rombo_rojo.jpg';
import imageTest from '@/public/assets/im19h_rotulador_lineas.jpg';

// Si tu imagen está en public/, usa "/fondo.jpg"
// Si es de internet, usa la url completa y configúralo en next.config.js

export default function Home() {
    return (
        <div>
            <div className="wrapper">
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
                        <p className={styles.textColor}>Where does it come from?
                            Contrary to popular belSydney College in Virginia, looked up one of the more .</p>
                        <Image
                            src={imageTest}
                            alt="Imagen ilustrativa"
                            width={1024}
                            height={300}
                            style={{ margin: "2rem auto", display: "block", borderRadius: "12px", objectFit: "cover" }}
                            placeholder={"blur"}
                        />
                        <h2 className={styles.textColor}> Title lalalalala</h2>
                        <p className={styles.textColor}>Where does it come from?
                            Contrary to popular belSydney College in Virginia, looked up one of the more .</p>
                        <div className="centerContent">
                            <button >¡Comparte!</button>
                        </div>

                    </div>
                </ContentSection>
                <ContentPriceCard
                    image={romboRojo}
                    title="Planes"
                    details={<ul>
                        <li>Acceso ilimitado</li>
                        <li>Soporte premium</li>
                        <li>Descargas instantáneas</li>
                    </ul>}
                    onBuy={(type, price) => alert(`Compraste: ${type} por $${price}`)}/>
                <ContentSection>
                    <div className="wrapper">
                        {/* Imagen de fondo */}
                        <div className={styles.backgroundImage}>
                            <Image
                                src="/assets/im16h_rombo_rojo.jpg"
                                alt="Fondo artístico"
                                fill
                                style={{ objectFit: "cover" }}
                                priority
                            />
                        </div>
                        {/* Contenido encima */}
                        <div className={styles.contentOverlay}>
                            <h2 className={styles.textColor}> Title lalalalala</h2>
                            <p className={styles.textColor}>Where does it come from?
                                Contrary to popular belSydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. &quot;Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of de Finibus Bonorum et Malorum&quot; (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, &quot;Lorem ipsum dolor sit amet..&quot;, comes from a line in section 1.10.32.</p>
                            <Image
                                src="/assets/im01h_acentos_rojos.jpg"
                                alt="Imagen ilustrativa"
                                width={1024}
                                height={300}
                                style={{ margin: "2rem auto", display: "block", borderRadius: "12px", objectFit: "cover" }}
                            />
                        </div>
                    </div>
                </ContentSection>

                <ContentSection>
                    <div className="wrapper">
                        {/* Imagen de fondo */}
                        <div className={styles.backgroundImage}>
                            <Image
                                src="/assets/im16h_rombo_rojo.jpg"
                                alt="Fondo artístico"
                                fill
                                style={{ objectFit: "cover" }}
                                priority
                            />
                        </div>
                        {/* Contenido encima */}
                        <div className={styles.contentOverlay}>
                            <h2 className={styles.textColor}> Title lalalalala</h2>
                            <Image
                                src="/assets/im01h_acentos_rojos.jpg"
                                alt="Imagen ilustrativa"
                                width={1024}
                                height={300}
                                style={{ margin: "2rem auto", display: "block", borderRadius: "12px", objectFit: "cover" }}
                            />
                            <p className={styles.textColor}>Where does it come from?
                                Contrary to popular belSydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of &quot;de Finibus Bonorum et Malorum&quot; (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, &quot;Lorem ipsum dolor sit amet..&quot;, comes from a line in section 1.10.32.</p>
                        </div>
                    </div>
                </ContentSection>
            </div>
        </div>
    );
}
