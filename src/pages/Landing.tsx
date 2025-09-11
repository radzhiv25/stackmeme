import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStatistics } from '../hooks/useStatistics';
import { easterEggService } from '../services/easterEggService';
import {
    FaArrowRight,
    FaUsers,
    FaHeart,
    FaUpload,
    FaCode,
    FaBug,
    FaCoffee,
    FaRocket,
    FaRobot,
    FaLaptop,
    FaBolt,
} from 'react-icons/fa';
import { Layers } from 'lucide-react';

const Landing: React.FC = () => {
    const { statistics, loading, error } = useStatistics();

    // Initialize console easter eggs
    useEffect(() => {
        easterEggService.console.welcome();

        // JavaScript debugging easter egg
        const handleConsoleOpen = () => {
            console.log(`
🔍 Console Detected! JavaScript Developer Mode Activated!
   
   "If you're a JavaScript developer, here's how you'd debug this:"
   
   🛠️ Debugging Tools Available:
   - stackMeme.debug() - Get debugging tips
   - stackMeme.console() - List all commands
   - stackMeme.help() - Show help
   
   💡 Pro tip: Use console.clear() to start fresh!
            `);
        };

        // Detect console opening (simplified approach)
        let consoleOpen = false;
        const checkConsole = () => {
            if (window.outerHeight - window.innerHeight > 200) {
                if (!consoleOpen) {
                    consoleOpen = true;
                    handleConsoleOpen();
                }
            } else {
                consoleOpen = false;
            }
        };

        // Check periodically for console opening
        const interval = setInterval(checkConsole, 1000);

        return () => clearInterval(interval);
    }, []);

    // Format numbers for display
    const formatNumber = (num: number): string => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="container mx-auto px-4 py-20 lg:py-32">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1
                            className="text-5xl lg:text-7xl font-bold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 dark:from-gray-100 dark:via-gray-200 dark:to-gray-400 text-transparent bg-clip-text mb-6 cursor-pointer flex items-center justify-center gap-4"
                            onClick={() => {
                                console.log(easterEggService.ui.getRandomStackOverflowQuote());
                                console.log("🎉 You found the hidden StackOverflow reference! This question is now marked as 'accepted answer'.");
                            }}
                            title="Click for a StackOverflow reference!"
                        >
                            <Layers className='text-gray-900 w-12 h-12 lg:w-16 lg:h-16' />
                            StackMeme
                        </h1>
                        <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-4 max-w-2xl mx-auto">
                            The StackOverflow of memes for developers
                        </p>
                        <p className="text-lg text-gray-500 dark:text-gray-400 mb-4 max-w-2xl mx-auto">
                            Where every meme is peer-reviewed, upvoted, and marked as "accepted answer"
                        </p>

                        {/* Console Easter Egg Highlight */}
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-sm font-mono text-gray-600 dark:text-gray-400 ml-2">Developer Console</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                                <span className="text-green-600 dark:text-green-400">console.log</span>
                                <span className="text-gray-500">(</span>
                                <span className="text-gray-600 dark:text-gray-400">'Try: stackMeme.help()'</span>
                                <span className="text-gray-500">);</span>
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                Open your browser console and type <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">stackMeme.help()</code> for developer easter eggs!
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <Link
                                to="/public"
                                className="inline-flex items-center p-2 bg-gray-900 text-white rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg"
                            >
                                Browse Memes
                                <FaArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                            <Link
                                to="/login"
                                className="inline-flex items-center p-2 border-2 border-gray-400 dark:border-gray-500 text-gray-800 dark:text-gray-200 rounded-lg text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-md"
                            >
                                Sign In
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    {loading ? (
                                        <div className="inline-block w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                    ) : error ? (
                                        '0+'
                                    ) : (
                                        `${formatNumber(statistics.totalMemes)}+`
                                    )}
                                </div>
                                <div className="text-gray-600 dark:text-gray-400">Memes Shared</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    {loading ? (
                                        <div className="inline-block w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                    ) : error ? (
                                        '0+'
                                    ) : (
                                        `${formatNumber(statistics.totalUsers)}+`
                                    )}
                                </div>
                                <div className="text-gray-600 dark:text-gray-400">Active Users</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    {loading ? (
                                        <div className="inline-block w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                    ) : error ? (
                                        '0+'
                                    ) : (
                                        `${formatNumber(statistics.totalLikes)}+`
                                    )}
                                </div>
                                <div className="text-gray-600 dark:text-gray-400">Likes Given</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                                Why StackMeme?
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400">
                                Built for developers, designed for laughs
                            </p>
                        </div>

                        {/* Bento Grid Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                            {/* Large card - Peer Review System */}
                            <div className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <FaCode className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                            Peer Review System
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Every meme is peer-reviewed by the community. Quality guaranteed!
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Small card - Upvote System */}
                            <div className="bg-gradient-to-br from-red-50 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-4 border border-red-200 dark:border-red-800">
                                <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-3">
                                    <FaHeart className="w-5 h-5 text-red-600 dark:text-red-400" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                    Upvote System
                                </h3>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Earn reputation points like StackOverflow!
                                </p>
                            </div>

                            {/* Small card - Developer Community */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-4 border border-green-200 dark:border-green-800">
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-3">
                                    <FaUsers className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                    Developer Community
                                </h3>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Connect with fellow developers
                                </p>
                            </div>

                            {/* Medium card - Bug-Free Memes */}
                            <div className="lg:col-span-2 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                                        <FaBug className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                            Bug-Free Memes
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            All memes are tested and debugged before going live. No runtime errors!
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Small card - Easy Upload */}
                            <div className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl p-4 border border-orange-200 dark:border-orange-800">
                                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-3">
                                    <FaUpload className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                    Easy Upload
                                </h3>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Drag, drop, and share
                                </p>
                            </div>

                            {/* Small card - Coffee-Powered */}
                            <div className="bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl p-4 border border-amber-200 dark:border-amber-800">
                                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center mb-3">
                                    <FaCoffee className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                    Coffee-Powered
                                </h3>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Caffeine included
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mock Memes Preview Section */}
            <section className="py-20 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                                See What's Trending
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                A preview of the memes you'll find on StackMeme
                            </p>
                        </div>

                        {/* Masonry Layout with Mock Memes */}
                        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                            {/* Mock Meme 1 - Wide */}
                            <div className="break-inside-avoid bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 relative">
                                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg mb-3 flex items-center justify-center relative">
                                    <div className="text-center">
                                        <FaBug className="text-4xl text-blue-600 dark:text-blue-400 mb-2" />
                                        <div className="text-sm font-mono text-gray-600 dark:text-gray-400">console.log(bug)</div>
                                    </div>
                                    {/* Dimension card */}
                                    <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                                        <div className="flex items-center gap-1">
                                            <span>w</span>
                                            <span className="text-xs">16:9</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                                        <div className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                        <FaHeart className="w-4 h-4" />
                                        <span className="text-sm">42</span>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    "It works on my machine" 😅
                                </div>
                            </div>

                            {/* Mock Meme 2 - Tall */}
                            <div className="break-inside-avoid bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 relative">
                                <div className="aspect-square bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 rounded-lg mb-3 flex items-center justify-center relative">
                                    <div className="text-center">
                                        <FaCoffee className="text-4xl text-green-600 dark:text-green-400 mb-2" />
                                        <div className="text-sm font-mono text-gray-600 dark:text-gray-400">while(true)</div>
                                    </div>
                                    {/* Dimension card */}
                                    <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                                        <div className="flex items-center gap-1">
                                            <span>h</span>
                                            <span className="text-xs">1:1</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                                        <div className="w-20 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                        <FaHeart className="w-4 h-4" />
                                        <span className="text-sm">128</span>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Coffee: The fuel that powers the internet
                                </div>
                            </div>

                            {/* Mock Meme 3 - Medium */}
                            <div className="break-inside-avoid bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 relative">
                                <div className="aspect-video bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-lg mb-3 flex items-center justify-center relative">
                                    <div className="text-center">
                                        <FaRocket className="text-4xl text-red-600 dark:text-red-400 mb-2" />
                                        <div className="text-sm font-mono text-gray-600 dark:text-gray-400">git push --force</div>
                                    </div>
                                    {/* Dimension card */}
                                    <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                                        <div className="flex items-center gap-1">
                                            <span>w</span>
                                            <span className="text-xs">16:9</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                                        <div className="w-14 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                        <FaHeart className="w-4 h-4" />
                                        <span className="text-sm">89</span>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    When you deploy on Friday
                                </div>
                            </div>

                            {/* Mock Meme 4 - Wide */}
                            <div className="break-inside-avoid bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 relative">
                                <div className="aspect-video bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg mb-3 flex items-center justify-center relative">
                                    <div className="text-center">
                                        <FaRobot className="text-4xl text-orange-600 dark:text-orange-400 mb-2" />
                                        <div className="text-sm font-mono text-gray-600 dark:text-gray-400">AI.replace(me)</div>
                                    </div>
                                    {/* Dimension card */}
                                    <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                                        <div className="flex items-center gap-1">
                                            <span>w</span>
                                            <span className="text-xs">16:9</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                                        <div className="w-18 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                        <FaHeart className="w-4 h-4" />
                                        <span className="text-sm">256</span>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    When ChatGPT writes better code than you
                                </div>
                            </div>

                            {/* Mock Meme 5 - Medium */}
                            <div className="break-inside-avoid bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 relative">
                                <div className="aspect-video bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-lg mb-3 flex items-center justify-center relative">
                                    <div className="text-center">
                                        <FaLaptop className="text-4xl text-indigo-600 dark:text-indigo-400 mb-2" />
                                        <div className="text-sm font-mono text-gray-600 dark:text-gray-400">npm install</div>
                                    </div>
                                    {/* Dimension card */}
                                    <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                                        <div className="flex items-center gap-1">
                                            <span>w</span>
                                            <span className="text-xs">16:9</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                                        <div className="w-16 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                        <FaHeart className="w-4 h-4" />
                                        <span className="text-sm">73</span>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Installing dependencies... forever
                                </div>
                            </div>

                            {/* Mock Meme 6 - Tall */}
                            <div className="break-inside-avoid bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 relative">
                                <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg mb-3 flex items-center justify-center relative">
                                    <div className="text-center">
                                        <FaCode className="text-4xl text-purple-600 dark:text-purple-400 mb-2" />
                                        <div className="text-sm font-mono text-gray-600 dark:text-gray-400">if (bug) </div>
                                    </div>
                                    {/* Dimension card */}
                                    <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                                        <div className="flex items-center gap-1">
                                            <span>h</span>
                                            <span className="text-xs">1:1</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                                        <div className="w-20 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                        <FaHeart className="w-4 h-4" />
                                        <span className="text-sm">167</span>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    When you finally fix that one bug
                                </div>
                            </div>

                            {/* Mock Meme 7 - Medium */}
                            <div className="break-inside-avoid bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 relative">
                                <div className="aspect-video bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-lg mb-3 flex items-center justify-center">
                                    <div className="text-center">
                                        <FaBolt className="text-4xl text-teal-600 dark:text-teal-400 mb-2" />
                                        <div className="text-sm font-mono text-gray-600 dark:text-gray-400">sudo rm -rf /</div>
                                    </div>
                                    {/* Dimension card */}
                                    <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                                        <div className="flex items-center gap-1">
                                            <span>w</span>
                                            <span className="text-xs">16:9</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                                        <div className="w-14 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                        <FaHeart className="w-4 h-4" />
                                        <span className="text-sm">94</span>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    The forbidden command
                                </div>
                            </div>
                        </div>

                        {/* View More Button */}
                        <div className="text-center mt-12">
                            <Link
                                to="/public"
                                className="inline-flex items-center px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-lg"
                            >
                                View All Memes
                                <FaArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                            Ready to start laughing?
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                            Join the fun today. No account required to get started.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/public"
                                className="inline-flex items-center p-2 bg-black text-white rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors"
                            >
                                Browse Memes Now
                                <FaArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Hidden Easter Egg Footer */}
            <footer className="py-8 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-4 text-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                        <p className='flex items-center justify-center gap-2'>Built with  <FaHeart /> and lots of  <FaCoffee /> by developers, for developers</p>
                        <p
                            className="cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                            onClick={() => {
                                console.log("🔍 You found the secret footer! Here's a developer joke:");
                                console.log(easterEggService.ui.getRandomDeveloperJoke());
                                console.log("Try typing 'stackMeme.help()' in the console for more commands!");
                            }}
                            title="Click for a developer joke!"
                        >
                            StackMeme v1.0.0 - "The StackOverflow of Memes"
                        </p>
                        <p className="text-xs">
                            <span
                                className="cursor-pointer hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                                onClick={() => console.log("🐛 Bug report: The app is working too well. Please add more bugs.")}
                                title="Click to report a bug!"
                            >
                                Report a bug
                            </span>
                            {' • '}
                            <span
                                className="cursor-pointer hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                                onClick={() => console.log("✨ Feature request: Add ability to teleport memes directly into code comments.")}
                                title="Click to request a feature!"
                            >
                                Request a feature
                            </span>
                            {' • '}
                            <span
                                className="cursor-pointer hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                                onClick={() => console.log("🔄 This meme is a duplicate of: 'Funny programming meme #1' - Closed as duplicate.")}
                                title="Click to mark as duplicate!"
                            >
                                Mark as duplicate
                            </span>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;

