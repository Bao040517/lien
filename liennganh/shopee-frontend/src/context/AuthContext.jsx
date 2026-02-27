import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                try {
                    const parsedUser = JSON.parse(savedUser);
                    setUser(parsedUser);

                    // Validate session with backend
                    try {
                        await api.get(`/users/${parsedUser.id}`);
                    } catch (error) {
                        console.warn("Session invalid, logging out...", error);
                        localStorage.removeItem('user');
                        setUser(null);
                    }
                } catch (e) {
                    console.error("Error parsing user from local storage", e);
                    localStorage.removeItem('user');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (username, password) => {
        try {
            const response = await api.post('/auth/login', { username, password });
            const loginResponse = response.data.data;
            // LoginResponse contains { user: {...}, token: "..." }
            // We need to extract the user object
            const userObj = loginResponse.user;

            setUser(userObj);
            localStorage.setItem('user', JSON.stringify(userObj));

            // Optionally store token if we want to use it later
            if (loginResponse.token) {
                localStorage.setItem('token', loginResponse.token);
            }

            return { success: true, user: userObj };
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
        localStorage.removeItem('token');
    };

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalMode, setAuthModalMode] = useState('login'); // 'login' or 'register'

    const openAuthModal = (mode = 'login') => {
        setAuthModalMode(mode);
        setIsAuthModalOpen(true);
    };

    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
    };

    return (
        <AuthContext.Provider value={{
            user, login, register, logout, requestSellerUpgrade, refreshUser, loading,
            isAuthModalOpen, authModalMode, setAuthModalMode, openAuthModal, closeAuthModal
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
