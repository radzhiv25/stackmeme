import { databases, storage, ID, Query } from '../lib/appwrite';
import type { Meme, Comment, Reaction, CommentReaction, UploadMemeData } from '../types/Meme';
import { getUserId } from '../utils/deviceFingerprint';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const MEMES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_MEMES_COLLECTION_ID;
const COMMENTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_COMMENTS_COLLECTION_ID;
const REACTIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_REACTIONS_COLLECTION_ID;
const COMMENT_REACTIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_COMMENT_REACTIONS_COLLECTION_ID;
const STORAGE_BUCKET_ID = import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID;

// Meme Services
export const memeService = {
    // Get all memes with pagination
    async getMemes(limit: number = 20, offset: number = 0, anonymousOnly: boolean = false): Promise<Meme[]> {
        try {
            const queries = [
                Query.orderDesc('createdAt'),
                Query.limit(limit),
                Query.offset(offset)
            ];

            // Filter for anonymous memes only if requested
            if (anonymousOnly) {
                queries.push(Query.equal('isAnonymous', true));
            }

            const response = await databases.listDocuments(
                DATABASE_ID,
                MEMES_COLLECTION_ID,
                queries
            );

            return response.documents.map(doc => ({
                id: doc.$id,
                imageUrl: doc.imageUrl,
                caption: doc.caption || undefined,
                uploadDate: doc.createdAt,
                createdAt: doc.createdAt, // Add createdAt field
                likes: doc.likes || 0,
                dislikes: doc.dislikes || 0, // Add dislikes field
                comments: [], // Will be loaded separately
                reactions: [], // Will be loaded separately
                author: doc.author || 'Anonymous',
                authorId: doc.authorId || undefined,
                isAnonymous: doc.isAnonymous || true,
            }));
        } catch (error) {
            console.error('Error fetching memes:', error);
            throw error;
        }
    },

    // Create a new meme
    async createMeme(data: UploadMemeData, imageFileId: string, imageUrl: string): Promise<Meme> {
        try {
            const response = await databases.createDocument(
                DATABASE_ID,
                MEMES_COLLECTION_ID,
                ID.unique(),
                {
                    imageId: imageFileId,
                    imageUrl: imageUrl,
                    caption: data.caption || '',
                    author: data.author || 'Anonymous',
                    authorId: null, // Will be set if user is authenticated
                    likes: 0,
                    dislikes: 0, // Add dislikes field
                    commentsCount: 0,
                    reactionsCount: 0,
                    isAnonymous: data.isAnonymous ?? true, // Use provided value or default to true
                }
            );

            return {
                id: response.$id,
                imageUrl: response.imageUrl,
                caption: response.caption || undefined,
                uploadDate: response.createdAt,
                createdAt: response.createdAt, // Add createdAt field
                likes: response.likes || 0,
                dislikes: response.dislikes || 0, // Add dislikes field
                comments: [],
                reactions: [],
                author: response.author || 'Anonymous',
                authorId: response.authorId || undefined,
                isAnonymous: response.isAnonymous || true,
            };
        } catch (error) {
            console.error('Error creating meme:', error);
            throw error;
        }
    },

    // Like a meme
    async likeMeme(memeId: string): Promise<void> {
        try {
            // Get current meme
            const meme = await databases.getDocument(DATABASE_ID, MEMES_COLLECTION_ID, memeId);

            // Update likes count
            await databases.updateDocument(
                DATABASE_ID,
                MEMES_COLLECTION_ID,
                memeId,
                {
                    likes: (meme.likes || 0) + 1
                }
            );
        } catch (error) {
            console.error('Error liking meme:', error);
            throw error;
        }
    },

    // Delete a meme
    async deleteMeme(memeId: string): Promise<void> {
        try {
            await databases.deleteDocument(DATABASE_ID, MEMES_COLLECTION_ID, memeId);
        } catch (error) {
            console.error('Error deleting meme:', error);
            throw error;
        }
    }
};

