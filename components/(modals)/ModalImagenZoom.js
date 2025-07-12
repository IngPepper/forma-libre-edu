"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./ModalImagenZoom.module.css";
import { FaTimes, FaSearchPlus, FaSearchMinus } from "react-icons/fa";

export default function ModalImagenZoom({ visible, src, alt, onClose }) {
    const [zoom, setZoom] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [imgPos, setImgPos] = useState({ x: 0, y: 0 });
    const imgRef = useRef();

    // --- Bloquea scroll de fondo
    useEffect(() => {
        if (visible) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [visible]);

    // --- Reset zoom y posición cuando cambia la imagen/modal
    useEffect(() => {
        setZoom(1);
        setImgPos({ x: 0, y: 0 });
    }, [src, visible]);

    // --- Wheel zoom: con passive: false (sin warning)
    useEffect(() => {
        if (!imgRef.current || !visible) return;
        const img = imgRef.current;
        const handleWheel = e => {
            e.preventDefault();
            const delta = e.deltaY < 0 ? 0.1 : -0.1;
            setZoom(z => {
                const newZoom = Math.max(1, Math.min(3, z + delta));
                if (newZoom === 1) setImgPos({ x: 0, y: 0 });
                return newZoom;
            });
        };
        img.addEventListener("wheel", handleWheel, { passive: false });
        return () => {
            img.removeEventListener("wheel", handleWheel);
        };
    }, [visible]);

    // --- Cerrar con ESC
    useEffect(() => {
        const esc = e => { if (e.key === "Escape") onClose(); };
        if (visible) window.addEventListener("keydown", esc);
        return () => window.removeEventListener("keydown", esc);
    }, [visible, onClose]);

    if (!visible) return null;

    // Pan/arrastre de la imagen
    const handleMouseDown = e => {
        if (zoom === 1) return;
        setIsDragging(true);
        setDragStart({ x: e.clientX - imgPos.x, y: e.clientY - imgPos.y });
    };
    const handleMouseMove = e => {
        if (isDragging) {
            setImgPos({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };
    const handleMouseUp = () => setIsDragging(false);

    // Touch events
    const handleTouchStart = e => {
        if (zoom === 1) return;
        const touch = e.touches[0];
        setIsDragging(true);
        setDragStart({ x: touch.clientX - imgPos.x, y: touch.clientY - imgPos.y });
    };
    const handleTouchMove = e => {
        if (isDragging) {
            const touch = e.touches[0];
            setImgPos({
                x: touch.clientX - dragStart.x,
                y: touch.clientY - dragStart.y
            });
        }
    };
    const handleTouchEnd = () => setIsDragging(false);

    // Cerrar con backdrop
    const handleBackdropClick = e => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            className={styles.modalBackdrop}
            onClick={handleBackdropClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className={styles.modalContent}>
                <button className={styles.closeBtn} onClick={onClose} title="Cerrar">
                    <FaTimes />
                </button>
                <div className={styles.zoomControls}>
                    <button onClick={() => setZoom(z => Math.max(1, z - 0.1))}><FaSearchMinus /></button>
                    <span>{zoom.toFixed(1)}x</span>
                    <button onClick={() => setZoom(z => Math.min(3, z + 0.1))}><FaSearchPlus /></button>
                </div>
                <div className={styles.imgContainer}>
                    <img
                        ref={imgRef}
                        src={src}
                        alt={alt}
                        style={{
                            transform: `scale(${zoom}) translate(${imgPos.x / zoom}px, ${imgPos.y / zoom}px)`,
                            cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in",
                            transition: isDragging ? "none" : "transform 0.25s cubic-bezier(.23,1.03,.83,1)",
                            maxWidth: "none",
                            maxHeight: "none",
                        }}
                        className={styles.zoomImage}
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleTouchStart}
                        draggable={false}
                    />
                </div>
            </div>
        </div>
    );
}
