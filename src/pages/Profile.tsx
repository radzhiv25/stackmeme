import React from 'react';
import UserProfile from '../components/UserProfile';

const Profile: React.FC = () => {

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Your Profile
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                    Manage your profile and personal information
                </p>
            </div>

            {/* User Profile Component */}
            <UserProfile />
        </div>
    );
};

export default Profile;
