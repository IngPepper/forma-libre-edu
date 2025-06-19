// components/ModalConfirmacion.js
import styles from './ModalConfirmacion.module.css';

export default function ModalConfirmacion({
                                              abierto,
                                              onClose,
                                              onConfirmar,
                                              titulo,
                                              mensaje,
                                              accionCompletada,
                                              loading
                                          }) {
    if (!abierto) return null;
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>{titulo}</h2>
                <p>{mensaje}</p>
                <div className={styles.modalAcciones}>
                    {!accionCompletada ? (
                        <>
                            <button onClick={onConfirmar} disabled={loading} className={styles.botonConfirma}>
                                {loading ? "Eliminando..." : "Sí, cancelar"}
                            </button>
                            <button onClick={onClose} disabled={loading} className={styles.botonCancela}>
                                No, volver
                            </button>
                        </>
                    ) : (
                        <button onClick={onClose} className={styles.botonCancela}>Cerrar</button>
                    )}
                </div>
            </div>
        </div>
    );
}