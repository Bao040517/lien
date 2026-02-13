import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is stored in localStorage on load
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await api.post('/auth/login', { username, password });
            const userData = response.data.data;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return { success: true, user: userData };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (username, email, password) => {
        try {
            await api.post('/auth/register', { username, email, password });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const requestSellerUpgrade = async () => {
        if (!user) return { success: false, message: "Not logged in" };
        try {
            const response = await api.post(`/users/${user.id}/upgrade-seller`);
            // Update local user state to reflect PENDING status
            const updatedUser = { ...user, sellerStatus: 'PENDING' };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Upgrade failed'
            };
        }
    };

    // Re-fetch user data from backend to sync role/status changes
    const refreshUser = async () => {
        if (!user) return;
        try {
            const response = await api.get(`/users/${user.id}`);
            const freshData = response.data.data || response.data;
            setUser(freshData);
            localStorage.setItem('user', JSON.stringify(freshData));
        } catch (error) {
            console.error("Error refreshing user:", error);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, requestSellerUpgrade, refreshUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
