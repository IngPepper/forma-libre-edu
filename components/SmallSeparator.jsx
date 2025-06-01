import styles from './SmallSeparator.module.css';
import Image from "next/image";
import imageTest from "@/public/assets/im19h_rotulador_lineas.jpg";

export default function SmallSeparator() {
    return (
        <section className={styles.container}>
            <Image
                src={imageTest}
                alt="Imagen ilustrativa"
                width={1024}
                height={300}
                className={styles.small}
                style={{ objectFit: "cover" }}
                placeholder="blur"
            />
            <div className={styles.gradientOverlay}></div>
        </section>
    );
}