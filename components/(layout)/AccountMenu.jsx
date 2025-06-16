"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MdOutlineAccountCircle } from "react-icons/md";
import { HiStar } from "react-icons/hi2";
import { BsDoorClosedFill } from "react-icons/bs";
import { GrUserAdmin } from "react-icons/gr";
import styles from "./AccountMenu.module.css";
import { useUser } from "@/context/UserContext";
import ClickAwayListener from "@/components/(utilities)/ClickAwayListener"; // Ajusta la ruta según tu estructura


export default function AccountMenu({ onLogout = () => {} }) {
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);

    const { user } = useUser();
    const login = !!user;

    useEffect(() => {
        setMounted(true);
    }, []);

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

    const nombre = user?.nombre || "U";
    const iniciales = nombre
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

    // Nuevo: validación por rol o isAdmin
    const esAdmin = user?.rol === "admin" || user?.isAdmin === true;

    return (
        <div className={styles.avatarWrapper}>
            <button
                className={styles.avatarButton}
                aria-label="Menú de cuenta"
                onClick={() => setOpen((v) => !v)}
                type="button"
            >
                <span className={styles.avatar}>
                    {iniciales}
                    {user?.membresia === "premium" && (
                        <HiStar className={styles.premiumIcon} title="Membresía activa" />
                    )}
                </span>
            </button>
            {esAdmin && (
                <span className={styles.adminLegend}>Admin</span>
            )}
            {open && (
                <ClickAwayListener onClickAway={() => setOpen(false)}>
                    <div className={styles.menu}>
                        {user?.membresia === "premium" && (
                            <div className={styles.menuItemPremium}>
                                <HiStar className={styles.menuIconSmall} />
                                <span>Eres Premium</span>
                            </div>
                        )}
                        <Link href="/cuenta" className={styles.menuItem} onClick={() => setOpen(false)}>
                            <MdOutlineAccountCircle className={styles.menuIconSmall} />
                            <span>Cuenta</span>
                        </Link>
                        {/* Solo admins ven el link */}
                        {esAdmin && (
                            <Link href="/admin" className={styles.menuItem} onClick={() => setOpen(false)}>
                                <GrUserAdmin className={styles.menuIconSmall} />
                                <span>Panel</span>
                            </Link>
                        )}
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
                </ClickAwayListener>
            )}
        </div>
    );
}
