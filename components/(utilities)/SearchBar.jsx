"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./SearchBar.module.css";

export default function SearchBar({ placeholder = "Buscar...", onSearch, autoFocus = false }) {
    const [query, setQuery] = useState("");
    const inputRef = useRef(null);

    // Auto-focus al montar (opcional, si quieres enfocar al entrar a la página)
    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    const handleChange = (e) => {
        setQuery(e.target.value);
        if (onSearch) onSearch(e.target.value);
    };

    const handleClear = () => {
        setQuery("");
        if (onSearch) onSearch("");
        if (inputRef.current) inputRef.current.focus(); // <-- focus tras limpiar
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) onSearch(query);
        if (inputRef.current) inputRef.current.focus(); // Opcional: focus tras buscar
    };

    return (
        <div className={styles.searchBarWrapper}>
            <form
                className={styles.searchBar}
                onSubmit={handleSubmit}
                role="search"
                autoComplete="off"
            >
                <span className={styles.icon}>
                    {/* Ícono de búsqueda */}
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </span>
                <input
                    ref={inputRef} // <-- aquí el ref
                    className={styles.input}
                    type="search"
                    aria-label="Buscar"
                    placeholder={placeholder}
                    value={query}
                    onChange={handleChange}
                    autoComplete="on"
                />
                {query && (
                    <button
                        type="button"
                        className={styles.clearButton}
                        onClick={handleClear}
                        aria-label="Limpiar"
                    >
                        &#10005;
                    </button>
                )}
                {/*<button type="submit" className={styles.button} aria-label="Buscar">
                    <span className={styles.buttonText}>Buscar</span>
                    <span className={styles.buttonIcon}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </span>
                </button>*/}
            </form>
        </div>
    );
}
