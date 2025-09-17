import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStatistics } from '../hooks/useStatistics';
import { easterEggService } from '../services/easterEggService';
import { toast } from 'sonner';
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
import { Button } from '@/components/ui/button';

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
            <section className="relative overflow-hidden">
                <div className="container mx-auto px-4 py-20 lg:py-32 h-[60vh]">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1
                            className="text-5xl lg:text-7xl font-bold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 text-transparent bg-clip-text mb-6 cursor-pointer flex items-center justify-center gap-4"
                            onClick={() => {
                                // Show toast to check console
                                toast.info("💡 Developer Tip", {
                                    description: "Open your browser console and type 'stackMeme.help()' for easter eggs!",
                                    duration: 3000,
                                });
                                console.log(easterEggService.ui.getRandomStackOverflowQuote());
                                console.log("🎉 You found the hidden StackOverflow reference! This question is now marked as 'accepted answer'.");
                            }}
                            title="Click for a StackOverflow reference!"
                        >
                            <Layers className='text-gray-900 w-12 h-12 lg:w-16 lg:h-16' />
                            StackMeme
                        </h1>
                        <p className="text-xl lg:text-2xl text-gray-600 my-5 max-w-2xl mx-auto">
                            The StackOverflow of memes for developers
                        </p>
                        <p className="text-lg text-gray-500 my-5 max-w-2xl mx-auto">
                            Where every meme is peer-reviewed, upvoted, and marked as "accepted answer"
                        </p>

                        {/* Console Easter Egg Highlight */}
                        <div className="bg-gray-100 rounded-lg p-4 my-10 max-w-2xl mx-auto shadow-md">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-sm font-mono text-gray-600   ml-2">Developer Console</span>
                            </div>
                            <p className="text-sm text-gray-600   font-mono">
                                <span className="text-green-600">console.log</span>
                                <span className="text-gray-500">(</span>
                                <span className="text-gray-600  ">'Try: stackMeme.help()'</span>
                                <span className="text-gray-500">);</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Open your browser console and type <code className="bg-gray-200   px-1 rounded">stackMeme.help()</code> for developer easter eggs!
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center my-10">
                            <Link
                                to="/public"
                            >
                                <Button className="inline-flex gap-2 items-center p-2 bg-gray-900 text-white rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg">
                                    Browse Memes
                                    <FaArrowRight className='size-4' />
                                </Button>
                            </Link>
                            <Link
                                to="/login"
                            >
                                <Button variant="outline" className="inline-flex items-center p-2 border-2 border-gray-400 text-gray-800 rounded-lg text-lg font-semibold bg-gray-100 transition-colors shadow-md">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20">
                {/* Stats */}
                <p className="text-center text-gray-600 my-5 text-2xl font-bold">
                    Our Statistics
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900  ">
                            {loading ? (
                                <div className="inline-block w-16 h-8 bg-gray-200   rounded animate-pulse"></div>
                            ) : error ? (
                                '0+'
                            ) : (
                                `${formatNumber(statistics.totalMemes)}+`
                            )}
                        </div>
                        <div className="text-gray-600  ">Memes Shared</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900  ">
                            {loading ? (
                                <div className="inline-block w-16 h-8 bg-gray-200   rounded animate-pulse"></div>
                            ) : error ? (
                                '0+'
                            ) : (
                                `${formatNumber(statistics.totalUsers)}+`
                            )}
                        </div>
                        <div className="text-gray-600  ">Active Users</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900  ">
                            {loading ? (
                                <div className="inline-block w-16 h-8 bg-gray-200   rounded animate-pulse"></div>
                            ) : error ? (
                                '0+'
                            ) : (
                                `${formatNumber(statistics.totalLikes)}+`
                            )}
                        </div>
                        <div className="text-gray-600  ">Likes Given</div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white  ">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-900   mb-4">
                                Why StackMeme?
                            </h2>
                            <p className="text-xl text-gray-600  ">
                                Built for developers, designed for laughs
                            </p>
                        </div>

                        {/* Bento Grid Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                            {/* Large card - Peer Review System */}
                            <div className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-100   rounded-xl flex items-center justify-center flex-shrink-0">
                                        <FaCode className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900   mb-2">
                                            Peer Review System
                                        </h3>
                                        <p className="text-sm text-gray-600  ">
                                            Every meme is peer-reviewed by the community. Quality guaranteed!
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Small card - Upvote System */}
                            <div className="bg-gradient-to-br from-red-50 to-pink-100 rounded-2xl p-4 border border-red-200">
                                <div className="w-10 h-10 bg-red-100   rounded-lg flex items-center justify-center mb-3">
                                    <FaHeart className="w-5 h-5 text-red-600" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900   mb-1">
                                    Upvote System
                                </h3>
                                <p className="text-xs text-gray-600  ">
                                    Earn reputation points like StackOverflow!
                                </p>
                            </div>

                            {/* Small card - Developer Community */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-4 border border-green-200">
                                <div className="w-10 h-10 bg-green-100   rounded-lg flex items-center justify-center mb-3">
                                    <FaUsers className="w-5 h-5 text-green-600" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900   mb-1">
                                    Developer Community
                                </h3>
                                <p className="text-xs text-gray-600  ">
                                    Connect with fellow developers
                                </p>
                            </div>

                            {/* Medium card - Bug-Free Memes */}
                            <div className="lg:col-span-2 bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6 border border-purple-200">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-purple-100   rounded-xl flex items-center justify-center">
                                        <FaBug className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            Bug-Free Memes
                                        </h3>
                                        <p className="text-sm text-gray-600  ">
                                            All memes are tested and debugged before going live. No runtime errors!
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Small card - Easy Upload */}
                            <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl p-4 border border-orange-200">
                                <div className="w-10 h-10 bg-orange-100   rounded-lg flex items-center justify-center mb-3">
                                    <FaUpload className="w-5 h-5 text-orange-600" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900   mb-1">
                                    Easy Upload
                                </h3>
                                <p className="text-xs text-gray-600  ">
                                    Drag, drop, and share
                                </p>
                            </div>

                            {/* Small card - Coffee-Powered */}
                            <div className="bg-gradient-to-br from-amber-50 to-yellow-100  rounded-2xl p-4 border border-amber-200">
                                <div className="w-10 h-10 bg-amber-100   rounded-lg flex items-center justify-center mb-3">
                                    <FaCoffee className="w-5 h-5 text-amber-600" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-900   mb-1">
                                    Coffee-Powered
                                </h3>
                                <p className="text-xs text-gray-600  ">
                                    Caffeine included
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mock Memes Preview Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900   mb-4">
                                See What's Trending
                            </h2>
                            <p className="text-lg text-gray-600  ">
                                A preview of the memes you'll find on StackMeme
                            </p>
                        </div>

                        {/* Masonry Layout with Mock Memes */}
                        <div className="relative">
                            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 pb-5">
                                {/* Mock Meme 1 - Wide */}
                                <div className="break-inside-avoid bg-white   rounded-2xl p-4 shadow-lg border border-gray-200   relative">
                                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-3 flex items-center justify-center relative">
                                        <div className="text-center">
                                            <FaBug className="text-4xl text-blue-600 mb-2" />
                                            <div className="text-sm font-mono text-gray-600  ">console.log(bug)</div>
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
                                            <div className="w-6 h-6 bg-gray-300   rounded-full"></div>
                                            <div className="w-16 h-3 bg-gray-300   rounded"></div>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-500  ">
                                            <FaHeart className="w-4 h-4" />
                                            <span className="text-sm">42</span>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600  ">
                                        "It works on my machine" 😅
                                    </div>
                                </div>

                                {/* Mock Meme 2 - Tall */}
                                <div className="break-inside-avoid bg-white   rounded-2xl p-4 shadow-lg border border-gray-200   relative">
                                    <div className="aspect-square bg-gradient-to-br from-green-100 to-teal-100 rounded-lg mb-3 flex items-center justify-center relative">
                                        <div className="text-center">
                                            <FaCoffee className="text-4xl text-green-600  mb-2" />
                                            <div className="text-sm font-mono text-gray-600  ">while(true)</div>
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
                                            <div className="w-6 h-6 bg-gray-300   rounded-full"></div>
                                            <div className="w-20 h-3 bg-gray-300   rounded"></div>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-500  ">
                                            <FaHeart className="w-4 h-4" />
                                            <span className="text-sm">128</span>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600  ">
                                        Coffee: The fuel that powers the internet
                                    </div>
                                </div>

                                {/* Mock Meme 3 - Medium */}
                                <div className="break-inside-avoid bg-white   rounded-2xl p-4 shadow-lg border border-gray-200   relative">
                                    <div className="aspect-video bg-gradient-to-br from-red-100 to-pink-100 rounded-lg mb-3 flex items-center justify-center relative">
                                        <div className="text-center">
                                            <FaRocket className="text-4xl text-red-600 mb-2" />
                                            <div className="text-sm font-mono text-gray-600  ">git push --force</div>
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
                                            <div className="w-6 h-6 bg-gray-300   rounded-full"></div>
                                            <div className="w-14 h-3 bg-gray-300   rounded"></div>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-500  ">
                                            <FaHeart className="w-4 h-4" />
                                            <span className="text-sm">89</span>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600  ">
                                        When you deploy on Friday
                                    </div>
                                </div>

                                {/* Mock Meme 4 - Wide */}
                                <div className="break-inside-avoid bg-white   rounded-2xl p-4 shadow-lg border border-gray-200   relative">
                                    <div className="aspect-video bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg mb-3 flex items-center justify-center relative">
                                        <div className="text-center">
                                            <FaRobot className="text-4xl text-orange-600 mb-2" />
                                            <div className="text-sm font-mono text-gray-600  ">AI.replace(me)</div>
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
                                            <div className="w-6 h-6 bg-gray-300   rounded-full"></div>
                                            <div className="w-18 h-3 bg-gray-300   rounded"></div>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-500  ">
                                            <FaHeart className="w-4 h-4" />
                                            <span className="text-sm">256</span>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600  ">
                                        When ChatGPT writes better code than you
                                    </div>
                                </div>

                                {/* Mock Meme 5 - Medium */}
                                <div className="break-inside-avoid bg-white   rounded-2xl p-4 shadow-lg border border-gray-200   relative">
                                    <div className="aspect-video bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg mb-3 flex items-center justify-center relative">
                                        <div className="text-center">
                                            <FaLaptop className="text-4xl text-indigo-600 mb-2" />
                                            <div className="text-sm font-mono text-gray-600  ">npm install</div>
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
                                            <div className="w-6 h-6 bg-gray-300   rounded-full"></div>
                                            <div className="w-16 h-3 bg-gray-300   rounded"></div>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-500  ">
                                            <FaHeart className="w-4 h-4" />
                                            <span className="text-sm">73</span>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600  ">
                                        Installing dependencies... forever
                                    </div>
                                </div>

                                {/* Mock Meme 6 - Tall */}
                                <div className="break-inside-avoid bg-white   rounded-2xl p-4 shadow-lg border border-gray-200   relative">
                                    <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100  rounded-lg mb-3 flex items-center justify-center relative">
                                        <div className="text-center">
                                            <FaCode className="text-4xl text-purple-600 mb-2" />
                                            <div className="text-sm font-mono text-gray-600  ">if (bug) </div>
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
                                            <div className="w-6 h-6 bg-gray-300   rounded-full"></div>
                                            <div className="w-20 h-3 bg-gray-300   rounded"></div>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-500  ">
                                            <FaHeart className="w-4 h-4" />
                                            <span className="text-sm">167</span>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600  ">
                                        When you finally fix that one bug
                                    </div>
                                </div>

                                {/* Mock Meme 7 - Medium */}
                                <div className="break-inside-avoid bg-white   rounded-2xl p-4 shadow-lg border border-gray-200   relative">
                                    <div className="aspect-video bg-gradient-to-br from-teal-100 to-cyan-100 rounded-lg mb-3 flex items-center justify-center">
                                        <div className="text-center">
                                            <FaBolt className="text-4xl text-teal-600 mb-2" />
                                            <div className="text-sm font-mono text-gray-600  ">sudo rm -rf /</div>
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
                                            <div className="w-6 h-6 bg-gray-300   rounded-full"></div>
                                            <div className="w-14 h-3 bg-gray-300   rounded"></div>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-500  ">
                                            <FaHeart className="w-4 h-4" />
                                            <span className="text-sm">94</span>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600  ">
                                        The forbidden command
                                    </div>
                                </div>

                                {/* Mock Meme 8 - Tall */}
                                <div className="break-inside-avoid bg-white   rounded-2xl p-4 shadow-lg border border-gray-200   relative">
                                    <div className="aspect-square bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg mb-3 flex items-center justify-center relative">
                                        <div className="text-center">
                                            <FaCode className="text-4xl text-indigo-600 mb-2" />
                                            <div className="text-sm font-mono text-gray-600  ">npm run dev</div>
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
                                            <div className="w-6 h-6 bg-gray-300   rounded-full"></div>
                                            <div className="w-16 h-3 bg-gray-300   rounded"></div>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-500  ">
                                            <FaHeart className="w-4 h-4" />
                                            <span className="text-sm">203</span>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600  ">
                                        When the dev server actually works
                                    </div>
                                </div>

                                {/* Mock Meme 9 - Wide */}
                                <div className="break-inside-avoid bg-white   rounded-2xl p-4 shadow-lg border border-gray-200   relative">
                                    <div className="aspect-video bg-gradient-to-br from-pink-100 to-rose-100 rounded-lg mb-3 flex items-center justify-center relative">
                                        <div className="text-center">
                                            <FaRobot className="text-4xl text-pink-600 mb-2" />
                                            <div className="text-sm font-mono text-gray-600  ">AI.generate()</div>
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
                                            <div className="w-6 h-6 bg-gray-300   rounded-full"></div>
                                            <div className="w-20 h-3 bg-gray-300   rounded"></div>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-500  ">
                                            <FaHeart className="w-4 h-4" />
                                            <span className="text-sm">156</span>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600  ">
                                        When AI writes better code than you
                                    </div>
                                </div>

                                {/* Mock Meme 10 - Medium */}
                                <div className="break-inside-avoid bg-white   rounded-2xl p-4 shadow-lg border border-gray-200   relative">
                                    <div className="aspect-video bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg mb-3 flex items-center justify-center relative">
                                        <div className="text-center">
                                            <FaCoffee className="text-4xl text-emerald-600 mb-2" />
                                            <div className="text-sm font-mono text-gray-600  ">git commit -m</div>
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
                                            <div className="w-6 h-6 bg-gray-300   rounded-full"></div>
                                            <div className="w-18 h-3 bg-gray-300   rounded"></div>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-500  ">
                                            <FaHeart className="w-4 h-4" />
                                            <span className="text-sm">312</span>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600  ">
                                        "Fixed bug" - commits 2000 lines
                                    </div>
                                </div>

                                {/* Mock Meme 11 - Tall */}
                                <div className="break-inside-avoid bg-white   rounded-2xl p-4 shadow-lg border border-gray-200   relative">
                                    <div className="aspect-square bg-gradient-to-br from-violet-100 to-purple-100 rounded-lg mb-3 flex items-center justify-center relative">
                                        <div className="text-center">
                                            <FaRocket className="text-4xl text-violet-600 mb-2" />
                                            <div className="text-sm font-mono text-gray-600  ">docker run</div>
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
                                            <div className="w-6 h-6 bg-gray-300   rounded-full"></div>
                                            <div className="w-14 h-3 bg-gray-300   rounded"></div>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-500  ">
                                            <FaHeart className="w-4 h-4" />
                                            <span className="text-sm">178</span>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600  ">
                                        When Docker actually works
                                    </div>
                                </div>

                                {/* Mock Meme 12 - Wide */}
                                <div className="break-inside-avoid bg-white   rounded-2xl p-4 shadow-lg border border-gray-200   relative">
                                    <div className="aspect-video bg-gradient-to-br from-amber-100 to-yellow-100 rounded-lg mb-3 flex items-center justify-center relative">
                                        <div className="text-center">
                                            <FaBolt className="text-4xl text-amber-600 mb-2" />
                                            <div className="text-sm font-mono text-gray-600  ">npm install</div>
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
                                            <div className="w-6 h-6 bg-gray-300   rounded-full"></div>
                                            <div className="w-16 h-3 bg-gray-300   rounded"></div>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-500  ">
                                            <FaHeart className="w-4 h-4" />
                                            <span className="text-sm">267</span>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600  ">
                                        Installing dependencies... still
                                    </div>
                                </div>
                            </div>

                            {/* Fade Effect Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 h-[60vh] bg-gradient-to-b from-transparent to-white pointer-events-none"></div>

                            {/* More Cards Indicator */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-6 py-2 shadow-lg border border-gray-200">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <span className="text-sm font-medium">+50 more memes</span>
                                    <div className="flex gap-1">
                                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"></div>
                                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* View More Button */}
                        <div className="text-center mt-12">
                            <Link
                                to="/public"
                            >
                                <Button className="inline-flex gap-2 items-center p-2 bg-gray-900 text-white rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg">
                                    View All Memes
                                    <FaArrowRight className='size-4' />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 ">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl font-bold text-gray-900   mb-4">
                            Ready to start laughing?
                        </h2>
                        <p className="text-xl text-gray-600   mb-8">
                            Join the fun today. No account required to get started.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/public"
                            >
                                <Button className="inline-flex gap-2 items-center p-2 bg-gray-900 text-white rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg">
                                    Browse Memes
                                    <FaArrowRight className='size-4' />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Hidden Easter Egg Footer */}
            <footer className="py-8">
                <div className="container mx-auto px-4 text-center">
                    <div className="text-sm text-gray-500   space-y-2">
                        <p className='flex items-center justify-center gap-2'>Built with  <FaHeart /> and lots of  <FaCoffee /> by developers, for developers</p>
                        <p
                            className="cursor-pointer hover:text-gray-700 transition-colors"
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
                                className="cursor-pointer hover:text-gray-600 transition-colors"
                                onClick={() => console.log("🐛 Bug report: The app is working too well. Please add more bugs.")}
                                title="Click to report a bug!"
                            >
                                Report a bug
                            </span>
                            {' • '}
                            <span
                                className="cursor-pointer hover:text-gray-600 transition-colors"
                                onClick={() => console.log("✨ Feature request: Add ability to teleport memes directly into code comments.")}
                                title="Click to request a feature!"
                            >
                                Request a feature
                            </span>
                            {' • '}
                            <span
                                className="cursor-pointer hover:text-gray-600 transition-colors"
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

