import { databases, ID, Query } from '../lib/appwrite';
import type { Friend, FriendRequest, UserProfile, FriendActivity } from '../types/Friend';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const FRIENDS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_FRIENDS_COLLECTION_ID;
const FRIEND_REQUESTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_FRIEND_REQUESTS_COLLECTION_ID;
const USER_PROFILES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USER_PROFILES_COLLECTION_ID;
const FRIEND_ACTIVITIES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_FRIEND_ACTIVITIES_COLLECTION_ID;

export const friendService = {
    // Get all friends for a user
    async getFriends(userId: string): Promise<Friend[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                FRIENDS_COLLECTION_ID,
                [
                    Query.equal('userId', userId),
                    Query.equal('status', 'accepted'),
                    Query.orderDesc('createdAt')
                ]
            );

            return response.documents.map(doc => ({
                id: doc.$id,
                userId: doc.userId,
                friendId: doc.friendId,
                friendName: doc.friendName,
                friendEmail: doc.friendEmail,
                status: doc.status as Friend['status'],
                createdAt: doc.createdAt,
                updatedAt: doc.updatedAt,
            }));
        } catch (error) {
            console.error('Error fetching friends:', error);
            throw error;
        }
    },

    // Get friend requests (sent and received)
    async getFriendRequests(userId: string, type: 'sent' | 'received' | 'all' = 'all'): Promise<FriendRequest[]> {
        try {
            const queries = [];

            if (type === 'sent') {
                queries.push(Query.equal('fromUserId', userId));
            } else if (type === 'received') {
                queries.push(Query.equal('toUserId', userId));
            } else {
                queries.push(Query.or([
                    Query.equal('fromUserId', userId),
                    Query.equal('toUserId', userId)
                ]));
            }

            queries.push(Query.orderDesc('createdAt'));

            const response = await databases.listDocuments(
                DATABASE_ID,
                FRIEND_REQUESTS_COLLECTION_ID,
                queries
            );

            return response.documents.map(doc => ({
                id: doc.$id,
                fromUserId: doc.fromUserId,
                fromUserName: doc.fromUserName,
                fromUserEmail: doc.fromUserEmail,
                toUserId: doc.toUserId,
                toUserName: doc.toUserName,
                toUserEmail: doc.toUserEmail,
                status: doc.status as FriendRequest['status'],
                createdAt: doc.createdAt,
                updatedAt: doc.updatedAt,
            }));
        } catch (error) {
            console.error('Error fetching friend requests:', error);
            // Don't throw error for friend requests, just return empty array
            return [];
        }
    },

    // Send a friend request
    async sendFriendRequest(fromUserId: string, fromUserName: string, fromUserEmail: string, toUserEmail: string): Promise<FriendRequest> {
        try {
            // Check if user is trying to add themselves
            if (fromUserEmail.toLowerCase() === toUserEmail.toLowerCase()) {
                throw new Error('You cannot add yourself as a friend');
            }

            // First, find the target user by email
            const usersResponse = await databases.listDocuments(
                DATABASE_ID,
                USER_PROFILES_COLLECTION_ID,
                [Query.equal('email', toUserEmail)]
            );

            if (usersResponse.documents.length === 0) {
                throw new Error(`User not found with email: ${toUserEmail}. Make sure they have created a profile first.`);
            }

            const targetUser = usersResponse.documents[0];

            // Check if user is trying to add themselves (by ID)
            if (fromUserId === targetUser.$id) {
                throw new Error('You cannot add yourself as a friend');
            }

            // Check if users are already friends
            const existingFriendship = await databases.listDocuments(
                DATABASE_ID,
                FRIENDS_COLLECTION_ID,
                [
                    Query.or([
                        Query.and([
                            Query.equal('userId', fromUserId),
                            Query.equal('friendId', targetUser.$id)
                        ]),
                        Query.and([
                            Query.equal('userId', targetUser.$id),
                            Query.equal('friendId', fromUserId)
                        ])
                    ])
                ]
            );

            if (existingFriendship.documents.length > 0) {
                throw new Error('Users are already friends');
            }

            // Check if there's already a pending request
            const existingRequest = await databases.listDocuments(
                DATABASE_ID,
                FRIEND_REQUESTS_COLLECTION_ID,
                [
                    Query.or([
                        Query.and([
                            Query.equal('fromUserId', fromUserId),
                            Query.equal('toUserId', targetUser.$id)
                        ]),
                        Query.and([
                            Query.equal('fromUserId', targetUser.$id),
                            Query.equal('toUserId', fromUserId)
                        ])
                    ]),
                    Query.equal('status', 'pending')
                ]
            );

            if (existingRequest.documents.length > 0) {
                throw new Error('Friend request already exists');
            }

            // Create the friend request
            const now = new Date().toISOString();
            const response = await databases.createDocument(
                DATABASE_ID,
                FRIEND_REQUESTS_COLLECTION_ID,
                ID.unique(),
                {
                    fromUserId: fromUserId,
                    fromUserName: fromUserName,
                    fromUserEmail: fromUserEmail,
                    toUserId: targetUser.$id,
                    toUserName: targetUser.name,
                    toUserEmail: targetUser.email,
                    status: 'pending',
                    createdAt: now,
                    updatedAt: now,
                }
            );

            return {
                id: response.$id,
                fromUserId: response.fromUserId,
                fromUserName: response.fromUserName,
                fromUserEmail: response.fromUserEmail,
                toUserId: response.toUserId,
                toUserName: response.toUserName,
                toUserEmail: response.toUserEmail,
                status: response.status as FriendRequest['status'],
                createdAt: response.createdAt,
                updatedAt: response.updatedAt,
            };
        } catch (error) {
            console.error('Error sending friend request:', error);
            throw error;
        }
    },

    // Accept a friend request
    async acceptFriendRequest(requestId: string): Promise<Friend> {
        try {
            // Get the friend request
            const request = await databases.getDocument(
                DATABASE_ID,
                FRIEND_REQUESTS_COLLECTION_ID,
                requestId
            );

            if (request.status !== 'pending') {
                throw new Error('Friend request is not pending');
            }

            // Update the request status
            await databases.updateDocument(
                DATABASE_ID,
                FRIEND_REQUESTS_COLLECTION_ID,
                requestId,
                { status: 'accepted' }
            );

            // Create friendship records for both users
            const now = new Date().toISOString();
            const friendship1 = await databases.createDocument(
                DATABASE_ID,
                FRIENDS_COLLECTION_ID,
                ID.unique(),
                {
                    userId: request.fromUserId,
                    friendId: request.toUserId,
                    friendName: request.toUserName,
                    friendEmail: request.toUserEmail,
                    status: 'accepted',
                    createdAt: now,
                    updatedAt: now,
                }
            );

            await databases.createDocument(
                DATABASE_ID,
                FRIENDS_COLLECTION_ID,
                ID.unique(),
                {
                    userId: request.toUserId,
                    friendId: request.fromUserId,
                    friendName: request.fromUserName,
                    friendEmail: request.fromUserEmail,
                    status: 'accepted',
                    createdAt: now,
                    updatedAt: now,
                }
            );

            // Update friend counts for both users
            await this.updateFriendCount(request.fromUserId);
            await this.updateFriendCount(request.toUserId);

            // Create activity records
            await this.createFriendActivity(request.fromUserId, request.toUserName, 'friend_added', request.toUserId);
            await this.createFriendActivity(request.toUserId, request.fromUserName, 'friend_added', request.fromUserId);

            return {
                id: friendship1.$id,
                userId: friendship1.userId,
                friendId: friendship1.friendId,
                friendName: friendship1.friendName,
                friendEmail: friendship1.friendEmail,
                status: friendship1.status as Friend['status'],
                createdAt: friendship1.createdAt,
                updatedAt: friendship1.updatedAt,
            };
        } catch (error) {
            console.error('Error accepting friend request:', error);
            throw error;
        }
    },

    // Decline a friend request
    async declineFriendRequest(requestId: string): Promise<void> {
        try {
            await databases.updateDocument(
                DATABASE_ID,
                FRIEND_REQUESTS_COLLECTION_ID,
                requestId,
                { status: 'declined' }
            );
        } catch (error) {
            console.error('Error declining friend request:', error);
            throw error;
        }
    },

    // Remove a friend
    async removeFriend(userId: string, friendId: string): Promise<void> {
        try {
            // Find and delete both friendship records
            const friendships = await databases.listDocuments(
                DATABASE_ID,
                FRIENDS_COLLECTION_ID,
                [
                    Query.or([
                        Query.and([
                            Query.equal('userId', userId),
                            Query.equal('friendId', friendId)
                        ]),
                        Query.and([
                            Query.equal('userId', friendId),
                            Query.equal('friendId', userId)
                        ])
                    ])
                ]
            );

            for (const friendship of friendships.documents) {
                await databases.deleteDocument(DATABASE_ID, FRIENDS_COLLECTION_ID, friendship.$id);
            }

            // Update friend counts
            await this.updateFriendCount(userId);
            await this.updateFriendCount(friendId);
        } catch (error) {
            console.error('Error removing friend:', error);
            throw error;
        }
    },

    // Search users by email or name
    async searchUsers(query: string, currentUserId: string): Promise<UserProfile[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                USER_PROFILES_COLLECTION_ID,
                [
                    Query.notEqual('$id', currentUserId), // Exclude current user
                    Query.or([
                        Query.startsWith('name', query),
                        Query.startsWith('email', query)
                    ]),
                    Query.limit(10)
                ]
            );

            return response.documents.map(doc => ({
                id: doc.$id,
                name: doc.name,
                email: doc.email,
                avatar: doc.avatar || undefined,
                bio: doc.bio || undefined,
                isOnline: doc.isOnline || false,
                lastSeen: doc.lastSeen || doc.updatedAt,
                friendsCount: doc.friendsCount || 0,
                memesCount: doc.memesCount || 0,
                createdAt: doc.createdAt,
            }));
        } catch (error) {
            console.error('Error searching users:', error);
            throw error;
        }
    },

    // Get user profile
    async getUserProfile(userId: string): Promise<UserProfile> {
        try {
            const response = await databases.getDocument(
                DATABASE_ID,
                USER_PROFILES_COLLECTION_ID,
                userId
            );

            return {
                id: response.$id,
                name: response.name,
                email: response.email,
                avatar: response.avatar || undefined,
                bio: response.bio || undefined,
                isOnline: response.isOnline || false,
                lastSeen: response.lastSeen || response.updatedAt,
                friendsCount: response.friendsCount || 0,
                memesCount: response.memesCount || 0,
                createdAt: response.createdAt,
            };
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw error;
        }
    },

    // Create or update user profile
    async createOrUpdateUserProfile(userId: string, name: string, email: string, avatar?: string, bio?: string): Promise<UserProfile> {
        try {

            if (!DATABASE_ID) {
                throw new Error('Missing required environment variable: VITE_APPWRITE_DATABASE_ID');
            }

            if (!USER_PROFILES_COLLECTION_ID) {
                throw new Error('Missing required environment variable: VITE_APPWRITE_USER_PROFILES_COLLECTION_ID');
            }

            // Check if profile exists
            try {
                await databases.getDocument(
                    DATABASE_ID,
                    USER_PROFILES_COLLECTION_ID,
                    userId
                );

                // Update existing profile
                const now = new Date().toISOString();
                const response = await databases.updateDocument(
                    DATABASE_ID,
                    USER_PROFILES_COLLECTION_ID,
                    userId,
                    {
                        name: name,
                        email: email,
                        avatar: avatar || null,
                        bio: bio || null,
                        lastSeen: now,
                        isOnline: true,
                        updatedAt: now,
                    }
                );

                return {
                    id: response.$id,
                    name: response.name,
                    email: response.email,
                    avatar: response.avatar || undefined,
                    bio: response.bio || undefined,
                    isOnline: response.isOnline || false,
                    lastSeen: response.lastSeen || response.updatedAt,
                    friendsCount: response.friendsCount || 0,
                    memesCount: response.memesCount || 0,
                    createdAt: response.createdAt,
                };
            } catch (error) {
                // Profile doesn't exist, create new one
                const now = new Date().toISOString();
                const response = await databases.createDocument(
                    DATABASE_ID,
                    USER_PROFILES_COLLECTION_ID,
                    userId, // Use userId as the document ID for consistency
                    {
                        name: name,
                        email: email,
                        avatar: avatar || null,
                        bio: bio || null,
                        isOnline: true,
                        lastSeen: now,
                        friendsCount: 0,
                        memesCount: 0,
                        createdAt: now,
                        updatedAt: now,
                    }
                );

                return {
                    id: response.$id,
                    name: response.name,
                    email: response.email,
                    avatar: response.avatar || undefined,
                    bio: response.bio || undefined,
                    isOnline: response.isOnline || false,
                    lastSeen: response.lastSeen || response.updatedAt,
                    friendsCount: response.friendsCount || 0,
                    memesCount: response.memesCount || 0,
                    createdAt: response.createdAt,
                };
            }
        } catch (error) {
            console.error('Error creating/updating user profile:', error);
            throw error;
        }
    },

    // Get friend activities
    async getFriendActivities(userId: string, limit: number = 20): Promise<FriendActivity[]> {
        try {
            // Get user's friends
            const friends = await this.getFriends(userId);
            const friendIds = friends.map(friend => friend.friendId);

            if (friendIds.length === 0) {
                return [];
            }

            const response = await databases.listDocuments(
                DATABASE_ID,
                FRIEND_ACTIVITIES_COLLECTION_ID,
                [
                    Query.equal('userId', friendIds),
                    Query.orderDesc('createdAt'),
                    Query.limit(limit)
                ]
            );

            return response.documents.map(doc => ({
                id: doc.$id,
                userId: doc.userId,
                userName: doc.userName,
                activityType: doc.activityType as FriendActivity['activityType'],
                targetId: doc.targetId || undefined,
                targetName: doc.targetName || undefined,
                createdAt: doc.createdAt,
            }));
        } catch (error) {
            console.error('Error fetching friend activities:', error);
            // Don't throw error for activities, just return empty array
            return [];
        }
    },

    // Create friend activity
    async createFriendActivity(userId: string, userName: string, activityType: FriendActivity['activityType'], targetId?: string, targetName?: string): Promise<void> {
        try {
            const now = new Date().toISOString();
            await databases.createDocument(
                DATABASE_ID,
                FRIEND_ACTIVITIES_COLLECTION_ID,
                ID.unique(),
                {
                    userId: userId,
                    userName: userName,
                    activityType: activityType,
                    targetId: targetId || null,
                    targetName: targetName || null,
                    createdAt: now,
                    updatedAt: now,
                }
            );
        } catch (error) {
            console.error('Error creating friend activity:', error);
            // Don't throw error for activity creation failures
        }
    },

    // Update friend count for a user
    async updateFriendCount(userId: string): Promise<void> {
        try {
            const friends = await this.getFriends(userId);
            const friendsCount = friends.length;

            await databases.updateDocument(
                DATABASE_ID,
                USER_PROFILES_COLLECTION_ID,
                userId,
                { friendsCount: friendsCount }
            );
        } catch (error) {
            console.error('Error updating friend count:', error);
            // Don't throw error for count update failures
        }
    },

    // Update meme count for a user
    async updateMemeCount(userId: string): Promise<void> {
        try {
            // Get all memes created by this user
            const memesResponse = await databases.listDocuments(
                DATABASE_ID,
                import.meta.env.VITE_APPWRITE_MEMES_COLLECTION_ID,
                [
                    Query.equal('authorId', userId),
                    Query.notEqual('isAnonymous', true) // Only count non-anonymous memes
                ]
            );

            const memesCount = memesResponse.documents.length;

            await databases.updateDocument(
                DATABASE_ID,
                USER_PROFILES_COLLECTION_ID,
                userId,
                { memesCount: memesCount }
            );
        } catch (error) {
            console.error('Error updating meme count:', error);
            // Don't throw error for count update failures
        }
    },

    // Check if two users are friends
    async areFriends(userId1: string, userId2: string): Promise<boolean> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                FRIENDS_COLLECTION_ID,
                [
                    Query.or([
                        Query.and([
                            Query.equal('userId', userId1),
                            Query.equal('friendId', userId2)
                        ]),
                        Query.and([
                            Query.equal('userId', userId2),
                            Query.equal('friendId', userId1)
                        ])
                    ]),
                    Query.equal('status', 'accepted')
                ]
            );

            return response.documents.length > 0;
        } catch (error) {
            console.error('Error checking friendship:', error);
            return false;
        }
    },

    // Refresh all counts for a user (useful for fixing existing data)
    async refreshUserCounts(userId: string): Promise<void> {
        try {
            await this.updateFriendCount(userId);
            await this.updateMemeCount(userId);
        } catch (error) {
            console.error('Error refreshing user counts:', error);
        }
    }
};

