"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { MdOutlineAccountCircle, MdLogout, MdWorkspacePremium } from "react-icons/md";
import { RiVipCrownFill } from "react-icons/ri";
import { BsDoorClosedFill } from "react-icons/bs";
import styles from "./AccountMenu.module.css";

export default function AccountMenu({
                                        login = false,
                                        perfil = {},
                                        onLogout = () => {}
                                    }) {
    // Hooks arriba siempre
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    // Al montar, activa render cliente
    useEffect(() => {
        setMounted(true);
    }, []);

    // Cierra menú al dar click fuera
    useEffect(() => {
        if (!open) return;

        function handleClick(e) {
            // Si haces click fuera del menú, lo cierra
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    if (!mounted) {
        return <div className={styles.accountButtonSkeleton}></div>;
    }

    if (!login) {
        return (
            <Link href="/register" className={styles.accountButton} aria-label="Cuenta">
                <MdOutlineAccountCircle className={styles.menuIcon} />
                <span className={styles.accountText}>Cuenta</span>
            </Link>
        );
    }

    const nombre = perfil?.nombre || "U";
    const iniciales = nombre
        .split(" ")
        .map(n => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

    return (
        <div className={styles.avatarWrapper} ref={menuRef}>
            <button
                className={styles.avatarButton}
                aria-label="Menú de cuenta"
                onClick={() => setOpen(v => !v)}
                type="button"
            >
                <span className={styles.avatar}>
                    {iniciales}
                    {perfil?.tieneMembresia && (
                        <MdWorkspacePremium className={styles.premiumIcon} title="Membresía activa" />
                    )}
                </span>
            </button>
            {open && (
                <div className={styles.menu}>
                    {perfil?.tieneMembresia && (
                        <div className={styles.menuItemPremium}>
                            <RiVipCrownFill className={styles.menuIconSmall} />
                            <span>Eres Premium</span>
                        </div>
                    )}
                    <Link href="/public" className={styles.menuItem} onClick={() => setOpen(false)}>
                        <MdOutlineAccountCircle className={styles.menuIconSmall} />
                        <span>Cuenta</span>
                    </Link>
                    <button
                        className={styles.menuItem}
                        onClick={() => {
                            setOpen(false);
                            onLogout();
                        }}
                        type="button"
                    >
                        <BsDoorClosedFill className={styles.menuIconSmall} />
                        <span>Cerrar sesión</span>
                    </button>
                </div>
            )}
        </div>
    );
}
