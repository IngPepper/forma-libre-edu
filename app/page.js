import styles from "./page.module.css";
import styles2 from "../components/ContentSection.module.css"
import MainNav from '@/components/MainNav';
import MainFooter from '@/components/MainFooter';
import ContentSection from "@/components/ContentSection";
import SearchBar  from "@/components/SearchBar";
import Image from "next/image";

// Si tu imagen está en public/, usa "/fondo.jpg"
// Si es de internet, usa la url completa y configúralo en next.config.js

export default function Home() {
    return (
        <div>
            <MainNav />
            <div className="wrapper">
                <ContentSection className={`topContent ${styles2.wrapperTop}`} title="Titulo o saludo">
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
                        <SearchBar />
                        <p className={styles.textColor}>Where does it come from?
                            Contrary to popular belSydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.</p>
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
                                placeholder="blur"
                                blurDataURL="..."
                            />
                        </div>
                        {/* Contenido encima */}
                        <div className={styles.contentOverlay}>
                            <p className={styles.textColor}>Where does it come from?
                                Contrary to popular belSydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.</p>
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
                            <p className={styles.textColor}>Where does it come from?
                                Contrary to popular belSydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.</p>
                        </div>
                    </div>
                </ContentSection>
            </div>
            <MainFooter />
        </div>
    );
}
