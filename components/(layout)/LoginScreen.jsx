'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './LoginScreen.module.css';

import { FcGoogle } from "react-icons/fc";
import { FaFacebookSquare, FaApple } from "react-icons/fa";

import { loginWithEmail } from "@/lib/authHelpers";
import { useUser } from "@/context/UserContext";
import Image from "next/image";

import Apploader from "@/components/(utilities)/AppLoader.jsx";

export default function LoginScreen() {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [firebaseError, setFirebaseError] = useState("");

    const { user, loading, refetchUser } = useUser();
    const router = useRouter();



    // Redirige si ya está logueado
    // (opcional: puedes manejarlo también solo después del submit)
    // useEffect(() => {
    //     if (!loading && user) {
    //         router.push('/cuenta');
    //     }
    // }, [user, loading, router]);

    if (loading) {
        return <Apploader />;
    }

    const validate = () => {
        const newErrors = {};
        if (!form.email) newErrors.email = "Email is required";
        else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) newErrors.email = "Invalid email";
        if (!form.password) newErrors.password = "Password is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFirebaseError("");
        if (validate()) {
            setSubmitting(true);
            try {
                await loginWithEmail(form.email, form.password);
                await refetchUser();   // <- Aquí fuerza recarga del usuario
                router.push('/cuenta');
            } catch (err) {
                setFirebaseError(err.message);
            }
            setSubmitting(false);
        }
    };

    return (
        <section className={`wrapper minimalContentView`}>
            <h1 className={"smallerText"}>Loguéate /</h1>
            <div className={styles.modalWrapper}>
                <section className={styles.modal}>
                    <div className={styles.modalWrapper}>
                        <Image
                            className={styles.isoEffect}
                            src="/assets/iso02S_marron_t.svg"
                            alt="Fondo artístico"
                            width={150}
                            height={150}
                            style={{ objectFit: "cover"}}
                            priority
                        />
                    </div>
                    {/*
                    <div className={styles.socials}>
                        <button type="button" className={styles.socialBtn + ' ' + styles.google} disabled>
                            <FcGoogle className={styles.socialIcon} />
                            Continue with Google
                        </button>
                        <button type="button" className={styles.socialBtn + ' ' + styles.apple} disabled>
                            <FaApple className={styles.socialIcon} />
                            Continue with Apple
                        </button>
                        <button type="button" className={styles.socialBtn + ' ' + styles.facebook} disabled>
                            <FaFacebookSquare className={styles.socialIcon} />
                            Continue with Facebook
                        </button>
                    </div>
                    <div className={styles.separator}><span>or</span></div>
                    */}

                    <form className={styles.form} onSubmit={handleSubmit} noValidate>
                        <label className={styles.label}>
                            Correo
                            <input
                                className={`${styles.input} ${errors.email ? styles.errorInput : ''}`}
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={form.email}
                                onChange={handleChange}
                                disabled={submitting}
                            />
                            {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
                        </label>
                        <label className={styles.label}>
                            Contraseña
                            <input
                                className={`${styles.input} ${errors.password ? styles.errorInput : ''}`}
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                value={form.password}
                                onChange={handleChange}
                                disabled={submitting}
                            />
                            {errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
                        </label>
                        <button className={styles.button} type="submit" disabled={submitting}>
                            {submitting ? "Logueando..." : "Loguéate"}
                        </button>
                        {firebaseError && <div className={styles.errorMsg}>{firebaseError}</div>}
                    </form>
                    <p className={styles.text}>
                        ¿No tienes una cuenta?<br/>{" "}
                        <Link href="/register" className={styles.link}>Crea una aquí</Link>
                    </p>
                    <p className={styles.terms}>
                        Al acceder aceptas que eres mayor de 18 años y nuestras{" "}
                        <Link href="/privacidad" className={styles.termsLink}>Política de privacidad</Link> y{" "}
                        <Link href="/politicas" className={styles.termsLink}>Términos y condiciones</Link>.
                    </p>
                </section>
            </div>
        </section>

    );
}
