import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import FriendManagement from '../components/FriendManagement';
import FriendActivity from '../components/FriendActivity';

const Friends: React.FC = () => {
    const { user, loadFriends, loadFriendRequests, loadFriendActivities } = useAuth();

    // Refresh friend data when the Friends page loads
    useEffect(() => {
        if (user) {
            // Load all friend data in parallel
            Promise.all([
                loadFriends(),
                loadFriendRequests(),
                loadFriendActivities()
            ]);
        }
    }, [user, loadFriends, loadFriendRequests, loadFriendActivities]);

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Friends & Activity
                </h1>
                <p className="text-lg text-gray-600">
                    Manage your friends and see what they're up to!
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Friend Management */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Friend Management</h2>
                    <FriendManagement />
                </div>

                {/* Friend Activity */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Friend Activity</h2>
                    <FriendActivity />
                </div>
            </div>
        </div>
    );
};

export default Friends;
