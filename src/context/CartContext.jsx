import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

const STORAGE_KEY = "cart:v1"; // coloque uma versão pra facilitar evoluções futuras

export const CartContextProvider = ({ children }) => {
    // Estado inicial vindo do localStorage (com checagem pra SSR)
    const [cart, setCart] = useState(() => {
        if (typeof window === "undefined") return [];
        try {
            const saved = window.localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // Persistir no localStorage a cada mudança
    useEffect(() => {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        } catch {
        // opcional: console.error("Falha ao salvar carrinho no localStorage", e);
        }
    }, [cart]);

    // (Opcional) Sincronizar entre abas/janelas
    useEffect(() => {
        const onStorage = (e) => {
        if (e.key === STORAGE_KEY) {
            try {
            setCart(e.newValue ? JSON.parse(e.newValue) : []);
            } catch {
            setCart([]);
            }
        }
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const addToCart = (product) => {
        setCart((prev) => [...prev, product]);
        console.log(cart);

    };

    const removeFromCart = (product) => {
        setCart((prev) => prev.filter((item) => item.lineId !== product.lineId));
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
        {children}
        </CartContext.Provider>
    );
};
