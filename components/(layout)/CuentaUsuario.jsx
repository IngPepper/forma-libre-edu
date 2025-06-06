"use client";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import styles from "./CuentaUsuario.module.css";
import { updateUserProfileInFirestore, updateFirebaseDisplayName  } from "@/lib/userHelpers";

export default function CuentaUsuario() {
    const { user, updateProfile } = useUser(); // ← saca del contexto global
    const [form, setForm] = useState({
        email: user?.email || "",
        nombre: user?.nombre || "",
    });
    const [editando, setEditando] = useState(false);

    // Si aún no cargó el usuario, puedes poner un loading
    if (!user) return <div className={"minimalContentView"}>Cargando datos de usuario...</div>;

    // Manejadores de evento
    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateFirebaseDisplayName(form.nombre);
            updateProfile({ displayName: form.nombre }); // Solo para reflejar en la UI
            setEditando(false);
        } catch (err) {
            alert("Error al actualizar nombre: " + err.message);
        }
    };

    // Si tienes facturas en user
    const facturas = user.facturas || [];

    return (
        <section className={"wrapper"}>
            <h1 className={"smallerText"}>Cuenta /</h1>
            <div className={styles.cuentaUsuario}>

                <div className={styles.info}>
                    <div className={styles.hidden}><b>Miembro desde:</b> {user.miembroDesde || "2024-01-01"}</div>
                    <div><b>Membresía:</b> {user.membresia || "Gratis"}</div>
                    <div className={styles.hidden}><b>ID: </b>{user.idUsuario || "No tengo cuenta"}</div>
                </div>

                <div className={styles.facturas}>
                    <h3>Facturas</h3>
                    {facturas.length === 0 ? (
                        <p>No hay facturas disponibles.</p>
                    ) : (
                        <ul>
                            {facturas.map(f => (
                                <li key={f.id}>
                                    {f.fecha} – {f.monto}
                                    <button onClick={() => window.open(f.url, "_blank")} className={styles.buttonFactura}>PDF</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className={styles.perfilForm}>
                    <h3>Actualizar información</h3>
                    {editando ? (
                        <form onSubmit={handleSubmit}>
                            <label>
                                Email:
                                <input
                                    type="email"
                                    name="email"
                                    value={user.email}
                                    readOnly
                                    disabled
                                />
                            </label>
                            <label>
                                Nuevo nombre de usuario:
                                <input
                                    type="text"
                                    name="nombre"
                                    value={form.nombre}
                                    onChange={handleChange}
                                />
                            </label>
                            <button type="submit">Guardar cambios</button>
                            <button type="button" onClick={() => setEditando(false)}>Cancelar</button>
                        </form>
                    ) : (
                        <div>
                            <div><b>Email:</b> {user.email}</div>
                            <div><b>Usuario:</b> {user.nombre}</div>
                            <button onClick={() => setEditando(true)}>Editar</button>
                        </div>
                    )}
                </div>
                <br/>
                <div className={styles.cancelar}>
                    <a href="#" onClick={e => {
                        e.preventDefault();
                        // Aquí pondrías la lógica para cancelar membresía
                        alert("Funcionalidad de cancelar membresía aún no implementada.");
                    }}>
                        Cancelar membresía
                    </a>
                </div>
            </div>
        </section>
    );
}
