"use client";
import { useState, useRef, useEffect } from "react";

import { FaPlus, FaTrash, FaEdit, FaUpload } from "react-icons/fa";
import { useUser } from "@/context/UserContext";
import {
    borrarCarritosVacios,
    obtenerOrdenesPendientesOFallidas,
    eliminarOrden,
    eliminarTodasOrdenesPendientesOFallidas
} from "@/lib/firebaseHelpers";
import { usePlano } from "@/context/PlanoContext";

import styles from "./AdminConsole.module.css";
import ModalConfirmacion from "@/components/(modals)/ModalConfirmacion";
import AppLoader from "@/components/(utilities)/AppLoader";


// Factories
function blankPlano() {
    return {
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

export default function AdminConsole({ }) {

    // ---- usePlano
    const { planos, loading, agregarPlano, editarPlano, eliminarPlano, importarPlanos } = usePlano();

    // ---- Hooks normales
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(blankPlano());
    const [importError, setImportError] = useState("");
    const [message, setMessage] = useState("");
    const fileInputRef = useRef();

    // Modal y loaders locales para órdenes
    const [modalAbierto, setModalAbierto] = useState(false);
    const [accionPendiente, setAccionPendiente] = useState(() => () => {});
    const [modalMensaje, setModalMensaje] = useState("");
    const [modalTitulo, setModalTitulo] = useState("");
    const [ordenesPendientes, setOrdenesPendientes] = useState([]);
    const [loadingOrdenes, setLoadingOrdenes] = useState(false);
    const [accionCompletada, setAccionCompletada] = useState(false);

    // ---- useUser
    const { user, firebaseUser } = useUser();
    const [esAdmin, setEsAdmin] = useState(false);
    const [checkedAdmin, setCheckedAdmin] = useState(false);

    // ---- Efectos
    useEffect(() => {
        if (!firebaseUser) {
            setEsAdmin(false);
            setCheckedAdmin(true);
            return;
        }
        let cancelado = false;
        firebaseUser.getIdTokenResult().then((idTokenResult) => {
            if (!cancelado) {
                setEsAdmin(!!idTokenResult.claims.admin);
                setCheckedAdmin(true);
            }
        });
        return () => { cancelado = true; };
    }, [firebaseUser]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(""), 4000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    // Órdenes
    useEffect(() => {
        async function fetchOrdenes() {
            await cargarOrdenesPendientes();
        }
        fetchOrdenes();
    }, []);

    // Filtros
    const [filtroTitulo, setFiltroTitulo] = useState("");
    const [filtroPrecioMin, setFiltroPrecioMin] = useState("");
    const [filtroPrecioMax, setFiltroPrecioMax] = useState("");
    const [filtroNivelesMin, setFiltroNivelesMin] = useState("");
    const [filtroNivelesMax, setFiltroNivelesMax] = useState("");

    const [idEliminar, setIdEliminar] = useState("");


    // ---- Admin protection (fuera de hooks)
    if (!checkedAdmin) {
        return <AppLoader />;
    }
    if (!user || !esAdmin) {
        return (
            <div className={"min"}>No tienes permisos para ver esta sección 😘</div>
        )
    }

    // ---- handlers de formulario y niveles (igual)
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleAddNivel = () => setForm({ ...form, niveles: [...(form.niveles || []), blankNivel()] });
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

    // Enlaces de nivel
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

    // Submit: agrega o edita
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await editarPlano(editing, form);
                setMessage("Plano editado correctamente.");
            } else {
                await agregarPlano(form);
                setMessage("Plano agregado correctamente.");
            }
            setForm(blankPlano());
            setEditing(null);
        } catch (err) {
            setMessage("Hubo un error al guardar el plano.");
        }
    };

    // Editar: carga datos en formulario
    const handleEdit = (plano) => {
        setForm({
            ...blankPlano(),
            ...plano,
            niveles: plano.niveles ? plano.niveles.map((n) => ({ ...blankNivel(), ...n })) : []
        });
        setEditing(plano.id);
        setMessage("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Borrar plano con modal de confirmación
    const handleDelete = async (id) => {
        setModalTitulo("Eliminar plano");
        setModalMensaje("¿Seguro que deseas eliminar este plano?");
        setAccionPendiente(() => async () => {
            try {
                await eliminarPlano(id);
                setMessage("Plano eliminado.");
            } catch (err) {
                setMessage("Error al eliminar.");
                console.error(err);
            } finally {
                setModalAbierto(false);
            }
        });
        setModalAbierto(true);
    };

    // Importar JSON de planos usando el handler del contexto
    const handleImportJSON = (e) => {
        setImportError("");
        setMessage("");
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const result = evt.target.result;
                const jsonStr = typeof result === "string" ? result : new TextDecoder().decode(result);
                const data = JSON.parse(jsonStr);
                if (Array.isArray(data)) {
                    await importarPlanos(data); // Handler del contexto
                    setImportError("");
                    setMessage(`Planos importados correctamente (${data.length}).`);
                } else {
                    setImportError("El archivo debe contener un array de planos.");
                }
            } catch (err) {
                setImportError("El archivo no es un JSON válido o contiene datos inválidos.");
            }
        };
        reader.readAsText(file);
    };

    // --- Acciones de carritos y órdenes (mantén loading local para estos) ---
    const handleBorrarCarritosVacios = () => {
        setModalMensaje("¿Estás seguro de borrar los carritos vacíos?");
        setModalAbierto(true);
        setAccionCompletada(false);
        setAccionPendiente(() => async () => {
            try {
                await borrarCarritosVacios();
                setModalMensaje("Carritos vacíos eliminados correctamente.");
                setAccionCompletada(true);
            } catch (err) {
                setModalMensaje("Error al borrar carritos vacíos.");
                setAccionCompletada(true);
                console.error(err);
            }
        });
    };

    async function cargarOrdenesPendientes() {
        setLoadingOrdenes(true);
        try {
            const lista = await obtenerOrdenesPendientesOFallidas();
            setOrdenesPendientes(lista);
        } finally {
            setLoadingOrdenes(false);
        }
    }

    const handleEliminarOrden = (id) => {
        setModalTitulo("Eliminar orden");
        setModalMensaje("¿Estás seguro de eliminar esta orden pendiente o fallida?");
        setAccionPendiente(() => async () => {
            setModalAbierto(false);
            setLoadingOrdenes(true);
            try {
                await eliminarOrden(id);
                await cargarOrdenesPendientes();
                setMessage("Orden eliminada.");
            } catch (e) {
                setMessage("Error al eliminar la orden.");
                console.error(e);
            } finally {
                setLoadingOrdenes(false);
            }
        });
        setModalAbierto(true);
    };

    const handleEliminarTodasOrdenes = () => {
        setModalTitulo("Eliminar TODAS las órdenes");
        setModalMensaje("¿Estás seguro de eliminar TODAS las órdenes pendientes y fallidas?");
        setAccionPendiente(() => async () => {
            setModalAbierto(false);
            setLoadingOrdenes(true);
            try {
                await eliminarTodasOrdenesPendientesOFallidas();
                await cargarOrdenesPendientes();
                setMessage("Órdenes eliminadas.");
            } catch (e) {
                setMessage("Error al eliminar las órdenes.");
                console.error(e);
            } finally {
                setLoadingOrdenes(false);
            }
        });
        setModalAbierto(true);
    };

    const planosFiltrados = planos.filter(plano => {
        const matchTitulo = filtroTitulo.trim() === "" ||
            plano.titulo.toLowerCase().includes(filtroTitulo.trim().toLowerCase());
        let precio = 0;
        if (plano.niveles && plano.niveles.length > 0) {
            const precioNivel = plano.niveles[0].precio;
            precio = Number(precioNivel) || 0;
        }
        const matchPrecioMin = filtroPrecioMin === "" || precio >= Number(filtroPrecioMin);
        const matchPrecioMax = filtroPrecioMax === "" || precio <= Number(filtroPrecioMax);
        const numNiveles = plano.niveles ? plano.niveles.length : 0;
        const matchNivelesMin = filtroNivelesMin === "" || numNiveles >= Number(filtroNivelesMin);
        const matchNivelesMax = filtroNivelesMax === "" || numNiveles <= Number(filtroNivelesMax);

        return (
            matchTitulo &&
            matchPrecioMin &&
            matchPrecioMax &&
            matchNivelesMin &&
            matchNivelesMax
        );
    });

    // --- Render igual ---
    return (
        <div className={styles.adminConsole}>
            <div className={styles.section}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h3>{editing ? "Editar Plano" : "Agregar Nuevo Plano"}</h3>
                    <input name="titulo" placeholder="Título" value={form.titulo || ""} onChange={handleChange} required />
                    <input name="imagen" placeholder="URL Imagen" value={form.imagen || ""} onChange={handleChange} required />
                    <input name="descripcion" placeholder="Descripción" value={form.descripcion || ""} onChange={handleChange} />
                    <input name="categoria" placeholder="Categoría" value={form.categoria || ""} onChange={handleChange} />
                    <input name="isDonated" placeholder="¿Donado? (vacío o donated)" value={form.isDonated || ""} onChange={handleChange} />
                    <input name="imagenGeneral" placeholder="Imagen General (opcional)" value={form.imagenGeneral || ""} onChange={handleChange} />
                    {/* NIVELES */}
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
                                    value={nivel.nombre || ""}
                                    onChange={e => handleNivelChange(idx, "nombre", e.target.value)}
                                    required={idx === 0}
                                />
                                <input
                                    placeholder="Descripción"
                                    value={nivel.descripcion || ""}
                                    onChange={e => handleNivelChange(idx, "descripcion", e.target.value)}
                                />
                                <input
                                    placeholder="URL de la foto del nivel"
                                    value={nivel.foto || ""}
                                    onChange={e => handleNivelChange(idx, "foto", e.target.value)}
                                />
                                <input
                                    placeholder="Tamaño archivo"
                                    value={nivel.tamanoArchivo || ""}
                                    onChange={e => handleNivelChange(idx, "tamanoArchivo", e.target.value)}
                                />
                                <input
                                    placeholder="Tipo archivo"
                                    value={nivel.tipoArchivo || ""}
                                    onChange={e => handleNivelChange(idx, "tipoArchivo", e.target.value)}
                                />
                                <input
                                    placeholder={idx === 0 ? "Precio Bundle" : "Precio"}
                                    value={nivel.precio || ""}
                                    onChange={e => handleNivelChange(idx, "precio", e.target.value)}
                                />
                                <input
                                    placeholder="Info extra"
                                    value={nivel.infoExtra || ""}
                                    onChange={e => handleNivelChange(idx, "infoExtra", e.target.value)}
                                />
                                {/* Enlaces por nivel */}
                                <div>
                                    <label>Enlaces:</label>
                                    {(nivel.enlaces || []).map((enl, eidx) => (
                                        <div key={eidx} className={styles.enlaceRow}>
                                            <input
                                                placeholder="Label"
                                                value={enl.label || ""}
                                                onChange={ev => handleNivelEnlaceChange(idx, eidx, "label", ev.target.value)}
                                            />
                                            <input
                                                placeholder="URL"
                                                value={enl.url || ""}
                                                onChange={ev => handleNivelEnlaceChange(idx, eidx, "url", ev.target.value)}
                                            />
                                            <button type="button" onClick={() => handleRemoveNivelEnlace(idx, eidx)} className={`${styles.iconBtn} ${styles.iconBtnDel}`}><FaTrash /></button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => handleAddNivelEnlace(idx)} className={styles.iconBtn}><FaPlus /> Enlace</button>
                                </div>
                                <button type="button" onClick={() => handleRemoveNivel(idx)} className={`${styles.iconBtn} ${styles.iconBtnDel}`}><FaTrash /> Eliminar nivel</button>
                                <hr />
                            </div>
                        ))}
                        <button type="button" onClick={handleAddNivel} className={styles.iconBtn}><FaPlus /> Agregar Nivel</button>
                    </div>
                    {/* ---- Fin NIVELES ---- */}

                    <button type="submit" className={styles.primaryBtn} disabled={loading}>
                        {editing ? "Guardar cambios" : "Agregar"}
                    </button>
                    {editing && (
                        <button type="button" className={styles.secondaryBtn} onClick={() => { setForm(blankPlano()); setEditing(null); setMessage(""); }}>
                            Cancelar
                        </button>
                    )}
                    {message && <div className={styles.success}>{message}</div>}
                    {loading && <div className={styles.loading}>Cargando...</div>}
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
                <button
                    onClick={() => fileInputRef.current.click()}
                    className={styles.primaryBtn}
                    disabled={loading}
                >
                    <FaUpload /> Importar JSON
                </button>
                {importError && <div className={styles.error}>{importError}</div>}
                {message && <div className={styles.success}>{message}</div>}
                <button onClick={handleBorrarCarritosVacios} className={`${styles.primaryBtnDel}`} disabled={loading}>
                    <FaTrash /> Borrar carritos vacíos
                </button>
            </div>

            <div className={styles.section}>
                <h3>Órdenes pendientes/fallidas</h3>
                <div>
                    <button
                        className={styles.primaryBtnDel}
                        onClick={handleEliminarTodasOrdenes}
                        disabled={loadingOrdenes}
                    >
                        <FaTrash /> Eliminar TODAS las pendientes/fallidas
                    </button>

                    <div className={styles.orderID}>
                        <input
                            type="text"
                            placeholder="ID de la orden"
                            value={idEliminar}
                            onChange={e => setIdEliminar(e.target.value)}
                            className={styles.input}
                        />
                        <button
                            className={styles.secondaryBtn}
                            onClick={() => idEliminar && handleEliminarOrden(idEliminar)}
                            disabled={loadingOrdenes || !idEliminar}
                        >
                            <FaTrash /> Eliminar por ID
                        </button>
                    </div>
                </div>
                {loadingOrdenes && <div className={styles.loading}>Cargando órdenes...</div>}
                <div className={styles.ordenesList}>
                    {ordenesPendientes.length === 0 && <div>No hay órdenes pendientes ni fallidas.</div>}
                    {ordenesPendientes.map(ord => (
                        <div key={ord.id} className={styles.ordenItem}>
                            <b>{ord.nombre || ord.email}</b>
                            <span> — {ord.status}</span>
                            <span> — {new Date(ord.fecha.seconds * 1000).toLocaleString()}</span>
                            <button
                                className={styles.iconBtn}
                                onClick={() => handleEliminarOrden(ord.id)}
                                disabled={loadingOrdenes}
                                title="Eliminar orden"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <h3>Lista de Planos ({planos.length})</h3>
                <div className={styles.filtrosPlanos}>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="Buscar por título"
                        value={filtroTitulo}
                        onChange={e => setFiltroTitulo(e.target.value)}
                    />
                    <input
                        type="number"
                        className={styles.input}
                        placeholder="Precio mínimo"
                        value={filtroPrecioMin}
                        onChange={e => setFiltroPrecioMin(e.target.value)}
                        min="0"
                    />
                    <input
                        type="number"
                        className={styles.input}
                        placeholder="Precio máximo"
                        value={filtroPrecioMax}
                        onChange={e => setFiltroPrecioMax(e.target.value)}
                        min="0"
                    />
                    <input
                        type="number"
                        className={styles.input}
                        placeholder="# Niveles mínimo"
                        value={filtroNivelesMin}
                        onChange={e => setFiltroNivelesMin(e.target.value)}
                        min="0"
                    />
                    <input
                        type="number"
                        className={styles.input}
                        placeholder="# Niveles máximo"
                        value={filtroNivelesMax}
                        onChange={e => setFiltroNivelesMax(e.target.value)}
                        min="0"
                    />
                </div>
                <div className={styles.planoList}>
                    {planosFiltrados.length === 0 && (
                        <div className={styles.error}>No se encontraron planos con los filtros actuales.</div>
                    )}
                    {planosFiltrados.map((plano) => (
                        <div key={plano.id} className={styles.planoItem}>
                            <img src={plano.imagen} alt={plano.titulo} className={styles.img} />
                            <div className={styles.info}>
                                <b>{plano.titulo}</b>
                                <span className={styles.categoria}>{plano.categoria}</span>
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
                                    <button
                                        onClick={() => handleDelete(plano.id)}
                                        className={`${styles.iconBtn} ${styles.iconBtnDel}`}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <ModalConfirmacion
                abierto={modalAbierto}
                titulo={modalTitulo}
                mensaje={modalMensaje}
                onClose={() => setModalAbierto(false)}
                onConfirmar={accionPendiente}
                accionCompletada={accionCompletada}
                loading={loading}
            />
        </div>
    );
}