// Comment Services
export const commentService = {
    // Get comments for a meme
    async getComments(memeId: string): Promise<Comment[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COMMENTS_COLLECTION_ID,
                [
                    Query.equal('memeId', memeId),
                    Query.orderAsc('createdAt')
                ]
            );

            return response.documents.map(doc => ({
                id: doc.$id,
                memeId: doc.memeId,
                text: doc.text,
                author: doc.author || 'Anonymous',
                authorId: doc.authorId || undefined,
                parentId: doc.parentId || undefined,
                depth: doc.depth || 0,
                likes: doc.likes || 0,
                dislikes: doc.dislikes || 0, // Add dislikes field
                repliesCount: doc.repliesCount || 0,
                timestamp: doc.createdAt,
                createdAt: doc.createdAt, // Add createdAt field
                isAnonymous: doc.isAnonymous || true,
            }));
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw error;
        }
    },

    // Create a comment
    async createComment(memeId: string, text: string, parentId?: string): Promise<Comment> {
        try {
            // Calculate depth based on parent
            let depth = 0;
            if (parentId) {
                const parentComment = await databases.getDocument(DATABASE_ID, COMMENTS_COLLECTION_ID, parentId);
                depth = (parentComment.depth || 0) + 1;
            }

            const response = await databases.createDocument(
                DATABASE_ID,
                COMMENTS_COLLECTION_ID,
                ID.unique(),
                {
                    memeId: memeId,
                    text: text,
                    author: 'Anonymous', // Will be updated if user is authenticated
                    authorId: null,
                    parentId: parentId || null,
                    depth: depth,
                    likes: 0,
                    dislikes: 0, // Add dislikes field
                    repliesCount: 0,
                    isAnonymous: true,
                }
            );

            // Update comment count on meme
            const meme = await databases.getDocument(DATABASE_ID, MEMES_COLLECTION_ID, memeId);
            await databases.updateDocument(
                DATABASE_ID,
                MEMES_COLLECTION_ID,
                memeId,
                {
                    commentsCount: (meme.commentsCount || 0) + 1
                }
            );

            // Update parent comment's replies count if this is a reply
            if (parentId) {
                const parentComment = await databases.getDocument(DATABASE_ID, COMMENTS_COLLECTION_ID, parentId);
                await databases.updateDocument(
                    DATABASE_ID,
                    COMMENTS_COLLECTION_ID,
                    parentId,
                    {
                        repliesCount: (parentComment.repliesCount || 0) + 1
                    }
                );
            }

            return {
                id: response.$id,
                memeId: response.memeId,
                text: response.text,
                author: response.author || 'Anonymous',
                authorId: response.authorId || undefined,
                parentId: response.parentId || undefined,
                depth: response.depth || 0,
                likes: response.likes || 0,
                dislikes: response.dislikes || 0, // Add dislikes field
                repliesCount: response.repliesCount || 0,
                timestamp: response.createdAt,
                createdAt: response.createdAt, // Add createdAt field
                isAnonymous: response.isAnonymous || true,
            };
        } catch (error) {
            console.error('Error creating comment:', error);
            throw error;
        }
    },

    // Get a single comment by ID
    async getComment(commentId: string): Promise<Comment> {
        try {
            const response = await databases.getDocument(DATABASE_ID, COMMENTS_COLLECTION_ID, commentId);

            return {
                id: response.$id,
                memeId: response.memeId,
                text: response.text,
                author: response.author || 'Anonymous',
                authorId: response.authorId || undefined,
                parentId: response.parentId || undefined,
                depth: response.depth || 0,
                likes: response.likes || 0,
                dislikes: response.dislikes || 0,
                repliesCount: response.repliesCount || 0,
                timestamp: response.createdAt,
                createdAt: response.createdAt,
                isAnonymous: response.isAnonymous || true,
            };
        } catch (error) {
            console.error('Error fetching comment:', error);
            throw error;
        }
    },

    // Get threaded comments (organized in a tree structure)
    async getThreadedComments(memeId: string): Promise<Comment[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COMMENTS_COLLECTION_ID,
                [
                    Query.equal('memeId', memeId),
                    Query.orderAsc('createdAt')
                ]
            );

            const comments = response.documents.map(doc => ({
                id: doc.$id,
                memeId: doc.memeId,
                text: doc.text,
                author: doc.author || 'Anonymous',
                authorId: doc.authorId || undefined,
                parentId: doc.parentId || undefined,
                depth: doc.depth || 0,
                likes: doc.likes || 0,
                dislikes: doc.dislikes || 0, // Add dislikes field
                repliesCount: doc.repliesCount || 0,
                timestamp: doc.createdAt,
                createdAt: doc.createdAt, // Add createdAt field
                isAnonymous: doc.isAnonymous || true,
                replies: [] as Comment[]
            }));

            // Build the tree structure
            const commentMap = new Map<string, Comment>();
            const rootComments: Comment[] = [];

            // First pass: create map and identify root comments
            comments.forEach(comment => {
                commentMap.set(comment.id, comment);
                if (!comment.parentId) {
                    rootComments.push(comment);
                }
            });

            // Second pass: build the tree
            comments.forEach(comment => {
                if (comment.parentId && commentMap.has(comment.parentId)) {
                    const parent = commentMap.get(comment.parentId)!;
                    if (!parent.replies) {
                        parent.replies = [];
                    }
                    parent.replies.push(comment);
                }
            });

            return rootComments;
        } catch (error) {
            console.error('Error fetching threaded comments:', error);
            throw error;
        }
    },

    // Like a comment
    async likeComment(commentId: string): Promise<void> {
        try {
            const comment = await databases.getDocument(DATABASE_ID, COMMENTS_COLLECTION_ID, commentId);

            await databases.updateDocument(
                DATABASE_ID,
                COMMENTS_COLLECTION_ID,
                commentId,
                {
                    likes: (comment.likes || 0) + 1
                }
            );
        } catch (error) {
            console.error('Error liking comment:', error);
            throw error;
        }
    },

    // Delete a comment
    async deleteComment(commentId: string): Promise<void> {
        try {
            // Get the comment to check if it has replies
            const comment = await databases.getDocument(DATABASE_ID, COMMENTS_COLLECTION_ID, commentId);

            // If it has replies, we might want to handle this differently
            // For now, we'll just delete it and let the parent's repliesCount be updated
            await databases.deleteDocument(DATABASE_ID, COMMENTS_COLLECTION_ID, commentId);

            // Update parent comment's replies count if this was a reply
            if (comment.parentId) {
                try {
                    const parentComment = await databases.getDocument(DATABASE_ID, COMMENTS_COLLECTION_ID, comment.parentId);
                    await databases.updateDocument(
                        DATABASE_ID,
                        COMMENTS_COLLECTION_ID,
                        comment.parentId,
                        {
                            repliesCount: Math.max((parentComment.repliesCount || 0) - 1, 0)
                        }
                    );
                } catch (parentError) {
                    console.warn('Could not update parent comment replies count:', parentError);
                }
            }

            // Update meme's comment count
            try {
                const meme = await databases.getDocument(DATABASE_ID, MEMES_COLLECTION_ID, comment.memeId);
                await databases.updateDocument(
                    DATABASE_ID,
                    MEMES_COLLECTION_ID,
                    comment.memeId,
                    {
                        commentsCount: Math.max((meme.commentsCount || 0) - 1, 0)
                    }
                );
            } catch (memeError) {
                console.warn('Could not update meme comment count:', memeError);
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw error;
        }
    }
};

