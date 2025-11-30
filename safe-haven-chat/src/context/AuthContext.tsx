import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient, { UserSummary } from '../lib/api';

interface AuthContextType {
    user: UserSummary | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (userData: any) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await apiClient.getMe();
                    setUser(userData);
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const response = await apiClient.login(email, password);
        if (response.access_token) {
            // Token is already set in localStorage by apiClient.login, but we need to fetch user details
            const userData = await apiClient.getMe();
            setUser(userData);
        }
    };

    const signup = async (userData: any) => {
        await apiClient.signup(userData);
        // After signup, usually we want to login automatically or redirect to login. 
        // For now, let's assume the user needs to login manually or the component handles it.
        // If the API returns a token on signup, we could handle it here.
    };

    const logout = () => {
        apiClient.setToken(null);
        setUser(null);
        // Optional: Redirect to login or home
        window.location.href = '/login';
    };

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
