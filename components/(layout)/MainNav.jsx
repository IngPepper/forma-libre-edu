"use client";
import styles from './MainNav.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AccountMenu from './AccountMenu'; // Ajusta la ruta si es necesario

// Simulación de login y perfil, cámbialo por tu lógica real de auth
import React, { useState } from "react";
import BurgerMenuDropdown from "@/components/(utilities)/BurgerMenuDropdown";

function MainNav() {
    const pathname = usePathname();
    const esCatalogo = pathname === '/catalogo';

    // Simulación de estado de login y perfil (opcional, puedes quitarlo si ya tienes auth)
    const [login, setLogin] = useState(true);

    const [perfil, setPerfil] = useState({
        nombre: "Luis L",
        email: "admin@formalibre.com",
        tieneMembresia: true
    });

    const cerrarSesionFn = () => {
        setLogin(false);
        setPerfil({});
    };

    return (
        <nav className={styles.navWrapper}>
            <div className={styles.container}>
                {/* Logotipo del sitio */}
                <Link href="/">
                    <img src="/assets/l02H_B_marron_t.svg" alt="Logotipo" className={styles.logo} />
                </Link>

                {/* Espaciador flexible */}
                <div className={styles.spacer}></div>

                {/* Acciones del nav */}
                <div className={styles.navActions}>

                    {/* Enlaces principales */}
                    <div className={styles.navLinks}>
                        <Link
                            href={esCatalogo ? '/' : '/catalogo'}
                            className={styles.navLink}
                        >
                            {esCatalogo ? 'Inicio' : 'Catálogo'}
                        </Link>
                        <Link href={'/planes'} className={styles.navLink}>Planes</Link>
                    </div>

                    {/* Menú móvil */}
                    <BurgerMenuDropdown />

                    {/* Botón de cuenta usando AccountMenu */}
                    <AccountMenu
                        login={login}
                        perfil={perfil}
                        onLogout={cerrarSesionFn}
                    />
                </div>
            </div>
        </nav>
    );
}

export default MainNav;
