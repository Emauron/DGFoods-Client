import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const addToCart = (product) => {
        setCart([...cart, product]);
    };
    const removeFromCart = (product) => {
        setCart(cart.filter((item) => item.id !== product.id));
    };
    const clearCart = () => {
        setCart([]);
    };
    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
