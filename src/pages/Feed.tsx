import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { MemeProvider } from '../contexts/MemeContext';
import MemeFeed from '../components/MemeFeed';

const Feed: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome back, {user?.name || user?.email}! 👋
                </h1>
                <p className="text-lg text-gray-600">
                    Your personalized meme feed is ready!
                </p>
            </div>

            {/* Meme Feed - All memes for logged-in users */}
            <MemeProvider anonymousOnly={false}>
                <MemeFeed />
            </MemeProvider>
        </div>
    );
};

export default Feed;

