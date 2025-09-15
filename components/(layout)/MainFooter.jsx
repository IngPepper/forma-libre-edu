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
                        <li><Link href="/cookies" className={styles.navLink}>Cookies</Link></li>
                        <li><Link href="/acerca" className={styles.navLink}>Acerca</Link></li>
                        <li><Link href="/politicas" className={styles.navLink}>Políticas</Link></li>
                        <li><Link href="/contacto" className={styles.navLink}>Contacto</Link></li>
                        <li><Link href="/privacidad" className={styles.navLink}>Privacidad</Link></li>
                        <li><Link href="/mapa" className={styles.navLink}>Mapa del sitio</Link></li>
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