"use client";
import { useState, useRef, useEffect } from "react";
import styles from "./AdminConsole.module.css";
import { FaPlus, FaTrash, FaEdit, FaUpload } from "react-icons/fa";
import { useUser } from "@/context/UserContext";
import {
    obtenerPlanos,
    agregarPlano,
    editarPlano,
    eliminarPlano,
    importarPlanos,
    borrarCarritosVacios,
    obtenerOrdenesPendientesOFallidas,
    eliminarOrden,
    eliminarTodasOrdenesPendientesOFallidas
} from "@/lib/firebaseHelpers";
import ModalConfirmacion from "@/components/(modals)/ModalConfirmacion";

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
    const { user } = useUser();
    const [planos, setPlanos] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(blankPlano());
    const [importError, setImportError] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const fileInputRef = useRef();


    // Protege admin
    if (!user || (user.rol !== "admin" && !user.isAdmin)) {
        return null;
    }

    // Cargar planos iniciales
    useEffect(() => {
        setLoading(true);
        obtenerPlanos().then(setPlanos).finally(() => setLoading(false));
    }, []);

    // CRUD Handlers
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Niveles
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
        setLoading(true);
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
            const nuevosPlanos = await obtenerPlanos();
            setPlanos(nuevosPlanos);
        } catch (err) {
            setMessage("Hubo un error al guardar el plano.");
            console.error("Error en handleSubmit:", err);
        } finally {
            setLoading(false);
        }
    };

    // Borrar plano
    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas borrar este plano?")) return;
        setLoading(true);
        try {
            await eliminarPlano(id); // Tu helper: await deleteDoc(doc(db, "planos", id));
            setMessage("Plano eliminado.");
            setPlanos(await obtenerPlanos());
        } catch (err) {
            setMessage("Error al eliminar.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Editar: carga datos en formulario
    const handleEdit = (plano) => {
        // Usa blankPlano como base para asegurar todos los campos
        setForm({
            ...blankPlano(),
            ...plano,
            niveles: plano.niveles ? plano.niveles.map((n) => ({ ...blankNivel(), ...n })) : []
        });
        setEditing(plano.id);
        setMessage("");

        // Scroll al inicio
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Importar JSON
    const handleImportJSON = (e) => {
        setImportError("");
        setMessage("");
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (evt) => {
            setLoading(true);
            try {
                const result = evt.target.result;
                // Si por alguna razón result no es string, lo decodificamos
                const jsonStr = typeof result === "string"
                    ? result
                    : new TextDecoder().decode(result);
                const data = JSON.parse(jsonStr);

                if (Array.isArray(data)) {
                    await importarPlanos(data); // Tu helper debe agregar cada plano a Firestore
                    setPlanos(await obtenerPlanos());
                    setImportError("");
                    setMessage(`Planos importados correctamente (${data.length}).`);
                } else {
                    setImportError("El archivo debe contener un array de planos.");
                }
            } catch (err) {
                setImportError("El archivo no es un JSON válido o contiene datos inválidos.");
            } finally {
                setLoading(false);
            }
        };
        reader.readAsText(file);
    };

    //Borrar Carritos Vacios
    const handleBorrarCarritosVacios = () => {
        setAccionPendiente(() => async () => {
            setModalAbierto(false);
            setLoading(true);
            try {
                await borrarCarritosVacios();
                setMessage("Carritos vacíos eliminados correctamente.");
            } catch (err) {
                setMessage("Error al borrar carritos vacíos.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        });
        setModalAbierto(true);
    };

    const [modalAbierto, setModalAbierto] = useState(false);
    const [accionPendiente, setAccionPendiente] = useState(() => () => {});
    const [modalMensaje, setModalMensaje] = useState("");
    const [modalTitulo, setModalTitulo] = useState("");

    const [ordenesPendientes, setOrdenesPendientes] = useState([]);
    const [loadingOrdenes, setLoadingOrdenes] = useState(false);

// Cargar órdenes pendientes/fallidas al cargar admin
    useEffect(() => {
        async function fetchOrdenes() {
            await cargarOrdenesPendientes();
        }
        fetchOrdenes();
    }, []);

    async function cargarOrdenesPendientes() {
        setLoadingOrdenes(true);
        try {
            const lista = await obtenerOrdenesPendientesOFallidas();
            setOrdenesPendientes(lista);
        } finally {
            setLoadingOrdenes(false);
        }
    }
    const [idEliminar, setIdEliminar] = useState("");

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

    const [filtroTitulo, setFiltroTitulo] = useState("");
    const [filtroPrecioMin, setFiltroPrecioMin] = useState("");
    const [filtroPrecioMax, setFiltroPrecioMax] = useState("");
    const [filtroNivelesMin, setFiltroNivelesMin] = useState("");
    const [filtroNivelesMax, setFiltroNivelesMax] = useState("");

    const planosFiltrados = planos.filter(plano => {
        // Filtro por título (insensible a mayúsculas)
        const matchTitulo = filtroTitulo.trim() === "" ||
            plano.titulo.toLowerCase().includes(filtroTitulo.trim().toLowerCase());

        // Filtro por precio (en el primer nivel, asumiendo que está ahí)
        let precio = 0;
        if (plano.niveles && plano.niveles.length > 0) {
            const precioNivel = plano.niveles[0].precio;
            precio = Number(precioNivel) || 0;
        }
        const matchPrecioMin = filtroPrecioMin === "" || precio >= Number(filtroPrecioMin);
        const matchPrecioMax = filtroPrecioMax === "" || precio <= Number(filtroPrecioMax);

        // Filtro por cantidad de niveles
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

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(""), 4000);
            return () => clearTimeout(timer);
        }
    }, [message]);



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
                {importError && <div className={styles.error}>{importError}</div>}
                <button onClick={handleBorrarCarritosVacios} className={styles.primaryBtn} disabled={loading}>
                    <FaTrash /> Borrar carritos vacíos
                </button>
            </div>

            <div className={styles.section}>
                <h3>Órdenes pendientes/fallidas</h3>
                <div>
                    <button
                        className={styles.primaryBtn}
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

                {/* ---- FILTROS ---- */}
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
                {/* ---- FIN FILTROS ---- */}

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
                                    <button onClick={() => handleDelete(plano.id)} className={styles.iconBtn}><FaTrash /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <ModalConfirmacion
                abierto={modalAbierto}
                onClose={() => setModalAbierto(false)}
                onConfirmar={accionPendiente}
                titulo={modalTitulo}
                mensaje={modalMensaje}
            />
        </div>
    );
}
