import React, { useEffect, useState } from 'react';
import { account, ID } from '../lib/appwrite';
import type { User } from '../types/User';
import type { AuthContextType } from './AuthContext.types';
import type { Friend, FriendRequest, UserProfile, FriendActivity } from '../types/Friend';
import { friendService } from '../services/friendService';
import { AuthContext } from './AuthContextDefinition';


interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    // Friend system state
    const [friends, setFriends] = useState<Friend[]>([]);
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [friendActivities, setFriendActivities] = useState<FriendActivity[]>([]);

    const isAuthenticated = !!user;

    useEffect(() => {
        checkUser();
    }, []);

    // Reload profile data when user changes
    useEffect(() => {
        if (user) {
            loadUserProfile();
        }
    }, [user?.$id]);

    const checkUser = async () => {
        try {
            const userData = await account.get();
            setUser(userData);

            // Load friend system data if user is authenticated
            if (userData) {
                // Load all data in parallel for better performance
                await Promise.all([
                    loadUserProfile(),
                    loadFriends(),
                    loadFriendRequests(),
                    loadFriendActivities()
                ]);
            }
        } catch (error) {
            // Silently handle 401 errors for anonymous users
            if (error instanceof Error && error.message.includes('401')) {
                // User is not authenticated, which is fine for anonymous usage
                setUser(null);
            } else {
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            await account.createEmailPasswordSession(email, password);
            const userData = await account.get();
            setUser(userData);

            // Load friend system data after login
            await loadUserProfile();
            await loadFriends();
            await loadFriendRequests();
            await loadFriendActivities();
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const register = async (email: string, password: string, name: string) => {
        try {
            await account.create(ID.unique(), email, password, name);
            const userData = await account.get();
            setUser(userData);

            // Create user profile after registration
            await friendService.createOrUpdateUserProfile(userData.$id, name, email);

            // Load friend system data after profile creation
            await loadUserProfile();
            await loadFriends();
            await loadFriendRequests();
            await loadFriendActivities();
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await account.deleteSession('current');
            setUser(null);
            // Clear friend system state
            setFriends([]);
            setFriendRequests([]);
            setUserProfile(null);
            setFriendActivities([]);
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    };

    // Friend system methods
    const loadFriends = async () => {
        if (!user) {
            return;
        }
        try {
            const friendsData = await friendService.getFriends(user.$id);
            setFriends(friendsData);
        } catch (error) {
            console.error('Error loading friends:', error);
        }
    };

    const loadFriendRequests = async () => {
        if (!user) {
            return;
        }
        try {
            const requestsData = await friendService.getFriendRequests(user.$id);
            setFriendRequests(requestsData);
        } catch (error) {
            console.error('Error loading friend requests:', error);
            // Set empty array on error to prevent UI issues
            setFriendRequests([]);
        }
    };

    const loadUserProfile = async () => {
        if (!user) {
            return;
        }
        try {
            const profileData = await friendService.getUserProfile(user.$id);
            setUserProfile(profileData);

            // Refresh counts to ensure they're accurate
            try {
                await friendService.refreshUserCounts(user.$id);
                // Reload profile to get updated counts
                const updatedProfile = await friendService.getUserProfile(user.$id);
                setUserProfile(updatedProfile);
            } catch (countError) {
                console.error('Error refreshing user counts:', countError);
                // Don't fail the entire profile load for count errors
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
            // If profile doesn't exist, create one
            if (error instanceof Error && error.message.includes('404')) {
                try {
                    const newProfile = await friendService.createOrUpdateUserProfile(
                        user.$id,
                        user.name,
                        user.email
                    );
                    setUserProfile(newProfile);
                } catch (createError) {
                    console.error('Error creating user profile:', createError);
                }
            }
        }
    };

    const loadFriendActivities = async () => {
        if (!user) {
            return;
        }
        try {
            const activitiesData = await friendService.getFriendActivities(user.$id);
            setFriendActivities(activitiesData);
        } catch (error) {
            console.error('Error loading friend activities:', error);
            // Set empty array on error to prevent UI issues
            setFriendActivities([]);
        }
    };

    const sendFriendRequest = async (email: string) => {
        if (!user) return;
        try {
            await friendService.sendFriendRequest(user.$id, user.name, user.email, email);
            await loadFriendRequests();
        } catch (error) {
            console.error('Error sending friend request:', error);
            throw error;
        }
    };

    const acceptFriendRequest = async (requestId: string) => {
        if (!user) return;
        try {
            await friendService.acceptFriendRequest(requestId);
            await loadFriends();
            await loadFriendRequests();
            await loadUserProfile();
        } catch (error) {
            console.error('Error accepting friend request:', error);
            throw error;
        }
    };

    const declineFriendRequest = async (requestId: string) => {
        if (!user) return;
        try {
            await friendService.declineFriendRequest(requestId);
            await loadFriendRequests();
        } catch (error) {
            console.error('Error declining friend request:', error);
            throw error;
        }
    };

    const removeFriend = async (friendId: string) => {
        if (!user) return;
        try {
            await friendService.removeFriend(user.$id, friendId);
            await loadFriends();
            await loadUserProfile();
        } catch (error) {
            console.error('Error removing friend:', error);
            throw error;
        }
    };

    const searchUsers = async (query: string): Promise<UserProfile[]> => {
        if (!user) return [];
        try {
            return await friendService.searchUsers(query, user.$id);
        } catch (error) {
            console.error('Error searching users:', error);
            return [];
        }
    };

    const updateProfile = async (name: string, bio?: string, avatar?: string) => {
        if (!user) return;
        try {
            const updatedProfile = await friendService.createOrUpdateUserProfile(user.$id, name, user.email, avatar, bio);
            setUserProfile(updatedProfile);

            // Refresh counts after profile update
            try {
                await friendService.refreshUserCounts(user.$id);
                // Reload profile to get updated counts
                const refreshedProfile = await friendService.getUserProfile(user.$id);
                setUserProfile(refreshedProfile);
            } catch (countError) {
                console.error('Error refreshing counts after profile update:', countError);
                // Don't fail the profile update for count errors
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    };

    // Refresh all user data (useful for fixing persistence issues)
    const refreshUserData = async () => {
        if (!user) return;
        try {
            await Promise.all([
                loadUserProfile(),
                loadFriends(),
                loadFriendRequests(),
                loadFriendActivities()
            ]);
        } catch (error) {
            console.error('Error refreshing user data:', error);
        }
    };

    const value: AuthContextType = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        // Friend system properties
        friends,
        friendRequests,
        userProfile,
        friendActivities,
        loadFriends,
        loadFriendRequests,
        loadUserProfile,
        loadFriendActivities,
        sendFriendRequest,
        acceptFriendRequest,
        declineFriendRequest,
        removeFriend,
        searchUsers,
        updateProfile,
        refreshUserData,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
