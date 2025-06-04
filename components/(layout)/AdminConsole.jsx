"use client";
import { useState, useRef } from "react";
import styles from "./AdminConsole.module.css"; // Crea tus estilos modernos aquí
import { FaPlus, FaTrash, FaEdit, FaUpload } from "react-icons/fa";

// Lista de correos administradores
const adminEmails = ["admin@formalibre.com", "cesar@formalibre.com"];

export default function AdminConsole({ user, planos, setPlanos }) {
    // Simulación: debe llegar el usuario autenticado y la lista de planos
    // Ejemplo de user: { email: "admin@formalibre.com" }

    const [editing, setEditing] = useState(null); // id o null
    const [form, setForm] = useState(blankPlano());
    const [importError, setImportError] = useState("");
    const fileInputRef = useRef();

    if (!user || !adminEmails.includes(user.email)) {
        return null; // No mostrar nada si no es admin
    }

    // Handlers CRUD
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    function blankPlano() {
        return {
            id: "",
            imagen: "",
            titulo: "",
            descripcion: "",
            categoria: "",
            tamanoArchivo: "",
            tipoArchivo: "",
            precio: "",
            infoExtra: "",
            enlaces: [],
        };
    }

    // Crea o edita
    const handleSubmit = (e) => {
        e.preventDefault();
        let newPlanos;
        if (editing) {
            // Editar existente
            newPlanos = planos.map((p) => (p.id === editing ? { ...form, id: editing } : p));
        } else {
            // Nuevo
            newPlanos = [...planos, { ...form, id: Date.now() }];
        }
        setPlanos(newPlanos);
        setForm(blankPlano());
        setEditing(null);
        // TODO: Actualiza en base de datos aquí
        // await api.updatePlanos(newPlanos)
    };

    // Borrar
    const handleDelete = (id) => {
        if (!window.confirm("¿Seguro que deseas borrar este plano?")) return;
        const newPlanos = planos.filter((p) => p.id !== id);
        setPlanos(newPlanos);
        // TODO: Actualiza en base de datos aquí
        // await api.updatePlanos(newPlanos)
    };

    // Editar
    const handleEdit = (plano) => {
        setForm({ ...plano });
        setEditing(plano.id);
    };

    // Manejo de enlaces (array)
    const handleEnlaceChange = (idx, key, value) => {
        const newEnlaces = [...form.enlaces];
        newEnlaces[idx][key] = value;
        setForm({ ...form, enlaces: newEnlaces });
    };
    const handleAddEnlace = () => {
        setForm({ ...form, enlaces: [...form.enlaces, { label: "", url: "" }] });
    };
    const handleRemoveEnlace = (idx) => {
        const newEnlaces = [...form.enlaces];
        newEnlaces.splice(idx, 1);
        setForm({ ...form, enlaces: newEnlaces });
    };

    // Importar JSON
    const handleImportJSON = (e) => {
        setImportError("");
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const data = JSON.parse(evt.target.result);
                if (Array.isArray(data)) {
                    // TODO: Validar campos mínimos
                    setPlanos([...planos, ...data.map((d) => ({ ...d, id: d.id || Date.now() + Math.random() }))]);
                    // await api.updatePlanos([...planos, ...data])
                } else {
                    setImportError("El archivo debe contener un array de planos.");
                }
            } catch (err) {
                setImportError("El archivo no es un JSON válido.");
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className={styles.adminConsole}>
            <div className={styles.section}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h3>{editing ? "Editar Plano" : "Agregar Nuevo Plano"}</h3>
                    <input name="titulo" placeholder="Título" value={form.titulo} onChange={handleChange} required />
                    <input name="imagen" placeholder="URL Imagen" value={form.imagen} onChange={handleChange} required />
                    <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} />
                    <input name="categoria" placeholder="Categoría" value={form.categoria} onChange={handleChange} />
                    <input name="tamanoArchivo" placeholder="Tamaño archivo" value={form.tamanoArchivo} onChange={handleChange} />
                    <input name="tipoArchivo" placeholder="Tipo archivo" value={form.tipoArchivo} onChange={handleChange} />
                    <input name="precio" placeholder="Precio" value={form.precio} onChange={handleChange} />
                    <input name="infoExtra" placeholder="Info extra" value={form.infoExtra} onChange={handleChange} />
                    {/* Enlaces */}
                    <div>
                        <label>Enlaces:</label>
                        {form.enlaces.map((enl, idx) => (
                            <div key={idx} className={styles.enlaceRow}>
                                <input
                                    placeholder="Label"
                                    value={enl.label}
                                    onChange={(e) => handleEnlaceChange(idx, "label", e.target.value)}
                                />
                                <input
                                    placeholder="URL"
                                    value={enl.url}
                                    onChange={(e) => handleEnlaceChange(idx, "url", e.target.value)}
                                />
                                <button type="button" onClick={() => handleRemoveEnlace(idx)} className={styles.iconBtn}><FaTrash /></button>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddEnlace} className={styles.iconBtn}><FaPlus /> Enlace</button>
                    </div>
                    <button type="submit" className={styles.primaryBtn}>{editing ? "Guardar cambios" : "Agregar"}</button>
                    {editing && (
                        <button type="button" className={styles.secondaryBtn} onClick={() => { setForm(blankPlano()); setEditing(null); }}>Cancelar</button>
                    )}
                </form>
            </div>

            <div className={styles.section}>
                <input
                    type="file"
                    accept="application/json"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleImportJSON}
                />
                <button onClick={() => fileInputRef.current.click()} className={styles.primaryBtn}>
                    <FaUpload /> Importar JSON
                </button>
                {importError && <div className={styles.error}>{importError}</div>}
            </div>

            <div className={styles.section}>
                <h3>Lista de Planos ({planos.length})</h3>
                <div className={styles.planoList}>
                    {planos.map((plano) => (
                        <div key={plano.id} className={styles.planoItem}>
                            <img src={plano.imagen} alt={plano.titulo} className={styles.img} />
                            <div className={styles.info}>
                                <b>{plano.titulo}</b> <span className={styles.categoria}>{plano.categoria}</span>
                                <div className={styles.actions}>
                                    <button onClick={() => handleEdit(plano)} className={styles.iconBtn}><FaEdit /></button>
                                    <button onClick={() => handleDelete(plano.id)} className={styles.iconBtn}><FaTrash /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Aquí conectarías con tu backend, por ejemplo:
          // Firestore:
          // import { addDoc, updateDoc, deleteDoc, collection } from "firebase/firestore"
          // Supabase: await supabase.from("planos").upsert([...])
          // REST API: fetch("/api/planos", {method: "POST", body: ...})
       */}
        </div>
    );
}
