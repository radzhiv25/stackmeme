import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { MessageCircle, Send } from 'lucide-react';
import type { Comment, CommentReaction } from '../types/Meme';
import { commentService, commentReactionService } from '../services/appwriteService';
import { CommentItem } from './CommentItem';
import { useAuth } from '../hooks/useAuth';

interface CommentThreadProps {
    memeId: string;
    initialComments?: Comment[];
}

export const CommentThread: React.FC<CommentThreadProps> = ({
    memeId,
    initialComments = []
}) => {
    const { user, userProfile } = useAuth();
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Load comments when component mounts
    useEffect(() => {
        loadComments();
    }, [memeId]);

    // Set up real-time subscriptions (temporarily disabled to prevent reload issues)
    // useEffect(() => {
    //     const unsubscribeComments = realtimeService.subscribeToComments(memeId, {
    //         onCommentAdded: (newComment) => {
    //             setComments(prev => {
    //                 // If it's a reply, add it to the parent comment
    //                 if (newComment.parentId) {
    //                     const addToParent = (comments: Comment[]): Comment[] => {
    //                         return comments.map(comment => {
    //                             if (comment.id === newComment.parentId) {
    //                                 return {
    //                                     ...comment,
    //                                     replies: [...(comment.replies || []), newComment],
    //                                     repliesCount: comment.repliesCount + 1
    //                                 };
    //                             }
    //                             if (comment.replies) {
    //                                 return {
    //                                     ...comment,
    //                                     replies: addToParent(comment.replies)
    //                                 };
    //                             }
    //                             return comment;
    //                         });
    //                     };
    //                     return addToParent(prev);
    //                 } else {
    //                     // It's a top-level comment
    //                     return [...prev, newComment];
    //                 }
    //             });
    //         },
    //         onCommentUpdated: (updatedComment) => {
    //             setComments(prev => {
    //                 const updateComment = (comments: Comment[]): Comment[] => {
    //                     return comments.map(comment => {
    //                         if (comment.id === updatedComment.id) {
    //                             return { ...comment, ...updatedComment };
    //                         }
    //                         if (comment.replies) {
    //                             return {
    //                                 ...comment,
    //                                 replies: updateComment(comment.replies)
    //                             };
    //                         }
    //                         return comment;
    //                     });
    //                 };
    //                 return updateComment(prev);
    //             });
    //         },
    //         onCommentDeleted: (deletedCommentId) => {
    //             setComments(prev => {
    //                 const removeComment = (comments: Comment[]): Comment[] => {
    //                     return comments.filter(comment => {
    //                         if (comment.id === deletedCommentId) {
    //                             return false;
    //                         }
    //                         if (comment.replies) {
    //                             return {
    //                                 ...comment,
    //                                 replies: removeComment(comment.replies)
    //                             };
    //                         }
    //                         return true;
    //                     }).map(comment => {
    //                         if (comment.replies) {
    //                             return {
    //                                 ...comment,
    //                                 replies: removeComment(comment.replies)
    //                             };
    //                         }
    //                         return comment;
    //                     });
    //                 };
    //                 return removeComment(prev);
    //             });
    //         }
    //     });

    //     // Cleanup subscriptions on unmount
    //     return () => {
    //         unsubscribeComments();
    //     };
    // }, [memeId]);

    const loadComments = async () => {
        setIsLoading(true);
        try {
            const threadedComments = await commentService.getThreadedComments(memeId);
            setComments(threadedComments);
        } catch (error) {
            console.error('Error loading comments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitComment = async () => {
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {

            const comment = await commentService.createComment(
                memeId,
                newComment,
                undefined, // parentId
                userProfile?.name || user?.name || user?.email || 'Anonymous', // author
                user?.$id || undefined, // authorId
                !user // isAnonymous
            );
            setComments(prev => {
                // Check if comment already exists to prevent duplicates
                const existingComment = prev.find(c => c.id === comment.id);
                if (existingComment) {
                    return prev;
                }
                return [...prev, comment];
            });
            setNewComment('');
        } catch (error) {
            console.error('Error creating comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReply = async (parentId: string, text: string) => {
        try {
            const reply = await commentService.createComment(
                memeId,
                text,
                parentId,
                userProfile?.name || user?.name || user?.email || 'Anonymous', // author
                user?.$id || undefined, // authorId
                !user // isAnonymous
            );

            // Update the comments state to include the new reply
            setComments(prev => {
                const updateComments = (comments: Comment[]): Comment[] => {
                    return comments.map(comment => {
                        if (comment.id === parentId) {
                            // Check if reply already exists to prevent duplicates
                            const existingReply = comment.replies?.find(r => r.id === reply.id);
                            if (existingReply) {
                                return comment;
                            }
                            return {
                                ...comment,
                                replies: [...(comment.replies || []), reply],
                                repliesCount: comment.repliesCount + 1
                            };
                        }
                        if (comment.replies) {
                            return {
                                ...comment,
                                replies: updateComments(comment.replies)
                            };
                        }
                        return comment;
                    });
                };
                return updateComments(prev);
            });
        } catch (error) {
            console.error('Error creating reply:', error);
            throw error;
        }
    };

    const handleReaction = async (commentId: string, type: CommentReaction['type']) => {
        try {
            await commentReactionService.createCommentReaction(
                commentId,
                type,
                userProfile?.name || user?.name || user?.email || 'Anonymous',
                user?.$id
            );

            // Reload the specific comment to get updated counts from server
            const updatedComment = await commentService.getComment(commentId);

            // Update the comment in the UI with the server data
            setComments(prev => {
                const updateComments = (comments: Comment[]): Comment[] => {
                    return comments.map(comment => {
                        if (comment.id === commentId) {
                            return {
                                ...comment,
                                likes: updatedComment.likes,
                                dislikes: updatedComment.dislikes
                            };
                        }
                        if (comment.replies) {
                            return {
                                ...comment,
                                replies: updateComments(comment.replies)
                            };
                        }
                        return comment;
                    });
                };
                return updateComments(prev);
            });
        } catch (error) {
            console.error('Error creating comment reaction:', error);
            throw error;
        }
    };

    const handleDelete = async (commentId: string) => {
        try {
            await commentService.deleteComment(commentId);

            // Remove the comment from the state
            setComments(prev => {
                const removeComment = (comments: Comment[]): Comment[] => {
                    return comments.filter(comment => {
                        if (comment.id === commentId) {
                            return false;
                        }
                        if (comment.replies) {
                            return {
                                ...comment,
                                replies: removeComment(comment.replies)
                            };
                        }
                        return true;
                    }).map(comment => {
                        if (comment.replies) {
                            return {
                                ...comment,
                                replies: removeComment(comment.replies)
                            };
                        }
                        return comment;
                    });
                };
                return removeComment(prev);
            });
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw error;
        }
    };

    // Count all comments including replies
    const countAllComments = (comments: Comment[]): number => {
        return comments.reduce((count, comment) => {
            return count + 1 + (comment.replies ? countAllComments(comment.replies) : 0);
        }, 0);
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <MessageCircle className="w-5 h-5" />
                        <span>Comments</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-4 text-gray-500  ">
                        Loading comments...
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="bg-white   rounded-lg border">
            <div className="px-4 py-3 border-b border-gray-200  ">
                <h3 className="text-sm font-medium text-gray-900  ">
                    Comments ({countAllComments(comments)})
                </h3>
            </div>
            <div className="p-4 space-y-4">
                {/* New comment form */}
                <div className="bg-gray-50   rounded-lg p-3">
                    <div className="flex items-start space-x-3">
                        <Avatar className="w-8 h-8">
                            <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <Textarea
                                placeholder="What are your thoughts?"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="min-h-[80px] text-sm border-gray-300  "
                                rows={3}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end mt-3">
                        <Button
                            onClick={handleSubmitComment}
                            disabled={!newComment.trim() || isSubmitting}
                            className="flex items-center space-x-2 text-sm bg-gray-400"
                            size="sm"
                        >
                            <Send className="w-4 h-4" />
                            <span>{isSubmitting ? 'Posting...' : 'Comment'}</span>
                        </Button>
                    </div>
                </div>

                {/* Comments list */}
                <div className="space-y-1">
                    {comments.length === 0 ? (
                        <div className="text-center py-8 text-gray-500  ">
                            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p className="text-sm">No comments yet. Be the first to comment!</p>
                        </div>
                    ) : (
                        comments.map((comment, index) => (
                            <CommentItem
                                key={`${comment.id}-${index}`}
                                comment={comment}
                                onReply={handleReply}
                                onReaction={handleReaction}
                                onDelete={handleDelete}
                                depth={0}
                                maxDepth={5}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
