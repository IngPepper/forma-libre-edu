// components/ModalConfirmacion.js
import styles from './ModalConfirmacion.module.css';

export default function ModalConfirmacion({ abierto, onClose, onConfirmar, titulo, mensaje }) {
    if (!abierto) return null;
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>{titulo}</h2>
                <p>{mensaje}</p>
                <div className={styles.modalAcciones}>
                    <button onClick={onConfirmar} className={styles.botonConfirma}>Sí, cancelar</button>
                    <button onClick={onClose} className={styles.botonCancela}>No, volver</button>
                </div>
            </div>
        </div>
    );
}