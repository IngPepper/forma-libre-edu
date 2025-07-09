// Estilos
import styles from './MainFooter.module.css';
import Link from 'next/link';
import { FaWhatsapp, FaFacebookSquare, FaInstagram } from "react-icons/fa";
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
                        <li><Link href="/faq" className={styles.navLink}>FAQ's</Link></li>
                        <li><Link href="/contacto" className={styles.navLink}>Contacto</Link></li>
                        <li><Link href="/mapa" className={styles.navLink}>Mapa del sitio</Link></li>
                        <li><Link href="/acerca" className={styles.navLink}>Acerca</Link></li>
                        <li><Link href="/politicas" className={styles.navLink}>Políticas</Link></li>
                    </ul>
                    <ul className={styles.linkListMedia}>
                        <Link href={'https://www.facebook.com/people/Forma-Libre/61576765829363/'} target="_blank" className={styles.navLink}><FaFacebookSquare /></Link>
                        <Link href={'https://www.instagram.com/_formalibre/'} target="_blank" className={styles.navLink}><FaInstagram /></Link>
                        <Link href={'https://x.com/_FormaLibre'} target="_blank" className={styles.navLink}><FaSquareXTwitter/></Link>
                        {/*    Boton de Whatsapp por si se necesita en un futuro
                        <Link
                            href="#"
                            target="_blank"
                            className={styles.navLink}
                        >
                            <FaWhatsapp />
                        </Link>
                        */}
                    </ul>
                </div>
            </footer>
            <div className={styles.agradecimiento}>
                <p className={styles.saludo}> Made with ❤️ by Errol Schneider; all rights reserved &copy; {new Date().getFullYear()}.</p>
            </div>
        </>

    );
}
export default MainFooter;