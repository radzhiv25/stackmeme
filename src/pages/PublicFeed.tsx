import React from 'react';
import { MemeProvider } from '../contexts/MemeContext';
import PublicMemeFeed from '../components/PublicMemeFeed';

const PublicFeed: React.FC = () => {
    return (
        <MemeProvider anonymousOnly={true}>
            <PublicMemeFeed />
        </MemeProvider>
    );
};

export default PublicFeed;
