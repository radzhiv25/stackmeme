import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Logout from './Logout';
import { Toaster } from './ui/sonner';
import {
    FaUsers,
    FaUser,
    FaRss,
    FaGlobe,
    FaBars,
    FaTimes
} from 'react-icons/fa';
import { Layers } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setIsMobileMenuOpen(false);
            }
        };

        if (isMobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMobileMenuOpen]);

    return (
        <div className="min-h-screen">
            {/* Marquee Section - Full Width Above Navbar */}
            <section className="bg-gray-50 py-1 sm:py-2 overflow-hidden w-full">
                <div className="flex animate-marquee">
                    <div className="flex space-x-4 sm:space-x-8 whitespace-nowrap">
                        <span className="text-gray-600 font-medium text-xs sm:text-sm">"It works on my machine" - Every Developer</span>
                        <span className="text-gray-600 font-medium text-xs sm:text-sm">"Have you tried turning it off and on again?"</span>
                        <span className="text-gray-600 font-medium text-xs sm:text-sm">"This is not a bug, it's a feature"</span>
                        <span className="text-gray-600 font-medium text-xs sm:text-sm">"I'll fix it in the next sprint"</span>
                        <span className="text-gray-600 font-medium text-xs sm:text-sm">"The code is self-documenting"</span>
                        <span className="text-gray-600 font-medium text-xs sm:text-sm">"It's not a bug, it's an undocumented feature"</span>
                        <span className="text-gray-600 font-medium text-xs sm:text-sm">"I'll refactor it later"</span>
                        <span className="text-gray-600 font-medium text-xs sm:text-sm">"Works in production"</span>
                        <span className="text-gray-600 font-medium text-xs sm:text-sm">"Just one more commit"</span>
                        <span className="text-gray-600 font-medium text-xs sm:text-sm">"The tests are passing, ship it!"</span>
                    </div>
                </div>
            </section>

            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3 sm:py-4">
                    <div className="flex justify-between items-center">
                        <Link to="/" className="flex items-center gap-2 text-xl sm:text-2xl font-bold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent">
                            <Layers className='text-gray-900 w-6 h-6 sm:w-7 sm:h-7' />
                            <span className="">StackMeme</span> 
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-4">
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

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                            aria-label="Toggle mobile menu"
                        >
                            {isMobileMenuOpen ? (
                                <FaTimes className="w-5 h-5" />
                            ) : (
                                <FaBars className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    {/* Mobile Navigation Menu */}
                    {isMobileMenuOpen && (
                        <div ref={mobileMenuRef} className="md:hidden mt-4 pb-4 border-t border-gray-200">
                            <nav className="flex flex-col space-y-2 pt-4">
                                <Link
                                    to="/public"
                                    onClick={() => setIsMobileMenuOpen(false)}
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
                                            onClick={() => setIsMobileMenuOpen(false)}
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
                                            onClick={() => setIsMobileMenuOpen(false)}
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
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${location.pathname === '/profile'
                                                ? 'bg-primary text-primary-foreground'
                                                : 'text-muted-foreground hover:text-foreground'
                                                }`}
                                        >
                                            <FaUser className="w-4 h-4" />
                                            Profile
                                        </Link>
                                        <div className="px-3 py-2">
                                            <Logout />
                                        </div>
                                    </>
                                ) : (
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="px-3 py-2 bg-black text-white rounded-md text-sm font-medium transition-colors text-center"
                                    >
                                        Sign In
                                    </Link>
                                )}
                            </nav>
                        </div>
                    )}
                </div>
            </header>

            <main className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
                {children}
            </main>

            {/* Sonner Toast Container */}
            <Toaster />
        </div>
    );
};

export default Layout;

