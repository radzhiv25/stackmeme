import type { User } from '../types/User';
import type { Friend, FriendRequest, UserProfile, FriendActivity } from '../types/Friend';

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    // Friend system methods
    friends: Friend[];
    friendRequests: FriendRequest[];
    userProfile: UserProfile | null;
    friendActivities: FriendActivity[];
    loadFriends: () => Promise<void>;
    loadFriendRequests: () => Promise<void>;
    loadUserProfile: () => Promise<void>;
    loadFriendActivities: () => Promise<void>;
    sendFriendRequest: (email: string) => Promise<void>;
    acceptFriendRequest: (requestId: string) => Promise<void>;
    declineFriendRequest: (requestId: string) => Promise<void>;
    removeFriend: (friendId: string) => Promise<void>;
    searchUsers: (query: string) => Promise<UserProfile[]>;
    updateProfile: (name: string, bio?: string, avatar?: string) => Promise<void>;
    refreshUserData: () => Promise<void>;
}


