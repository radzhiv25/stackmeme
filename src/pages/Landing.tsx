import React from 'react';
import { Link } from 'react-router-dom';
import { MemeProvider } from '../contexts/MemeContext';
import MemeFeed from '../components/MemeFeed';

const Landing: React.FC = () => {
    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    StackMeme
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                    Share, discover, and enjoy the funniest memes! No account needed to get started.
                </p>

                {/* Call to Action */}
                <div className="flex justify-center gap-4 mb-8">
                    <Link
                        to="/login"
                        className="px-6 py-3 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 rounded-lg font-medium transition-colors"
                    >
                        Sign In for More Features
                    </Link>
                </div>
            </div>

            {/* Meme Feed - Anonymous Only */}
            <MemeProvider anonymousOnly={true}>
                <MemeFeed />
            </MemeProvider>
        </div>
    );
};

export default Landing;

