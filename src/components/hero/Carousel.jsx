import { useEffect, useRef, useState } from "react";

export default function Carousel({ images, intervalMs = 5000 }) {
    const [idx, setIdx] = useState(0);
    const timer = useRef(null);

    useEffect(() => {
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced || images.length <= 1) return;

        timer.current = window.setInterval(() => {
        setIdx((i) => (i + 1) % images.length);
        }, intervalMs);

        return () => {
            if (timer.current) window.clearInterval(timer.current);
        };
    }, [images.length, intervalMs]);


    return (
    <div className="absolute inset-0 -z-10">
        {images.map((src, i) => (
        <div
            key={src + i}
            className={
            "absolute inset-0 bg-center bg-cover transition-opacity duration-700 will-change-transform " +
            (i === idx ? "opacity-100 scale-100" : "opacity-0 scale-105")
            }
            style={{ backgroundImage: `url(${src})` }}
            aria-hidden={i !== idx}
        />
        ))}
    </div>
);
}