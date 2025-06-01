// Estilos
import styles from './MainFooter.module.css';
import Link from 'next/link';
import { FaGithub, FaFacebook, } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { FaSquareXTwitter } from "react-icons/fa6";



function MainFooter() {
    return (
        <>

            <footer className={styles.footerWrapper}>
                <div className={styles.container}>
                    <div className={styles.breakDegradado}></div>
                    <Link href="/">
                        <img src="/assets/iso02S_marron_t.svg" alt="Logotipo" className={styles.logo} />
                    </Link>
                    <h1 className={styles.titulo}>Links Útiles</h1>
                    <ul className={styles.linkList}>
                        <li><a href="#cookies" className={styles.navLink}>Cookies</a></li>
                        <li><a href="#about" className={styles.navLink}>Acerca</a></li>
                        <li><a href="#policy" className={styles.navLink}>Políticas</a></li>
                        <li><a href="#contact" className={styles.navLink}>Contacto</a></li>
                        <li><a href="#privacy" className={styles.navLink}>Privacidad</a></li>
                        <li><a href="#sitemap" className={styles.navLink}>Mapa del sitio</a></li>
                    </ul>
                    <ul className={styles.linkListMedia}>
                        <Link href={'https://www.facebook.com/people/Forma-Libre/61576765829363/'} target="_blank" className={styles.navLink}><FaFacebook /></Link>
                        <Link href={'https://www.instagram.com/_formalibre/'} target="_blank" className={styles.navLink}><RiInstagramFill /></Link>
                        <Link href={'https://x.com/_FormaLibre'} target="_blank" className={styles.navLink}><FaSquareXTwitter/></Link>
                        <Link href={'https://github.com/IngPepper/forma-libre'} target="_blank" className={styles.navLink}><FaGithub /></Link>
                    </ul>
                </div>
            </footer>
            <div className={styles.agradecimiento}>
                <p>Made with ❤️ by Errol Schneider</p>
            </div>
        </>

    );
}
export default MainFooter;