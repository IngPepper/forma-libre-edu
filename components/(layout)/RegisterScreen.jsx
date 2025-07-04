'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './RegisterScreen.module.css';

import { FcGoogle } from "react-icons/fc";
import { FaFacebookSquare, FaApple } from "react-icons/fa";

import { registerWithEmail } from "@/lib/authHelpers";
import { auth } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";
import { createUserProfile } from "@/lib/userHelpers";
import { useUser } from "@/context/UserContext";
import SmallSeparator from "@/components/(utilities)/SmallSeparator";

export default function RegisterScreen() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [firebaseError, setFirebaseError] = useState("");

    const { user } = useUser();
    const router = useRouter();

    // Redirige SOLO después del render, nunca en el render directamente
    useEffect(() => {
        if (user) {
            router.push('/');
        }
    }, [user, router]);

    const validate = () => {
        const trimmedPassword = form.password ? form.password.trim() : '';
        const trimmedEmail = form.email ? form.email.trim() : '';
        const trimmedName = form.name ? form.name.trim() : '';

        const newErrors = {};
        if (!trimmedName) newErrors.name = "Name is required";
        if (!trimmedEmail) newErrors.email = "Email is required";
        else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(trimmedEmail)) newErrors.email = "Invalid email";
        if (!trimmedPassword) newErrors.password = "Password is required";
        else if (trimmedPassword.length < 8) newErrors.password = "Mínimo 8 caracteres";
        else if (trimmedPassword.length > 32) newErrors.password = "Máximo 32 caracteres";
        else if (!/[A-Z]/.test(trimmedPassword)) newErrors.password = "Debe tener al menos una mayúscula";
        else if (!/[a-z]/.test(trimmedPassword)) newErrors.password = "Debe tener al menos una minúscula";
        else if (!/[0-9]/.test(trimmedPassword)) newErrors.password = "Debe tener al menos un número";
        else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(trimmedPassword)) newErrors.password = "Debe tener un caracter especial";

        if (!confirmPassword) newErrors.confirmPassword = "Confirma tu contraseña";
        else if (form.password && confirmPassword !== form.password) newErrors.confirmPassword = "Las contraseñas no coinciden";

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
                // 1. Registra al usuario en Firebase Auth
                await registerWithEmail(form.email, form.password, form.name);

                // 2. Actualiza el displayName en Auth (opcional, solo para que lo veas en Firebase Console)
                if (auth.currentUser) {
                    await updateProfile(auth.currentUser, {
                        displayName: form.name
                    });

                    // 3. Crea el perfil extendido en Firestore (usuarios o users, según tu helpers)
                    await createUserProfile(auth.currentUser, { nombre: form.name });
                }
                // 4. No redirijas aquí, espera a que lo haga el contexto por user
            } catch (err) {
                setFirebaseError(err.message);
            }
            setSubmitting(false);
        }
    };

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');




    return (
        <section className={`wrapper minimalContentView`}>
            <h1 className={"smallerText"}>Regístrate /</h1>
            <div className={styles.modalWrapper}>
                <section className={styles.modal}>
                    <div className={styles.modalWrapper}>
                        <Image
                            className={styles.isoEffect}
                            src="/assets/iso02S_marron_t.svg"
                            alt="Logotipo isotipo"
                            width={150}
                            height={150}
                            style={{
                                objectFit: "cover",
                            }}
                            priority
                        />
                    </div>
                    {/*
                Future functionality

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
                            Nombre
                            <input
                                className={`${styles.input} ${errors.name ? styles.errorInput : ''}`}
                                name="name"
                                type="text"
                                autoComplete="name"
                                value={form.name}
                                onChange={handleChange}
                                disabled={submitting}
                            />
                            {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
                        </label>
                        <label className={styles.label}>
                            Contraseña
                            <div className={styles.passwordField}>
                                <input
                                    className={`${styles.input} ${errors.password ? styles.errorInput : ''}`}
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    value={form.password}
                                    onChange={handleChange}
                                    disabled={submitting}
                                />
                                <button
                                    type="button"
                                    className={styles.showPasswordBtn}
                                    onClick={() => setShowPassword((v) => !v)}
                                    tabIndex={-1}
                                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </div>
                            {errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
                        </label>

                        <label className={styles.label}>
                            Confirmar contraseña
                            <div className={styles.passwordField}>
                                <input
                                    className={`${styles.input} ${errors.confirmPassword ? styles.errorInput : ''}`}
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    disabled={submitting}
                                />
                                <button
                                    type="button"
                                    className={styles.showPasswordBtn}
                                    onClick={() => setShowConfirmPassword((v) => !v)}
                                    tabIndex={-1}
                                    aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showConfirmPassword ? "🙈" : "👁️"}
                                </button>
                            </div>
                            {errors.confirmPassword && <span className={styles.errorMsg}>{errors.confirmPassword}</span>}
                        </label>
                        <ul className={styles.passwordRequirements}>
                            <li>Mínimo 8 caracteres</li>
                            <li>Al menos una mayúscula (A-Z)</li>
                            <li>Al menos una minúscula (a-z)</li>
                            <li>Al menos un número (0-9)</li>
                            <li>Al menos un caracter especial (!@#$...)</li>
                        </ul>
                        <button className={styles.button} type="submit" disabled={submitting}>
                            {submitting ? "Registrando..." : "Regístrate"}
                        </button>
                        {firebaseError && <div className={styles.errorMsg}>{firebaseError}</div>}
                    </form>
                    <p className={styles.text}>
                        ¿Ya tienes una cuenta? <br/>{" "}
                        <Link href="/login" className={styles.link}>Loguéate</Link>
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
