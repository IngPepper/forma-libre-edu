"use client";
import { useState, useRef } from "react";
import styles from "./AdminConsole.module.css";
import { FaPlus, FaTrash, FaEdit, FaUpload } from "react-icons/fa";
import { useUser } from "@/context/UserContext";

// Plano y nivel vacíos
function blankPlano() {
    return {
        id: "",
        imagen: "",
        titulo: "",
        descripcion: "",
        categoria: "",
        isDonated: "",
        imagenGeneral: "",
        niveles: [],
    };
}
function blankNivel() {
    return {
        nombre: "",
        descripcion: "",
        tamanoArchivo: "",
        tipoArchivo: "",
        precio: "",
        infoExtra: "",
        enlaces: [],
    };
}

export default function AdminConsole({ planos, setPlanos }) {
    const { user } = useUser();
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(blankPlano());
    const [importError, setImportError] = useState("");
    const fileInputRef = useRef();

    if (!user || (user.rol !== "admin" && !user.isAdmin)) {
        return null;
    }

    // CRUD Handlers
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Niveles handlers
    const handleAddNivel = () => {
        setForm({ ...form, niveles: [...(form.niveles || []), blankNivel()] });
    };
    const handleRemoveNivel = (idx) => {
        const newNiveles = [...form.niveles];
        newNiveles.splice(idx, 1);
        setForm({ ...form, niveles: newNiveles });
    };
    const handleNivelChange = (idx, key, value) => {
        const newNiveles = [...form.niveles];
        newNiveles[idx][key] = value;
        setForm({ ...form, niveles: newNiveles });
    };

    // Enlaces por nivel
    const handleAddNivelEnlace = (nivelIdx) => {
        const newNiveles = [...form.niveles];
        if (!newNiveles[nivelIdx].enlaces) newNiveles[nivelIdx].enlaces = [];
        newNiveles[nivelIdx].enlaces.push({ label: "", url: "" });
        setForm({ ...form, niveles: newNiveles });
    };
    const handleRemoveNivelEnlace = (nivelIdx, enlaceIdx) => {
        const newNiveles = [...form.niveles];
        newNiveles[nivelIdx].enlaces.splice(enlaceIdx, 1);
        setForm({ ...form, niveles: newNiveles });
    };
    const handleNivelEnlaceChange = (nivelIdx, enlaceIdx, key, value) => {
        const newNiveles = [...form.niveles];
        newNiveles[nivelIdx].enlaces[enlaceIdx][key] = value;
        setForm({ ...form, niveles: newNiveles });
    };

    // Crear o editar plano
    const handleSubmit = (e) => {
        e.preventDefault();
        let newPlanos;
        if (editing) {
            newPlanos = planos.map((p) => (p.id === editing ? { ...form, id: editing } : p));
        } else {
            newPlanos = [...planos, { ...form, id: Date.now() }];
        }
        setPlanos(newPlanos);
        setForm(blankPlano());
        setEditing(null);
    };

    // Borrar plano
    const handleDelete = (id) => {
        if (!window.confirm("¿Seguro que deseas borrar este plano?")) return;
        const newPlanos = planos.filter((p) => p.id !== id);
        setPlanos(newPlanos);
    };

    // Editar plano
    const handleEdit = (plano) => {
        setForm({ ...plano, niveles: plano.niveles || [] });
        setEditing(plano.id);
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
                    setPlanos([
                        ...planos,
                        ...data.map((d) => ({
                            ...d,
                            id: d.id || Date.now() + Math.random(),
                        })),
                    ]);
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
                    <input name="isDonated" placeholder="¿Donado? (vacío o donated)" value={form.isDonated} onChange={handleChange} />
                    <input name="imagenGeneral" placeholder="Imagen General (opcional)" value={form.imagenGeneral || ""} onChange={handleChange} />

                    {/* ---- NIVELES ---- */}
                    <div>
                        <label>
                            Niveles:{" "}
                            <small>
                                (El <b>precio del bundle</b> debe ir en el <b>primer nivel</b>)
                            </small>
                        </label>
                        {form.niveles.map((nivel, idx) => (
                            <div key={idx} className={styles.nivelBox}>
                                <b>{idx === 0 ? "Bundle / Primer nivel" : `Nivel ${idx + 1}`}</b>
                                <input
                                    placeholder="Nombre"
                                    value={nivel.nombre}
                                    onChange={e => handleNivelChange(idx, "nombre", e.target.value)}
                                    required={idx === 0} // bundle siempre debe tener nombre
                                />
                                <input
                                    placeholder="Descripción"
                                    value={nivel.descripcion}
                                    onChange={e => handleNivelChange(idx, "descripcion", e.target.value)}
                                />
                                <input
                                    placeholder="Tamaño archivo"
                                    value={nivel.tamanoArchivo}
                                    onChange={e => handleNivelChange(idx, "tamanoArchivo", e.target.value)}
                                />
                                <input
                                    placeholder="Tipo archivo"
                                    value={nivel.tipoArchivo}
                                    onChange={e => handleNivelChange(idx, "tipoArchivo", e.target.value)}
                                />
                                <input
                                    placeholder={idx === 0 ? "Precio Bundle" : "Precio"}
                                    value={nivel.precio}
                                    onChange={e => handleNivelChange(idx, "precio", e.target.value)}
                                />
                                <input
                                    placeholder="Info extra"
                                    value={nivel.infoExtra}
                                    onChange={e => handleNivelChange(idx, "infoExtra", e.target.value)}
                                />
                                {/* Enlaces por nivel */}
                                <div>
                                    <label>Enlaces:</label>
                                    {(nivel.enlaces || []).map((enl, eidx) => (
                                        <div key={eidx} className={styles.enlaceRow}>
                                            <input
                                                placeholder="Label"
                                                value={enl.label}
                                                onChange={ev => handleNivelEnlaceChange(idx, eidx, "label", ev.target.value)}
                                            />
                                            <input
                                                placeholder="URL"
                                                value={enl.url}
                                                onChange={ev => handleNivelEnlaceChange(idx, eidx, "url", ev.target.value)}
                                            />
                                            <button type="button" onClick={() => handleRemoveNivelEnlace(idx, eidx)} className={styles.iconBtn}><FaTrash /></button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => handleAddNivelEnlace(idx)} className={styles.iconBtn}><FaPlus /> Enlace</button>
                                </div>
                                <button type="button" onClick={() => handleRemoveNivel(idx)} className={styles.iconBtn}><FaTrash /> Eliminar nivel</button>
                                <hr />
                            </div>
                        ))}
                        <button type="button" onClick={handleAddNivel} className={styles.iconBtn}><FaPlus /> Agregar Nivel</button>
                    </div>
                    {/* ---- Fin NIVELES ---- */}

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
                                {plano.niveles && plano.niveles.length > 0 && (
                                    <div>
                                        <small>
                                            {plano.niveles.map((n, i) =>
                                                <span key={i} className={styles.nivelTag}>
                                                    {n.nombre}
                                                    {i === 0 && n.precio ? ` ($${n.precio})` : ""}
                                                    {i < plano.niveles.length - 1 ? ', ' : ''}
                                                </span>
                                            )}
                                        </small>
                                    </div>
                                )}
                                <div className={styles.actions}>
                                    <button onClick={() => handleEdit(plano)} className={styles.iconBtn}><FaEdit /></button>
                                    <button onClick={() => handleDelete(plano.id)} className={styles.iconBtn}><FaTrash /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
