import React, { useEffect, useState } from 'react';
import type { Meme, Reaction, UploadMemeData } from '../types/Meme';
import { MemeContext } from './MemeContextDefinition';
import { memeService, commentService, reactionService, storageService } from '../services/appwriteService';
import { friendService } from '../services/friendService';
import { useAuth } from '../hooks/useAuth';
import { anonymousLikeStorage } from '../utils/anonymousLikeStorage';

// Import the context type
interface MemeContextType {
    memes: Meme[];
    addMeme: (data: UploadMemeData) => void;
    likeMeme: (memeId: string) => void;
    addComment: (memeId: string, comment: string) => void;
    addReaction: (memeId: string, reactionType: Reaction['type']) => void;
    loading: boolean;
}



interface MemeProviderProps {
    children: React.ReactNode;
    anonymousOnly?: boolean; // Whether to show only anonymous memes
}

export const MemeProvider: React.FC<MemeProviderProps> = ({ children, anonymousOnly = false }) => {
    const { user, friends, userProfile, loadUserProfile } = useAuth();
    const [memes, setMemes] = useState<Meme[]>([]);
    const [loading, setLoading] = useState(true);

    // Load memes from Appwrite on mount and when friends change
    useEffect(() => {
        loadMemes();
    }, [user, friends]);

    // Set up real-time subscriptions for all memes (temporarily disabled to prevent reload issues)
    // useEffect(() => {
    //     const subscriptions: (() => void)[] = [];

    //     // Subscribe to meme updates
    //     memes.forEach(meme => {
    //         const unsubscribe = realtimeService.subscribeToMemeUpdates(meme.id, {
    //             onMemeUpdated: (memeId) => {
    //                 // Reload the specific meme when it's updated
    //                 loadMemes();
    //             }
    //         });
    //         subscriptions.push(unsubscribe);
    //     });

    //     // Cleanup subscriptions
    //     return () => {
    //         subscriptions.forEach(unsubscribe => unsubscribe());
    //     };
    // }, [memes]);

    const loadMemes = async () => {
        try {
            setLoading(true);

            // Update existing memes with avatars (migration)
            try {
                await memeService.updateMemesWithAvatars();
            } catch (error) {
                console.error('Error updating memes with avatars:', error);
                // Don't fail the entire load for migration errors
            }

            // Get friend IDs for filtering
            const friendIds = friends?.map((friend: any) => friend.friendId) || [];
            const userId = user?.$id;

            const memesData = await memeService.getMemes(20, 0, anonymousOnly, userId, friendIds);

            // Load comments and reactions for each meme
            const memesWithData = await Promise.all(
                memesData.map(async (meme) => {
                    try {
                        const [comments, reactions] = await Promise.all([
                            commentService.getComments(meme.id),
                            reactionService.getReactions(meme.id)
                        ]);

                        return {
                            ...meme,
                            comments,
                            reactions
                        };
                    } catch (error) {
                        console.error(`Error loading data for meme ${meme.id}:`, error);
                        return meme;
                    }
                })
            );

            setMemes(memesWithData);
        } catch (error) {
            console.error('Error loading memes from Appwrite:', error);
            // Fallback to empty array if Appwrite fails
            setMemes([]);
        } finally {
            setLoading(false);
        }
    };

    const addMeme = async (data: UploadMemeData) => {
        try {
            // Upload image to Appwrite Storage (use uploadMeme for better validation)
            const { fileId, url } = await storageService.uploadMeme(data.image);

            // Create meme in database with user info if authenticated
            const memeData = {
                ...data,
                author: userProfile?.name || user?.name || user?.email || 'Anonymous',
                authorId: user?.$id || undefined,
                authorAvatar: userProfile?.avatar || undefined,
                isAnonymous: !user,
            };

            const newMeme = await memeService.createMeme(memeData, fileId, url);

            // Update user's meme count if user is authenticated
            if (user) {
                try {
                    await friendService.updateMemeCount(user.$id);
                    // Refresh user profile to get updated counts
                    await loadUserProfile();
                } catch (countError) {
                    console.error('Error updating meme count:', countError);
                    // Don't throw error for count update failure
                }
            }

            // Add to local state
            setMemes(prev => [newMeme, ...prev]);
        } catch (error) {
            console.error('Error adding meme:', error);
            throw error;
        }
    };

    const likeMeme = async (memeId: string) => {
        try {
            let result;

            if (user?.$id) {
                // Authenticated user
                result = await memeService.likeMeme(memeId, user.$id);
            } else {
                // Anonymous user - use localStorage tracking
                const anonymousData = anonymousLikeStorage.toggleLike(memeId);
                result = await memeService.likeMeme(memeId, undefined, anonymousData);
            }

            setMemes(prev => prev.map(meme => {
                if (meme.id === memeId) {
                    if (user?.$id) {
                        // Authenticated user - update userLikes array
                        const newUserLikes = result.liked
                            ? [...(meme.userLikes || []), user.$id].filter(Boolean)
                            : (meme.userLikes || []).filter(id => id !== user.$id);

                        return {
                            ...meme,
                            likes: result.newLikeCount,
                            userLikes: newUserLikes
                        };
                    } else {
                        // Anonymous user - just update like count
                        return {
                            ...meme,
                            likes: result.newLikeCount
                        };
                    }
                }
                return meme;
            }));
        } catch (error) {
            console.error('Error liking meme:', error);
            throw error;
        }
    };

    const addComment = async (memeId: string, commentText: string) => {
        try {
            const newComment = await commentService.createComment(
                memeId,
                commentText,
                undefined, // parentId
                userProfile?.name || user?.name || user?.email || 'Anonymous', // author
                user?.$id || undefined, // authorId
                !user // isAnonymous
            );

            setMemes(prev => prev.map(meme =>
                meme.id === memeId
                    ? { ...meme, comments: [...meme.comments, newComment] }
                    : meme
            ));
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    };

    const addReaction = async (memeId: string, reactionType: Reaction['type']) => {
        try {
            const newReaction = await reactionService.createReaction(
                memeId,
                reactionType,
                userProfile?.name || user?.name || user?.email || 'Anonymous',
                user?.$id
            );

            setMemes(prev => prev.map(meme =>
                meme.id === memeId
                    ? { ...meme, reactions: [...meme.reactions, newReaction] }
                    : meme
            ));
        } catch (error) {
            console.error('Error adding reaction:', error);
            throw error;
        }
    };

    const value: MemeContextType = {
        memes,
        addMeme,
        likeMeme,
        addComment,
        addReaction,
        loading,
    };

    return <MemeContext.Provider value={value}>{children}</MemeContext.Provider>;
};