// Reaction Services
export const reactionService = {
    // Get reactions for a meme
    async getReactions(memeId: string): Promise<Reaction[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                REACTIONS_COLLECTION_ID,
                [
                    Query.equal('memeId', memeId)
                ]
            );

            return response.documents.map(doc => ({
                id: doc.$id,
                memeId: doc.memeId,
                type: doc.type as Reaction['type'],
                author: doc.author || 'Anonymous',
                authorId: doc.authorId || undefined,
                timestamp: doc.createdAt,
                createdAt: doc.createdAt,
                isAnonymous: doc.isAnonymous || true,
            }));
        } catch (error) {
            console.error('Error fetching reactions:', error);
            throw error;
        }
    },

    // Create a reaction
    async createReaction(memeId: string, type: Reaction['type']): Promise<Reaction> {
        try {
            const response = await databases.createDocument(
                DATABASE_ID,
                REACTIONS_COLLECTION_ID,
                ID.unique(),
                {
                    memeId: memeId,
                    type: type,
                    author: 'Anonymous', // Will be updated if user is authenticated
                    authorId: null,
                    isAnonymous: true,
                }
            );

            // Update reaction count on meme
            const meme = await databases.getDocument(DATABASE_ID, MEMES_COLLECTION_ID, memeId);
            await databases.updateDocument(
                DATABASE_ID,
                MEMES_COLLECTION_ID,
                memeId,
                {
                    reactionsCount: (meme.reactionsCount || 0) + 1
                }
            );

            return {
                id: response.$id,
                memeId: response.memeId,
                type: response.type as Reaction['type'],
                author: response.author || 'Anonymous',
                authorId: response.authorId || undefined,
                timestamp: response.createdAt,
                createdAt: response.createdAt,
                isAnonymous: response.isAnonymous || true,
            };
        } catch (error) {
            console.error('Error creating reaction:', error);
            throw error;
        }
    }
};

