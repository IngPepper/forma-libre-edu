"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./SearchBar.module.css";
import { AnimatePresence, motion } from "framer-motion";

export default function SearchBar({
                                      placeholder = "Buscar...",
                                      onSearch,
                                      autoFocus = false,
                                      debounceMs = 400, // puedes ajustar el delay aquí
                                  }) {
    const [query, setQuery] = useState("");
    const inputRef = useRef(null);
    const debounceTimeout = useRef();

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    useEffect(() => {
        // Limpiar el timeout anterior
        clearTimeout(debounceTimeout.current);

        // Solo debouncamos si hay handler de búsqueda
        if (onSearch) {
            debounceTimeout.current = setTimeout(() => {
                onSearch(query);
            }, debounceMs);
        }

        // Limpiar timeout si desmonta/cambia antes del tiempo
        return () => clearTimeout(debounceTimeout.current);
    }, [query, onSearch, debounceMs]);

    const handleChange = (e) => {
        setQuery(e.target.value);
    };

    const handleClear = () => {
        setQuery("");
        if (onSearch) onSearch("");
        if (inputRef.current) inputRef.current.focus();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Forzamos búsqueda inmediata al enviar
        clearTimeout(debounceTimeout.current);
        if (onSearch) onSearch(query);
        if (inputRef.current) inputRef.current.focus();
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
                    ref={inputRef}
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
            </form>
        </div>
    );
}
