"use client";
import styles from './MainNav.module.css';
// Importa íconos de react-icons
import { MdOutlineAccountCircle, MdMenu } from 'react-icons/md';
import Link from 'next/link';
// Importa el hook para obtener la ruta actual en Next.js App Router
import { usePathname } from 'next/navigation';

function MainNav() {
    // Obtiene la ruta actual del navegador (ej: "/catalogo", "/planes", etc.)
    const pathname = usePathname();

    // Determina si la ruta actual es "/catalogo"
    const esCatalogo = pathname === '/catalogo';

    return (
        // Contenedor principal del nav con estilos en Flexbox y padding
        <nav className={styles.navWrapper}>
            {/* Contenedor interno con grid y máximo de 1024px de ancho */}
            <div className={styles.container}>

                {/* Logotipo del sitio */}
                <Link href="/">
                    <img src="/assets/l02H_B_marron_t.svg" alt="Logotipo" className={styles.logo} />
                </Link>

                {/* Espaciador flexible para separar los elementos */}
                <div className={styles.spacer}></div>

                {/* Acciones del nav: enlaces principales, menú móvil y botón de cuenta */}
                <div className={styles.navActions}>

                    {/* Enlaces principales (visible en escritorio) */}
                    <div className={styles.navLinks}>
                        {/*
                          El enlace cambia a "Inicio" y lleva a "/" si la ruta es "/catalogo".
                          En cualquier otra ruta, muestra "Catálogo" y lleva a "/catalogo".
                        */}
                        <Link
                            href={esCatalogo ? '/' : '/catalogo'}
                            className={styles.navLink}
                        >
                            {esCatalogo ? 'Inicio' : 'Catálogo'}
                        </Link>

                        {/* Enlace a la página de planes */}
                        <Link href={'/planes'} className={styles.navLink}>Planes</Link>
                    </div>

                    {/* Botón del menú (visible solo en móviles) */}
                    <button className={styles.menuButton} aria-label="Menú">
                        <MdMenu className={styles.menuIcon}/>
                    </button>

                    {/* Botón de cuenta con ícono y texto (el texto se oculta en móviles) */}
                    <Link href={'/register'}>
                        <button className={styles.accountButton}>
                            <MdOutlineAccountCircle className={styles.menuIcon} />
                            <span className={styles.accountText}>Cuenta</span>
                        </button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default MainNav;