// Storage Services
export const storageService = {
    // Upload image to Appwrite Storage
    async uploadImage(file: File): Promise<{ fileId: string; url: string }> {
        try {
            const response = await storage.createFile(
                STORAGE_BUCKET_ID,
                ID.unique(),
                file
            );

            // Get the file URL
            const url = `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${STORAGE_BUCKET_ID}/files/${response.$id}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`;

            return {
                fileId: response.$id,
                url: url
            };
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    },

    // Delete image from storage
    async deleteImage(fileId: string): Promise<void> {
        try {
            await storage.deleteFile(STORAGE_BUCKET_ID, fileId);
        } catch (error) {
            console.error('Error deleting image:', error);
            throw error;
        }
    }
};

// Comment Reaction Services
export const commentReactionService = {
    // Get reactions for a comment
    async getCommentReactions(commentId: string): Promise<CommentReaction[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COMMENT_REACTIONS_COLLECTION_ID,
                [
                    Query.equal('commentId', commentId)
                ]
            );

            return response.documents.map(doc => ({
                id: doc.$id,
                commentId: doc.commentId,
                type: doc.type as CommentReaction['type'],
                author: doc.author || 'Anonymous',
                authorId: doc.authorId || undefined,
                timestamp: doc.createdAt,
                createdAt: doc.createdAt,
                isAnonymous: doc.isAnonymous || true,
            }));
        } catch (error) {
            console.error('Error fetching comment reactions:', error);
            throw error;
        }
    },

    // Create a comment reaction
    async createCommentReaction(commentId: string, type: CommentReaction['type']): Promise<CommentReaction> {
        try {
            const userId = getUserId();
            console.log(`User ${userId} reacting to comment ${commentId} with ${type}`);

            // First, get current counts for this comment
            const comment = await databases.getDocument(DATABASE_ID, COMMENTS_COLLECTION_ID, commentId);
            const currentLikes = comment.likes || 0;
            const currentDislikes = comment.dislikes || 0;

            // Check if user already has a reaction for this comment
            const existingReactions = await databases.listDocuments(
                DATABASE_ID,
                COMMENT_REACTIONS_COLLECTION_ID,
                [
                    Query.equal('commentId', commentId),
                    Query.equal('authorId', userId || 'anonymous')
                ]
            );

            let newLikes = currentLikes;
            let newDislikes = currentDislikes;
            let shouldCreateReaction = true;

            if (existingReactions.documents.length > 0) {
                // User already has a reaction, handle toggle logic
                const existingReaction = existingReactions.documents[0];
                const existingType = existingReaction.type;

                if (existingType === type) {
                    // User is clicking the same reaction type, remove it
                    shouldCreateReaction = false;
                    if (type === 'like') {
                        newLikes = Math.max(0, currentLikes - 1);
                    } else if (type === 'dislike') {
                        newDislikes = Math.max(0, currentDislikes - 1);
                    }
                    // Delete the existing reaction
                    await databases.deleteDocument(DATABASE_ID, COMMENT_REACTIONS_COLLECTION_ID, existingReaction.$id);
                } else {
                    // User is switching reaction types, update the existing reaction
                    if (type === 'like') {
                        newLikes = currentLikes + 1;
                        newDislikes = Math.max(0, currentDislikes - 1);
                    } else if (type === 'dislike') {
                        newDislikes = currentDislikes + 1;
                        newLikes = Math.max(0, currentLikes - 1);
                    }
                    // Update the existing reaction
                    await databases.updateDocument(
                        DATABASE_ID,
                        COMMENT_REACTIONS_COLLECTION_ID,
                        existingReaction.$id,
                        { type: type }
                    );
                }
            } else {
                // User doesn't have a reaction yet, add new one
                if (type === 'like') {
                    newLikes = currentLikes + 1;
                } else if (type === 'dislike') {
                    newDislikes = currentDislikes + 1;
                }
            }

            console.log(`New counts for comment ${commentId}: likes=${newLikes}, dislikes=${newDislikes}`);

            // Create new reaction if needed
            let response;
            if (shouldCreateReaction) {
                response = await databases.createDocument(
                    DATABASE_ID,
                    COMMENT_REACTIONS_COLLECTION_ID,
                    ID.unique(),
                    {
                        commentId: commentId,
                        type: type,
                        author: 'Anonymous',
                        authorId: userId,
                        isAnonymous: true,
                    }
                );
            } else {
                // Return a mock response for deletion case
                response = {
                    $id: 'deleted',
                    commentId: commentId,
                    type: type,
                    author: 'Anonymous',
                    authorId: userId,
                    createdAt: new Date().toISOString(),
                    isAnonymous: true,
                };
            }

            // Update the comment with new counts
            await databases.updateDocument(
                DATABASE_ID,
                COMMENTS_COLLECTION_ID,
                commentId,
                {
                    likes: newLikes,
                    dislikes: newDislikes,
                }
            );

            console.log(`Updated comment ${commentId} with likes=${newLikes}, dislikes=${newDislikes}`);

            return {
                id: response.$id,
                commentId: response.commentId,
                type: response.type as CommentReaction['type'],
                author: response.author || 'Anonymous',
                authorId: response.authorId || undefined,
                timestamp: response.createdAt,
                createdAt: response.createdAt,
                isAnonymous: response.isAnonymous || true,
            };
        } catch (error) {
            console.error('Error creating comment reaction:', error);
            throw error;
        }
    },

    // Delete a comment reaction
    async deleteCommentReaction(reactionId: string): Promise<void> {
        try {
            await databases.deleteDocument(
                DATABASE_ID,
                COMMENT_REACTIONS_COLLECTION_ID,
                reactionId
            );
        } catch (error) {
            console.error('Error deleting comment reaction:', error);
            throw error;
        }
    }
};

