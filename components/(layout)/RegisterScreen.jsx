'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './RegisterScreen.module.css';

import { FcGoogle } from "react-icons/fc";
import { FaFacebookSquare, FaApple } from "react-icons/fa";

export default function RegisterScreen() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!form.name) newErrors.name = "Name is required";
        if (!form.email) newErrors.email = "Email is required";
        // Simple email regex
        else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) newErrors.email = "Invalid email";
        if (!form.password) newErrors.password = "Password is required";
        else if (form.password.length < 6) newErrors.password = "Min 6 characters";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            // Procesar registro aquí
            alert('Registro exitoso');
        }
    };

    return (
        <div className={styles.modalWrapper}>
            <section className={styles.modal}>
                <h2 className={styles.title}>Register</h2>

                <div className={styles.socials}>
                    <button type="button" className={styles.socialBtn + ' ' + styles.google}>
                        <FcGoogle src="/assets/google.svg" alt="Google" className={styles.socialIcon} />
                        Continue with Google
                    </button>
                    <button type="button" className={styles.socialBtn + ' ' + styles.apple}>
                        <FaApple src="/assets/apple.svg" alt="Apple" className={styles.socialIcon} />
                        Continue with Apple
                    </button>
                    <button type="button" className={styles.socialBtn + ' ' + styles.facebook}>
                        <FaFacebookSquare alt="Facebook" className={styles.socialIcon} />
                        Continue with Facebook
                    </button>
                </div>

                <div className={styles.separator}><span>or</span></div>

                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                    <label className={styles.label}>
                        Name
                        <input
                            className={`${styles.input} ${errors.name ? styles.errorInput : ''}`}
                            name="name"
                            type="text"
                            autoComplete="name"
                            value={form.name}
                            onChange={handleChange}
                        />
                        {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
                    </label>
                    <label className={styles.label}>
                        Email
                        <input
                            className={`${styles.input} ${errors.email ? styles.errorInput : ''}`}
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={form.email}
                            onChange={handleChange}
                        />
                        {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
                    </label>
                    <label className={styles.label}>
                        Password
                        <input
                            className={`${styles.input} ${errors.password ? styles.errorInput : ''}`}
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            value={form.password}
                            onChange={handleChange}
                        />
                        {errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
                    </label>
                    <button className={styles.button} type="submit">Register</button>
                </form>
                <p className={styles.text}>
                    Already have an account?{" "}
                    <Link href="/login" className={styles.link}>Sign in</Link>
                </p>
                <p className={styles.terms}>
                    By registering, you confirm you agree to our <Link href="/privacidad" className={styles.termsLink}>Privacy Policy</Link> and <Link href="/politicas" className={styles.termsLink}>Terms of Use</Link>.
                </p>
            </section>
        </div>
    );
}
