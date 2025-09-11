import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import type { FriendActivity as FriendActivityType } from '../types/Friend';

const FriendActivity: React.FC = () => {
    const { friendActivities } = useAuth();

    const getActivityIcon = (activityType: FriendActivityType['activityType']) => {
        switch (activityType) {
            case 'meme_upload':
                return '📸';
            case 'meme_like':
                return '❤️';
            case 'comment':
                return '💬';
            case 'friend_added':
                return '👥';
            default:
                return '📝';
        }
    };

    const getActivityText = (activity: FriendActivityType) => {
        switch (activity.activityType) {
            case 'meme_upload':
                return `uploaded a new meme${activity.targetName ? `: "${activity.targetName}"` : ''}`;
            case 'meme_like':
                return `liked a meme${activity.targetName ? `: "${activity.targetName}"` : ''}`;
            case 'comment':
                return `commented on a meme${activity.targetName ? `: "${activity.targetName}"` : ''}`;
            case 'friend_added':
                return `became friends with ${activity.targetName || 'someone'}`;
            default:
                return 'did something';
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return 'just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        }
    };

    if (friendActivities.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Friend Activity</CardTitle>
                    <CardDescription>
                        See what your friends are up to
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-gray-500">
                        No recent activity from your friends. Add some friends to see their activity!
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Friend Activity</CardTitle>
                <CardDescription>
                    Recent activity from your friends
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {friendActivities.map((activity: FriendActivityType) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                                    {getActivityIcon(activity.activityType)}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                    <span className="font-medium text-sm">{activity.userName}</span>
                                    <span className="text-gray-500 text-xs">
                                        {formatTimeAgo(activity.createdAt)}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 mt-1">
                                    {getActivityText(activity)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default FriendActivity;

