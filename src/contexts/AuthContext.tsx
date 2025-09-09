import React, { useEffect, useState } from 'react';
import { account, ID } from '../lib/appwrite';
import type { User } from '../types/User';
import type { AuthContextType } from './AuthContext.types';
import { AuthContext } from './AuthContextDefinition';


interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!user;

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const userData = await account.get();
            setUser(userData);
        } catch (error) {
            // Silently handle 401 errors for anonymous users
            if (error instanceof Error && error.message.includes('401')) {
                // User is not authenticated, which is fine for anonymous usage
                setUser(null);
            } else {
                console.log('No user session found');
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            await account.createEmailPasswordSession(email, password);
            const userData = await account.get();
            setUser(userData);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const register = async (email: string, password: string, name: string) => {
        try {
            await account.create(ID.unique(), email, password, name);
            await login(email, password);
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await account.deleteSession('current');
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    };

    const value: AuthContextType = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
