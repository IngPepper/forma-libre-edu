'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './LoginScreen.module.css';

import { FcGoogle } from "react-icons/fc";
import { FaFacebookSquare, FaApple } from "react-icons/fa";

export default function LoginScreen() {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            // Procesar login aquí
            alert('Login successful');
        }
    };

    return (
        <div className={styles.modalWrapper}>
            <section className={styles.modal}>
                <h2 className={styles.title}>Sign in</h2>

                <div className={styles.socials}>
                    <button type="button" className={styles.socialBtn + ' ' + styles.google}>
                        <FcGoogle className={styles.socialIcon} />
                        Continue with Google
                    </button>
                    <button type="button" className={styles.socialBtn + ' ' + styles.apple}>
                        <FaApple className={styles.socialIcon} />
                        Continue with Apple
                    </button>
                    <button type="button" className={styles.socialBtn + ' ' + styles.facebook}>
                        <FaFacebookSquare className={styles.socialIcon} />
                        Continue with Facebook
                    </button>
                </div>

                <div className={styles.separator}><span>or</span></div>

                <form className={styles.form} onSubmit={handleSubmit} noValidate>
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
                            autoComplete="current-password"
                            value={form.password}
                            onChange={handleChange}
                        />
                        {errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
                    </label>
                    <button className={styles.button} type="submit">Sign in</button>
                </form>
                <p className={styles.text}>
                    New here?{" "}
                    <Link href="/register" className={styles.link}>Create an account</Link>
                </p>
                <p className={styles.terms}>
                    By continuing, you confirm you are 18 or over and agree to our{" "}
                    <Link href="/privacy" className={styles.termsLink}>Privacy Policy</Link> and{" "}
                    <Link href="/terms" className={styles.termsLink}>Terms of Use</Link>.
                </p>
            </section>
        </div>
    );
}
