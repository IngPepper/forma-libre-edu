"use client";
import { useState } from "react";
import styles from "./EnviarPlanoForm.module.css";
import Link from "next/link";
import CollapsibleSection from "@/components/(utilities)/CollapsibleSection";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xanjnjao";

export default function EnviarPlanoForm() {
    const [form, setForm] = useState({
        nombre: "",
        email: "",
        idUsuario: "",
        linkArchivo: "",
    });
    const [enviado, setEnviado] = useState(false);
    const [error, setError] = useState("");

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const data = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                data.append(key, value);
            });
            // ¡No agregues el captcha aquí!
            // data.append("_captcha", "false");  <-- ELIMINA ESTA LÍNEA

            const res = await fetch(FORMSPREE_ENDPOINT, {
                method: "POST",
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (res.ok) {
                setEnviado(true);
                setForm({
                    nombre: "",
                    email: "",
                    idUsuario: "",
                    linkArchivo: "",
                });
            } else {
                setError("No se pudo enviar. Intenta de nuevo o escribe a contacto@formalibre.com");
            }
        } catch (err) {
            setError("Ocurrió un error inesperado.");
        }
    };

    return (
        <div className={styles.modalWrapper}>
            <div className={styles.modal}>
                {enviado ? (
                        <div>
                            <p className={styles.biggerText}>
                                ¡Gracias! Tu envío fue recibido, revisaremos tu información y te avisaremos por correo.
                            </p>
                            <Link href={'/'} className={styles.exito}>
                                <button className={styles.button}>Vuelve al inicio</button>
                            </Link>
                        </div>

                ) : (
                    <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
                        <h2 className={styles.title}>Envíanos tu plano</h2>
                            <p className={styles.text}>
                                Una vez recibido tu material, se llevará a cabo una inspección del archivo en cuestión, una vez finalizado <strong>nos pondremos en contacto con más detalles por correo.</strong>
                            </p>

                        <label className={styles.label}>
                            Tu Nombre:
                            <input
                                name="nombre"
                                className={styles.input}
                                required
                                value={form.nombre}
                                onChange={handleChange}
                            />
                        </label>
                        <label className={styles.label}>
                            Email de contacto:
                            <input
                                name="email"
                                type="email"
                                className={styles.input}
                                required
                                value={form.email}
                                onChange={handleChange}
                            />
                        </label>
                        <label className={styles.label}>
                            ID de usuario:
                            <input
                                name="idUsuario"
                                className={styles.input}
                                required
                                value={form.idUsuario}
                                onChange={handleChange}
                                placeholder="Ejemplo: U-123456"
                            />
                        </label>
                        <label className={styles.label}>
                            Link al archivo (.dwg, .dxf, .cad, etc):
                            <input
                                name="linkArchivo"
                                className={styles.input}
                                required
                                value={form.linkArchivo}
                                onChange={handleChange}
                                placeholder="Pega aquí tu link de Drive, Dropbox, WeTransfer..."
                                type="url"
                                pattern="https?://.+"
                            />
                        </label>
                        <p className={styles.text}>
                            ⚠️ <b>No subas archivos directamente.</b> Sube tu archivo a Google Drive, Dropbox, WeTransfer, etc. y pega aquí el enlace público.
                        </p>

                        {error && <div className={styles.errorMsg}>{error}</div>}

                        <button type="submit" className={styles.button}>Enviar</button>
                        <Link href={'/'} className={"link"}>
                            Vuelve al inicio
                        </Link>
                    </form>
                )}
            </div>
        </div>
    );
}
