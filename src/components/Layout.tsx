import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Logout from './Logout';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        StackMeme
                    </Link>

                    <nav className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/feed"
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/feed'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    Feed
                                </Link>
                                <Logout />
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-md text-sm font-medium transition-colors"
                            >
                                Sign In
                            </Link>
                        )}
                    </nav>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;

