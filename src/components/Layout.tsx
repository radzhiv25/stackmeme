import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Logout from './Logout';
import { Toaster } from './ui/sonner';
import {
    FaUsers,
    FaUser,
    FaRss,
    FaGlobe
} from 'react-icons/fa';
import { Layers } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    return (
        <div className="min-h-screen">
            <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent">
                        <Layers className='text-gray-900' />
                        StackMeme
                    </Link>

                    <nav className="flex items-center gap-4">
                        <Link
                            to="/public"
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${location.pathname === '/public'
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <FaGlobe className="w-4 h-4" />
                            Public Feed
                        </Link>
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/feed"
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${location.pathname === '/feed'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    <FaRss className="w-4 h-4" />
                                    My Feed
                                </Link>
                                <Link
                                    to="/friends"
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${location.pathname === '/friends'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    <FaUsers className="w-4 h-4" />
                                    Friends
                                </Link>
                                <Link
                                    to="/profile"
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${location.pathname === '/profile'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    <FaUser className="w-4 h-4" />
                                    Profile
                                </Link>
                                <Logout />
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium transition-colors"
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

            {/* Sonner Toast Container */}
            <Toaster />
        </div>
    );
};

export default Layout;

