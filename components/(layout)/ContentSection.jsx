"use client";
import React from "react";
import styles from './ContentSection.module.css';

function ImageWithSkeleton({ src, alt, className = "" }) {
    const [loaded, setLoaded] = React.useState(false);
    return (
        <div className={`${styles.skeletonWrapper} ${className}`}>
            {!loaded && <div className={styles.skeleton} />}
            <img
                src={src}
                alt={alt}
                className={loaded ? styles.imgLoaded : styles.imgHidden}
                onLoad={() => setLoaded(true)}
                draggable={false}
            />
        </div>
    );
}

function ContentSection({ title, children, image, reverse = false, className = '' }) {
    return (
        <section className={`${styles.big} ${reverse ? styles.reverse : ''} ${className}`}>
            {image && (
                <div className={styles.image}>
                    <ImageWithSkeleton src={image} alt={title || 'Imagen'} />
                </div>
            )}
            <div className={styles.content}>
                {title && <h1 className={styles.title}>{title}</h1>}
                <div className={styles.body}>{children}</div>
            </div>
        </section>
    );
}
export default ContentSection;
