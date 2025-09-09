import React, { useEffect, useState } from 'react';
import type { Meme, Reaction, UploadMemeData } from '../types/Meme';
import { MemeContext } from './MemeContextDefinition';
import { memeService, commentService, reactionService, storageService } from '../services/appwriteService';

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
    const [memes, setMemes] = useState<Meme[]>([]);
    const [loading, setLoading] = useState(true);

    // Load memes from Appwrite on mount
    useEffect(() => {
        loadMemes();
    }, []);

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
            const memesData = await memeService.getMemes(20, 0, anonymousOnly);

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
            // Upload image to Appwrite Storage
            const { fileId, url } = await storageService.uploadImage(data.image);

            // Create meme in database
            const newMeme = await memeService.createMeme(data, fileId, url);

            // Add to local state
            setMemes(prev => [newMeme, ...prev]);
        } catch (error) {
            console.error('Error adding meme:', error);
            throw error;
        }
    };

    const likeMeme = async (memeId: string) => {
        try {
            await memeService.likeMeme(memeId);
            setMemes(prev => prev.map(meme =>
                meme.id === memeId
                    ? { ...meme, likes: meme.likes + 1 }
                    : meme
            ));
        } catch (error) {
            console.error('Error liking meme:', error);
            throw error;
        }
    };

    const addComment = async (memeId: string, commentText: string) => {
        try {
            const newComment = await commentService.createComment(memeId, commentText);

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
            const newReaction = await reactionService.createReaction(memeId, reactionType);

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