// Meme Reaction Services
export const memeReactionService = {
    // Create a meme reaction (like or dislike)
    async createMemeReaction(memeId: string, type: 'like' | 'dislike'): Promise<void> {
        try {
            // First, get current counts for this meme
            const meme = await databases.getDocument(DATABASE_ID, MEMES_COLLECTION_ID, memeId);
            const currentLikes = meme.likes || 0;
            const currentDislikes = meme.dislikes || 0;

            console.log(`Current counts for meme ${memeId}: likes=${currentLikes}, dislikes=${currentDislikes}`);

            // Calculate new counts based on reaction type (additive logic)
            let newLikes = currentLikes;
            let newDislikes = currentDislikes;

            if (type === 'like') {
                newLikes = currentLikes + 1;
                // Keep existing dislikes unchanged
            } else if (type === 'dislike') {
                newDislikes = currentDislikes + 1;
                // Keep existing likes unchanged
            }

            console.log(`New counts for meme ${memeId}: likes=${newLikes}, dislikes=${newDislikes}`);

            // Create the reaction
            await databases.createDocument(
                DATABASE_ID,
                REACTIONS_COLLECTION_ID,
                ID.unique(),
                {
                    memeId: memeId,
                    type: type,
                    author: 'Anonymous', // Will be updated if user is authenticated
                    isAnonymous: true,
                }
            );

            // Update the meme with new counts
            await databases.updateDocument(
                DATABASE_ID,
                MEMES_COLLECTION_ID,
                memeId,
                {
                    likes: newLikes,
                    dislikes: newDislikes,
                }
            );

            console.log(`Updated meme ${memeId} with likes=${newLikes}, dislikes=${newDislikes}`);
        } catch (error) {
            console.error('Error creating meme reaction:', error);
            throw error;
        }
    },

    // Get meme reactions
    async getMemeReactions(memeId: string): Promise<Reaction[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                REACTIONS_COLLECTION_ID,
                [
                    Query.equal('memeId', memeId)
                ]
            );

            return response.documents.map(doc => ({
                id: doc.$id,
                memeId: doc.memeId,
                type: doc.type as Reaction['type'],
                author: doc.author || 'Anonymous',
                authorId: doc.authorId || undefined,
                isAnonymous: doc.isAnonymous || true,
                timestamp: doc.createdAt,
                createdAt: doc.createdAt,
            }));
        } catch (error) {
            console.error('Error fetching meme reactions:', error);
            throw error;
        }
    }
};
