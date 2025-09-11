import React from 'react';
import { useMeme } from '../hooks/useMeme';
import MemeCard from './MemeCard';
import MemeUpload from './MemeUpload';
import { Card, CardContent } from './ui/card';
import { Skeleton } from './ui/skeleton';

const PublicMemeFeed: React.FC = () => {
    const { memes, addMeme, likeMeme, addReaction, loading } = useMeme();

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-center">
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="masonry-columns">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="masonry-item">
                            <Card className="w-full">
                                <CardContent className="p-4 space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-64 w-full rounded-lg" />
                                    <div className="flex justify-between">
                                        <div className="flex space-x-4">
                                            <Skeleton className="h-8 w-16" />
                                            <Skeleton className="h-8 w-16" />
                                        </div>
                                        <Skeleton className="h-8 w-8" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Upload Button */}
            <div className="flex justify-center">
                <div className="text-center">
                    <p className="text-xl text-muted-foreground italic mt-2">
                        Upload anonymously or sign in for a personalized experience
                    </p>
                </div>
            </div>
            <span className='flex justify-end'>
                <MemeUpload onUpload={addMeme} />
            </span>

            {/* Memes Feed with Masonry Layout */}
            {memes.length === 0 ? (
                <Card className="w-full max-w-lg mx-auto">
                    <CardContent className="p-8 text-center">
                        <div className="space-y-4">
                            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                                <span className="text-2xl">📸</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">No memes yet!</h3>
                                <p className="text-muted-foreground mb-4">
                                    Be the first to upload a meme and start the fun! 🎉
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Upload anonymously or create an account for more features
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="masonry-columns">
                    {memes.map((meme) => (
                        <div key={meme.id} className="masonry-item">
                            <MemeCard
                                meme={meme}
                                onLike={likeMeme}
                                onReact={addReaction}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PublicMemeFeed;
