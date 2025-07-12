import { useEffect, useRef, useState } from "react";
import styles from "./ModalImagenZoom.module.css";
import { FaTimes, FaSearchPlus, FaSearchMinus } from "react-icons/fa";

function isMobileDevice() {
    if (typeof window === "undefined") return false;
    return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(window.navigator.userAgent);
}

export default function ModalImagenZoom({ visible, src, alt, onClose }) {
    const [zoom, setZoom] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [imgPos, setImgPos] = useState({ x: 0, y: 0 });
    const imgRef = useRef();
    const isMobile = isMobileDevice();

    // --- Bloquea scroll de fondo solo en desktop
    useEffect(() => {
        if (!isMobile) {
            if (visible) document.body.style.overflow = "hidden";
            else document.body.style.overflow = "";
            return () => { document.body.style.overflow = ""; };
        }
    }, [visible, isMobile]);

    // --- Reset zoom y posición cuando cambia la imagen/modal
    useEffect(() => {
        setZoom(1);
        setImgPos({ x: 0, y: 0 });
    }, [src, visible]);

    // --- Wheel zoom solo en desktop
    useEffect(() => {
        if (!imgRef.current || !visible || isMobile) return;
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
    }, [visible, isMobile]);

    // --- Cerrar con ESC
    useEffect(() => {
        const esc = e => { if (e.key === "Escape") onClose(); };
        if (visible) window.addEventListener("keydown", esc);
        return () => window.removeEventListener("keydown", esc);
    }, [visible, onClose]);

    if (!visible) return null;

    // Pan/arrastre solo en desktop
    const handleMouseDown = e => {
        if (isMobile || zoom === 1) return;
        setIsDragging(true);
        setDragStart({ x: e.clientX - imgPos.x, y: e.clientY - imgPos.y });
    };
    const handleMouseMove = e => {
        if (isMobile || !isDragging) return;
        setImgPos({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };
    const handleMouseUp = () => setIsDragging(false);

    // Touch events solo en desktop (en móvil se usa pinch/zoom nativo del navegador)
    const handleTouchStart = () => {};
    const handleTouchMove = () => {};
    const handleTouchEnd = () => {};

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
        >
            <div className={styles.modalContent}>
                <button className={styles.closeBtn} onClick={onClose} title="Cerrar">
                    <FaTimes />
                </button>
                {!isMobile && (
                    <div className={styles.zoomControls}>
                        <button onClick={() => setZoom(z => Math.max(1, z - 0.1))}><FaSearchMinus /></button>
                        <span>{zoom.toFixed(1)}x</span>
                        <button onClick={() => setZoom(z => Math.min(3, z + 0.1))}><FaSearchPlus /></button>
                    </div>
                )}
                <div className={styles.imgContainer}>
                    <img
                        ref={imgRef}
                        src={src}
                        alt={alt}
                        style={
                            isMobile
                                ? {
                                    width: "100%",
                                    height: "auto",
                                    objectFit: "contain",
                                    touchAction: "auto", // Permite pinch zoom nativo
                                    cursor: "zoom-in"
                                }
                                : {
                                    transform: `scale(${zoom}) translate(${imgPos.x / zoom}px, ${imgPos.y / zoom}px)`,
                                    cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in",
                                    transition: isDragging ? "none" : "transform 0.25s cubic-bezier(.23,1.03,.83,1)",
                                    maxWidth: "none",
                                    maxHeight: "none",
                                }
                        }
                        className={styles.zoomImage}
                        onMouseDown={handleMouseDown}
                        draggable={false}
                    />
                </div>
            </div>
        </div>
    );
}
