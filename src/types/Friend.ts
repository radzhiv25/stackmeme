export interface Friend {
    id: string;
    userId: string;
    friendId: string;
    friendName: string;
    friendEmail: string;
    status: 'pending' | 'accepted' | 'blocked';
    createdAt: string;
    updatedAt: string;
}

export interface FriendRequest {
    id: string;
    fromUserId: string;
    fromUserName: string;
    fromUserEmail: string;
    toUserId: string;
    toUserName: string;
    toUserEmail: string;
    status: 'pending' | 'accepted' | 'declined';
    createdAt: string;
    updatedAt: string;
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
    isOnline: boolean;
    lastSeen: string;
    friendsCount: number;
    memesCount: number;
    createdAt: string;
}

export interface FriendActivity {
    id: string;
    userId: string;
    userName: string;
    activityType: 'meme_upload' | 'meme_like' | 'comment' | 'friend_added';
    targetId?: string; // meme ID or friend ID
    targetName?: string; // meme caption or friend name
    createdAt: string;
}




