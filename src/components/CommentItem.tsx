import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ChevronDown, ChevronRight, MessageCircle, ThumbsUp, ThumbsDown, Trash2 } from 'lucide-react';
import type { Comment, CommentReaction } from '../types/Meme';
import { DeleteCommentDialog } from './DeleteCommentDialog';
import { RelativeTime } from './RelativeTime';

interface CommentItemProps {
    comment: Comment;
    onReply: (parentId: string, text: string) => void;
    onReaction: (commentId: string, type: CommentReaction['type']) => void;
    onDelete: (commentId: string) => void;
    depth?: number;
    maxDepth?: number;
}


export const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    onReply,
    onReaction,
    onDelete,
    depth = 0,
    maxDepth = 5
}) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [isReplying, setIsReplying] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleReply = async () => {
        if (!replyText.trim()) return;

        if (depth >= maxDepth) {
            alert(`Maximum reply depth of ${maxDepth} reached. Please reply to a higher level comment.`);
            return;
        }

        setIsReplying(true);
        try {
            await onReply(comment.id, replyText);
            setReplyText('');
            setShowReplyForm(false);
        } catch (error) {
            console.error('Error replying to comment:', error);
        } finally {
            setIsReplying(false);
        }
    };

    const handleReaction = async (type: CommentReaction['type']) => {
        try {
            await onReaction(comment.id, type);
        } catch (error) {
            console.error('Error reacting to comment:', error);
        }
    };

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await onDelete(comment.id);
            setShowDeleteDialog(false);
        } catch (error) {
            console.error('Error deleting comment:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const canReply = depth < maxDepth;

    const getIndentClass = (depth: number) => {
        const indentMap = {
            0: '',
            1: 'ml-4',
            2: 'ml-8',
            3: 'ml-12',
            4: 'ml-16',
            5: 'ml-20'
        };
        return indentMap[depth as keyof typeof indentMap] || 'ml-20';
    };


    if (isCollapsed) {
        return (
            <div className={`flex items-center space-x-2 py-1 ${depth > 0 ? getIndentClass(depth) : ''}`}>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCollapsed(false)}
                    className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span className="font-medium">{comment.author || 'Anonymous'}</span>
                    <span>•</span>
                    <span className="text-green-600">{comment.likes} likes</span>
                    {comment.dislikes > 0 && (
                        <>
                            <span>•</span>
                            <span className="text-red-600">{comment.dislikes} dislikes</span>
                        </>
                    )}
                    <span>•</span>
                    <RelativeTime
                        date={comment.timestamp}
                        className="text-gray-500"
                    />
                    {comment.replies && comment.replies.length > 0 && (
                        <>
                            <span>•</span>
                            <span>{comment.replies.length} replies</span>
                        </>
                    )}
                </div>
            </div>
        );
    }


    return (
        <div className="space-y-1">
            <div className={`flex ${depth > 0 ? `${getIndentClass(depth)} border-l-2 border-gray-200 dark:border-gray-700` : ''}`}>
                {/* Collapse/Expand Button */}
                <div className="flex flex-col items-center mr-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsCollapsed(true)}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                    >
                        <ChevronDown className="w-4 h-4" />
                    </Button>
                </div>

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                    {/* Comment Header */}
                    <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {comment.author || 'Anonymous'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            <RelativeTime
                                date={comment.timestamp}
                                className="text-gray-500"
                            />
                        </span>
                        {comment.isAnonymous && (
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                • anonymous
                            </span>
                        )}
                    </div>

                    {/* Comment Text */}
                    <div className="text-sm text-gray-800 dark:text-gray-200 mb-2 whitespace-pre-wrap">
                        {comment.text}
                    </div>

                    {/* Comment Actions */}
                    <div className="flex justify-between items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                            {/* Voting */}
                            <div className="flex items-center space-x-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleReaction('like')}
                                    className="h-6 px-1 text-gray-500 hover:text-green-500 hover:bg-green-50"
                                    title="Upvote"
                                >
                                    <ThumbsUp className="w-3 h-3" />
                                </Button>
                                <span className="text-xs font-medium min-w-[20px] text-center text-green-600">
                                    {comment.likes}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleReaction('dislike')}
                                    className="h-6 px-1 text-gray-500 hover:text-red-500 hover:bg-red-50"
                                    title="Downvote"
                                >
                                    <ThumbsDown className="w-3 h-3" />
                                </Button>
                                <span className="text-xs font-medium min-w-[20px] text-center text-red-600">
                                    {comment.dislikes}
                                </span>
                            </div>

                            {/* Reply Button */}
                            {canReply && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowReplyForm(!showReplyForm)}
                                    className="h-6 px-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                >
                                    <MessageCircle className="w-3 h-3 mr-1" />
                                    Reply
                                </Button>
                            )}
                        </div>

                        {/* Delete Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowDeleteDialog(true)}
                            className="h-6 px-2 text-gray-500 hover:text-red-600 hover:bg-red-50"
                        >
                            <Trash2 className="size-3" />
                        </Button>

                    </div>
                </div>
            </div>

            {/* Reply form */}
            {showReplyForm && canReply && (
                <div className={`mt-2 ${getIndentClass(depth + 1)}`}>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded border p-3">
                        <Textarea
                            placeholder={`Reply to ${comment.author || 'Anonymous'}...`}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="mb-3 text-sm"
                            rows={3}
                        />
                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setShowReplyForm(false);
                                    setReplyText('');
                                }}
                                className="text-xs"
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleReply}
                                disabled={!replyText.trim() || isReplying}
                                className="text-xs"
                            >
                                {isReplying ? 'Replying...' : 'Reply'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <DeleteCommentDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                commentAuthor={comment.author || 'Anonymous'}
                isDeleting={isDeleting}
            />

            {/* Nested replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="space-y-1">
                    {comment.replies.map((reply, index) => (
                        <CommentItem
                            key={`${reply.id}-${depth}-${index}`}
                            comment={reply}
                            onReply={onReply}
                            onReaction={onReaction}
                            onDelete={onDelete}
                            depth={depth + 1}
                            maxDepth={5}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};