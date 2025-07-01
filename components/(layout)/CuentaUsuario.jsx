"use client";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import styles from "./CuentaUsuario.module.css";
import {
    updateFirebaseDisplayName,
    cancelarMembresia,
    deleteUserProfile
} from "@/lib/userHelpers";
import {
    deleteCurrentAuthUser,
    logout,
    reauthenticate
} from "@/lib/authHelpers";
import ModalConfirmacion from "@/components/(modals)/ModalConfirmacion";
import ModalReautenticacion from "@/components/(modals)/ModalReautenticacion";

import { updateUserProfileInFirestore } from "@/lib/userHelpers";
import { formatoBonitoFecha } from "@/lib/dateFormat";

export default function CuentaUsuario() {
    const { user, updateProfile } = useUser();
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();

    const [form, setForm] = useState({
        email: user?.email || "",
        nombre: user?.nombre || "",
    });
    const [editando, setEditando] = useState(false);

    // Modales
    const [modalCancelarAbierto, setModalCancelarAbierto] = useState(false);
    const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
    const [showReauthModal, setShowReauthModal] = useState(false);

    // Control para repetir delete después de reauth
    const [pendingDelete, setPendingDelete] = useState(false);

    if (!user) {
        return <div className={"minimalContentView"}>Cargando datos de usuario...</div>;
    }

    // Formulario edición
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateFirebaseDisplayName(form.nombre); // Auth
            await updateUserProfileInFirestore(user.idUsuario || user.uid, { nombre: form.nombre }); // Firestore
            updateProfile({ nombre: form.nombre });
            setEditando(false);
        } catch (err) {
            alert("Error al actualizar nombre: " + err.message);
        }
    };

    // Cancelar membresía
    const handleCancelarMembresia = async () => {
        try {
            await cancelarMembresia(user.idUsuario || user.uid);
            updateProfile({ membresia: "cancelada" });
            setModalCancelarAbierto(false);
            alert("Tu membresía ha sido cancelada permanentemente.");
        } catch (err) {
            setModalCancelarAbierto(false);
            alert("Hubo un error al cancelar tu membresía: " + err.message);
        }
    };

    // Eliminar cuenta
    const handleDeleteAccount = async () => {
        setDeleting(true);
        try {
            await deleteUserProfile(user.idUsuario || user.uid);
            await deleteCurrentAuthUser();
            await logout();
            router.push("/adios");
        } catch (err) {
            if (err.code === "auth/requires-recent-login") {
                setShowReauthModal(true);
                setPendingDelete(true);
            } else {
                alert("Error al eliminar cuenta: " + err.message);
            }
        }
        setDeleting(false);
        setModalEliminarAbierto(false);
    };

    // Después de reautenticar, repite el borrado
    const handleReauth = async (password) => {
        try {
            await reauthenticate(password);
            setShowReauthModal(false);
            if (pendingDelete) {
                setPendingDelete(false);
                await handleDeleteAccount();
            }
        } catch (err) {
            alert("Error al reautenticar: " + err.message);
        }
    };

    const facturas = user.facturas || [];

    return (
        <section className={"wrapper"}>
            <h1 className={"smallerText"}>Cuenta /</h1>
            <div className={styles.cuentaUsuario}>
                {/* Info básica */}
                <div className={styles.info}>
                    <div className={styles.hidden}>
                        <b>Miembro desde:</b> {formatoBonitoFecha(user.miembroDesde || "2024-01-01")}
                    </div>
                    <div><b>Membresía:</b> {user.membresia || "Gratis"}</div>
                    <div className={styles.hidden}><b>ID: </b>{user.idUsuario || "No tengo cuenta"}</div>
                </div>

                {/* Facturas */}
                <div className={styles.facturas}>
                    <h3>Facturas</h3>
                    {facturas.length === 0 ? (
                        <p>No hay facturas disponibles.</p>
                    ) : (
                        <ul>
                            {facturas.map(f => (
                                <li key={f.id}>
                                    {f.fecha} – {f.monto || f.total || f.amount || f.precio || "Sin monto"}
                                    <button
                                        onClick={() => window.open(f.url, "_blank")}
                                        className={styles.buttonFactura}
                                    >
                                        PDF
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Edición de perfil */}
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

                <br />

                {/* Cancelar membresía */}
                {user.membresia === "premium" && (
                    <div className={styles.cancelar}>
                        <a
                            href="#"
                            onClick={e => {
                                e.preventDefault();
                                setModalCancelarAbierto(true);
                            }}
                        >
                            Cancelar membresía
                        </a>
                    </div>
                )}
                {/* Eliminar cuenta */}
                <div className={styles.eliminar}>
                    <button
                        type="button"
                        className={styles.botonEliminar}
                        onClick={() => setModalEliminarAbierto(true)}
                        disabled={deleting}
                    >
                        {deleting ? "Eliminando..." : "Eliminar cuenta"}
                    </button>
                </div>
            </div>

            {/* Modal de confirmación cancelar membresía */}
            <ModalConfirmacion
                abierto={modalCancelarAbierto}
                onClose={() => setModalCancelarAbierto(false)}
                onConfirmar={handleCancelarMembresia}
                titulo="¿Estás seguro de cancelar tu membresía?"
                mensaje="Tu cuenta premium quedará activa hasta el fin del ciclo."
            />
            {/* Modal de confirmación eliminar cuenta */}
            <ModalConfirmacion
                abierto={modalEliminarAbierto}
                onClose={() => setModalEliminarAbierto(false)}
                onConfirmar={handleDeleteAccount}
                titulo="¿Eliminar cuenta?"
                mensaje="Esta acción eliminará tu cuenta y todos tus datos permanentemente. NO es reversible. ¿Seguro que quieres continuar?"
            />
            {/* Modal de reautenticación */}
            <ModalReautenticacion
                abierto={showReauthModal}
                onClose={() => setShowReauthModal(false)}
                onReauth={handleReauth}
            />
        </section>
    );
}
