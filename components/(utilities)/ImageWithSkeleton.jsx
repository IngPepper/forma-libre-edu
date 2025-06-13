// components/utilities/ImageWithSkeleton.jsx
"use client";
import React, { useState } from "react";
import styles from "./ImageWithSkeleton.module.css";

export default function ImageWithSkeleton({ src, alt, className = "", ...props }) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className={`${styles.wrapper} ${className}`}>
            {!loaded && <div className={styles.skeleton} />}
            <img
                src={src}
                alt={alt}
                className={`${styles.image} ${loaded ? styles.loaded : styles.hidden}`}
                onLoad={() => setLoaded(true)}
                {...props}
                draggable={false}
            />
        </div>
    );
}
