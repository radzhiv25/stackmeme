import client from '../lib/appwrite';
import type { Comment, Reaction, CommentReaction } from '../types/Meme';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const MEMES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_MEMES_COLLECTION_ID;
const COMMENTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_COMMENTS_COLLECTION_ID;
const REACTIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_REACTIONS_COLLECTION_ID;
const COMMENT_REACTIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_COMMENT_REACTIONS_COLLECTION_ID;

export interface RealtimeCallbacks {
    onCommentAdded?: (comment: Comment) => void;
    onCommentUpdated?: (comment: Comment) => void;
    onCommentDeleted?: (commentId: string) => void;
    onReactionAdded?: (reaction: Reaction) => void;
    onCommentReactionAdded?: (reaction: CommentReaction) => void;
    onMemeUpdated?: (memeId: string) => void;
}

export class RealtimeService {
    private subscriptions: Map<string, () => void> = new Map();

    // Subscribe to all comment changes for a specific meme
    subscribeToComments(memeId: string, callbacks: RealtimeCallbacks) {
        const unsubscribe = client.subscribe(
            `databases.${DATABASE_ID}.collections.${COMMENTS_COLLECTION_ID}.documents`,
            (response) => {
                const { events, payload } = response;

                // Type assertion for payload
                const payloadData = payload as any;

                // Check if this comment belongs to the meme we're watching
                if (payloadData.memeId !== memeId) return;

                if (events.includes('databases.*.collections.*.documents.*.create')) {
                    // New comment added
                    const comment: Comment = {
                        id: payloadData.$id,
                        memeId: payloadData.memeId,
                        text: payloadData.text,
                        author: payloadData.author || 'Anonymous',
                        authorId: payloadData.authorId || undefined,
                        parentId: payloadData.parentId || undefined,
                        depth: payloadData.depth || 0,
                        likes: payloadData.likes || 0,
                        dislikes: payloadData.dislikes || 0,
                        repliesCount: payloadData.repliesCount || 0,
                        isAnonymous: payloadData.isAnonymous || true,
                        createdAt: payloadData.createdAt,
                        timestamp: payloadData.createdAt,
                        replies: []
                    };
                    callbacks.onCommentAdded?.(comment);
                }

                if (events.includes('databases.*.collections.*.documents.*.update')) {
                    // Comment updated (likes, replies count, etc.)
                    const comment: Comment = {
                        id: payloadData.$id,
                        memeId: payloadData.memeId,
                        text: payloadData.text,
                        author: payloadData.author || 'Anonymous',
                        authorId: payloadData.authorId || undefined,
                        parentId: payloadData.parentId || undefined,
                        depth: payloadData.depth || 0,
                        likes: payloadData.likes || 0,
                        dislikes: payloadData.dislikes || 0,
                        repliesCount: payloadData.repliesCount || 0,
                        isAnonymous: payloadData.isAnonymous || true,
                        createdAt: payloadData.createdAt,
                        timestamp: payloadData.createdAt,
                        replies: []
                    };
                    callbacks.onCommentUpdated?.(comment);
                }

                if (events.includes('databases.*.collections.*.documents.*.delete')) {
                    // Comment deleted
                    callbacks.onCommentDeleted?.(payloadData.$id);
                }
            }
        );

        this.subscriptions.set(`comments-${memeId}`, unsubscribe);
        return unsubscribe;
    }

    // Subscribe to meme reactions
    subscribeToMemeReactions(memeId: string, callbacks: RealtimeCallbacks) {
        const unsubscribe = client.subscribe(
            `databases.${DATABASE_ID}.collections.${REACTIONS_COLLECTION_ID}.documents`,
            (response) => {
                const { events, payload } = response;

                // Type assertion for payload
                const payloadData = payload as any;

                if (payloadData.memeId !== memeId) return;

                if (events.includes('databases.*.collections.*.documents.*.create')) {
                    const reaction: Reaction = {
                        id: payloadData.$id,
                        memeId: payloadData.memeId,
                        type: payloadData.type,
                        author: payloadData.author || 'Anonymous',
                        authorId: payloadData.authorId || undefined,
                        isAnonymous: payloadData.isAnonymous || true,
                        createdAt: payloadData.createdAt,
                        timestamp: payloadData.createdAt,
                    };
                    callbacks.onReactionAdded?.(reaction);
                }
            }
        );

        this.subscriptions.set(`reactions-${memeId}`, unsubscribe);
        return unsubscribe;
    }

    // Subscribe to comment reactions
    subscribeToCommentReactions(commentId: string, callbacks: RealtimeCallbacks) {
        const unsubscribe = client.subscribe(
            `databases.${DATABASE_ID}.collections.${COMMENT_REACTIONS_COLLECTION_ID}.documents`,
            (response) => {
                const { events, payload } = response;

                // Type assertion for payload
                const payloadData = payload as any;

                if (payloadData.commentId !== commentId) return;

                if (events.includes('databases.*.collections.*.documents.*.create')) {
                    const reaction: CommentReaction = {
                        id: payloadData.$id,
                        commentId: payloadData.commentId,
                        type: payloadData.type,
                        author: payloadData.author || 'Anonymous',
                        authorId: payloadData.authorId || undefined,
                        isAnonymous: payloadData.isAnonymous || true,
                        createdAt: payloadData.createdAt,
                        timestamp: payloadData.createdAt,
                    };
                    callbacks.onCommentReactionAdded?.(reaction);
                }
            }
        );

        this.subscriptions.set(`comment-reactions-${commentId}`, unsubscribe);
        return unsubscribe;
    }

    // Subscribe to meme updates (for like counts, etc.)
    subscribeToMemeUpdates(memeId: string, callbacks: RealtimeCallbacks) {
        const unsubscribe = client.subscribe(
            `databases.${DATABASE_ID}.collections.${MEMES_COLLECTION_ID}.documents`,
            (response) => {
                const { events, payload } = response;

                // Type assertion for payload
                const payloadData = payload as any;

                if (payloadData.$id !== memeId) return;

                if (events.includes('databases.*.collections.*.documents.*.update')) {
                    callbacks.onMemeUpdated?.(payloadData.$id);
                }
            }
        );

        this.subscriptions.set(`meme-${memeId}`, unsubscribe);
        return unsubscribe;
    }

    // Unsubscribe from a specific subscription
    unsubscribe(key: string) {
        const unsubscribe = this.subscriptions.get(key);
        if (unsubscribe) {
            unsubscribe();
            this.subscriptions.delete(key);
        }
    }

    // Unsubscribe from all subscriptions
    unsubscribeAll() {
        this.subscriptions.forEach((unsubscribe) => unsubscribe());
        this.subscriptions.clear();
    }
}

// Export a singleton instance
export const realtimeService = new RealtimeService();
