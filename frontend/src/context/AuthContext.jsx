import React, { createContext, useContext, useState, useEffect } from "react";
import { login, signup, logout } from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

/**
 * ✅ Auth Management Using Server API
 */
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            setCurrentUser(storedUser);
        }
        setLoading(false);
    }, []);

    /**
     * ✅ Login Using Server API
     */
    const handleLogin = async (email, password) => {
        try {
            const response = await login(email, password);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            setCurrentUser(response.user);
            return response.user;
        } catch (error) {
            throw new Error("Login failed.");
        }
    };

    /**
     * ✅ Signup Using Server API
     */
    const handleSignup = async (email, password) => {
        try {
            const response = await signup(email, password);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            setCurrentUser(response.user);
            return response.user;
        } catch (error) {
            throw new Error("Signup failed.");
        }
    };

    /**
     * ✅ Logout Using Server API
     */
    const handleLogout = async () => {
        try {
            await logout();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setCurrentUser(null);
        } catch (error) {
            throw new Error("Logout failed.");
        }
    };

    return (
        <AuthContext.Provider value={{ currentUser, handleLogin, handleSignup, handleLogout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;