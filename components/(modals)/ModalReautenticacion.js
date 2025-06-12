import { useState } from "react";
import styles from "./ModalReautenticacion.module.css";

export default function ModalReautenticacion({ abierto, onClose, onReauth }) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReauth = async () => {
        setLoading(true);
        setError("");
        try {
            await onReauth(password);
            setPassword("");
        } catch (err) {
            setError(err.message || "Error al reautenticar.");
        }
        setLoading(false);
    };

    if (!abierto) return null;
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>Reingresa tu contraseña</h2>
                <p>Por seguridad, ingresa tu contraseña para continuar.</p>
                <input
                    className={styles.input}
                    type="password"
                    value={password}
                    placeholder="Contraseña"
                    onChange={e => setPassword(e.target.value)}
                    disabled={loading}
                />
                {error && <div className={styles.errorMsg}>{error}</div>}
                <div className={styles.actions}>
                    <button
                        className={styles.primaryBtn}
                        onClick={handleReauth}
                        disabled={loading || !password}
                    >
                        {loading ? "Verificando..." : "Confirmar"}
                    </button>
                    <button
                        className={styles.secondaryBtn}
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
