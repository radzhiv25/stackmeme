import React from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Trash2, AlertTriangle } from 'lucide-react';

interface DeleteCommentDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    commentAuthor?: string;
    isDeleting?: boolean;
}

export const DeleteCommentDialog: React.FC<DeleteCommentDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    commentAuthor = 'Anonymous',
    isDeleting = false
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center space-x-2">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Delete Comment
                            </DialogTitle>
                        </div>
                    </div>
                </DialogHeader>

                <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                    Are you sure you want to delete this comment by <span className="font-medium">{commentAuthor}</span>?
                    This action cannot be undone and will remove the comment and all its replies.
                </DialogDescription>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
                    >
                        {isDeleting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Comment
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

