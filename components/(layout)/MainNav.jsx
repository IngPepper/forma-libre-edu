"use client";

import { useState, useEffect } from 'react';
import styles from './MainNav.module.css';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useCart } from '@/context/CartContext';
import AccountMenu from './AccountMenu';
import BurgerMenuDropdown from '@/components/(utilities)/BurgerMenuDropdown';
import { MdOutlineAccountCircle } from "react-icons/md";
import { RiShoppingCartFill } from "react-icons/ri";
import { useIsClient } from '@/components/(utilities)/useIsClient';
import { logout } from '@/lib/authHelpers';
import { useNearBottom } from "@/components/(utilities)/useNearBottom";

export default function MainNav() {
    const pathname = usePathname();
    const router = useRouter();
    const esCatalogo = pathname === '/catalogo';

    const { user, refetchUser } = useUser();
    const { totalItems } = useCart();
    const isClient = useIsClient();
    const login = !!user && !!user.hasAnAccount;

    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    const cerrarSesionFn = async () => {
        await logout();
        if (refetchUser) await refetchUser();
        router.push('/');
    };

    const isNearBottom = useNearBottom(600);

    return (
        <nav className={`
                ${styles.navWrapper} 
                ${hydrated ? styles.navReady : ''} 
            `}>
            <div className={`                
                ${styles.container}
                ${isNearBottom ? styles.navAtBottom : ''}`
            }>
                <Link
                    href="/"
                    className={styles.logoLink}
                    onClick={(e) => {
                        if (window.location.pathname === "/") {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                    }}
                >
                    <img
                        src="/assets/l02H_B_marron_t.svg"
                        alt="Logotipo"
                        className={`${styles.logo} ${styles.logoGrande}`}
                    />
                    <img
                        src="/assets/iso02S_marron_t.svg"
                        alt="Logo compacto"
                        className={`${styles.logo} ${styles.logoMini}`}
                    />
                </Link>

                <div className={styles.navActions}>
                    <div className={styles.navLinks}>
                        <Link
                            href={esCatalogo ? '/' : '/catalogo'}
                            className={styles.navLink}
                        >
                            {esCatalogo ? 'Inicio' : 'Planos'}
                        </Link>
                    </div>

                    <Link href="/carrito" className={styles.cartLink} aria-label="Carrito">
                        <RiShoppingCartFill className={styles.cartIcon} />
                        {isClient && totalItems > 0 && (
                            <span className={styles.cartBadge}>{totalItems}</span>
                        )}
                    </Link>

                    <BurgerMenuDropdown />

                    {login ? (
                        <AccountMenu onLogout={cerrarSesionFn} />
                    ) : (
                        <Link href="/login" aria-label="Cuenta">
                            <button className={styles.accountButton} type="button">
                                <MdOutlineAccountCircle className={styles.menuIcon} />
                                <span className={styles.accountText}>Cuenta</span>
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
