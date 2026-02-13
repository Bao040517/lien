import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartCount, setCartCount] = useState(0);

    const refreshCart = async () => {
        if (!user) {
            setCartCount(0);
            return;
        }
        try {
            const response = await api.get(`/cart/${user.id}`);
            const cart = response.data.data || response.data;
            const items = cart.items || [];
            // Count total distinct items (number of different products)
            const count = items.length;
            setCartCount(count);
        } catch (error) {
            console.error("Error fetching cart count:", error);
            setCartCount(0);
        }
    };

    useEffect(() => {
        refreshCart();
    }, [user]);

    return (
        <CartContext.Provider value={{ cartCount, refreshCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
