import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Upload, X, Image as ImageIcon, Users, Globe, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { easterEggService } from '../services/easterEggService';
import type { UploadMemeData } from '../types/Meme';

interface MemeUploadProps {
    onUpload: (data: UploadMemeData) => void;
}

const MemeUpload: React.FC<MemeUploadProps> = ({ onUpload }) => {
    const { user } = useAuth();
    const friends: unknown[] = []; // Temporary workaround for friends
    const [isOpen, setIsOpen] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [caption, setCaption] = useState('');
    const [author, setAuthor] = useState('');
    const [visibility, setVisibility] = useState<'public' | 'friends' | 'private' | 'anonymous'>('public');
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isAuthenticated = !!user;

    const handleFileSelect = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            setImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image) return;

        setError('');
        setLoading(true);

        try {
            await onUpload({
                image,
                caption: caption.trim() || undefined,
                author: isAuthenticated ? (user?.name || user?.email) : (author.trim() || 'Anonymous'),
                isAnonymous: !isAuthenticated || visibility === 'anonymous',
                visibility: isAuthenticated ? visibility : 'public',
            });

            // Show easter egg toast
            easterEggService.toasts.upload();

            // Console easter egg
            console.log(`📤 Meme uploaded successfully! ${easterEggService.ui.getRandomStackOverflowQuote()}`);

            handleClose();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Upload failed';
            setError(errorMessage);

            // Show easter egg error toast
            easterEggService.toasts.error();

            // Console easter egg
            console.log(`❌ Upload failed: ${errorMessage}! ${easterEggService.ui.getRandomDeveloperJoke()}`);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setImage(null);
        setPreview(null);
        setCaption('');
        setAuthor('');
        setVisibility('public');
        setError('');
        setLoading(false);
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                className="w-full sm:w-auto border bg-gray-400 text-white dark:text-gray-900"
            >
                <Upload className="w-4 h-4 mr-2" />
                Upload Meme
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Upload a Meme</DialogTitle>
                        <DialogDescription>
                            {isAuthenticated
                                ? `Share your funniest memes with the community, ${user?.name || user?.email}!`
                                : 'Share your funniest memes with the community! You can upload anonymously or sign in for more features.'
                            }
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                                {error}
                            </div>
                        )}
                        <div
                            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragging
                                ? 'border-primary bg-primary/5'
                                : 'border-muted-foreground/25 hover:border-primary/50'
                                }`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                        >
                            {preview ? (
                                <div className="relative">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="max-h-64 w-full object-cover rounded-lg"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={() => {
                                            setImage(null);
                                            setPreview(null);
                                        }}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Drop your image here, or{' '}
                                            <button
                                                type="button"
                                                onClick={openFileDialog}
                                                className="text-primary hover:underline"
                                            >
                                                browse
                                            </button>
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            PNG, JPG, GIF up to 10MB
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileSelect(file);
                            }}
                            className="hidden"
                        />

                        <div className="space-y-3">
                            {!isAuthenticated && (
                                <div>
                                    <label htmlFor="author" className="text-sm font-medium">
                                        Your name (optional - leave blank for anonymous)
                                    </label>
                                    <Input
                                        id="author"
                                        placeholder="Anonymous"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                    />
                                </div>
                            )}

                            <div>
                                <label htmlFor="caption" className="text-sm font-medium">
                                    Caption (optional)
                                </label>
                                <Textarea
                                    id="caption"
                                    placeholder="What's this meme about?"
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    rows={3}
                                />
                            </div>

                            {isAuthenticated && (
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Who can see this meme?
                                    </label>
                                    <div className="grid grid-cols-4 gap-2">
                                        <Button
                                            type="button"
                                            variant={visibility === 'public' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setVisibility('public')}
                                            className="flex items-center space-x-1"
                                        >
                                            <Globe className="w-4 h-4" />
                                            <span>Public</span>
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={visibility === 'friends' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setVisibility('friends')}
                                            className="flex items-center space-x-1"
                                            disabled={friends.length === 0}
                                        >
                                            <Users className="w-4 h-4" />
                                            <span>Friends</span>
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={visibility === 'private' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setVisibility('private')}
                                            className="flex items-center space-x-1"
                                        >
                                            <Lock className="w-4 h-4" />
                                            <span>Private</span>
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={visibility === 'anonymous' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setVisibility('anonymous')}
                                            className="flex items-center space-x-1"
                                        >
                                            <Users className="w-4 h-4" />
                                            <span>Anonymous</span>
                                        </Button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {visibility === 'public' && 'Everyone can see this meme'}
                                        {visibility === 'friends' && (friends.length > 0 ? `Only your ${friends.length} friend${friends.length !== 1 ? 's' : ''} can see this meme` : 'Add friends first to use this option')}
                                        {visibility === 'private' && 'Only you can see this meme'}
                                        {visibility === 'anonymous' && 'Post as anonymous (no profile info shown)'}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={!image || loading}
                                className="flex-1 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900"
                            >
                                {loading ? 'Uploading...' : 'Upload Meme'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default MemeUpload;
