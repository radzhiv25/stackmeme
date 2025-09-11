import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Heart, MessageCircle, Share, MoreHorizontal, ThumbsUp, Laugh, Heart as HeartIcon, Zap, Frown, Angry } from 'lucide-react';
import type { Meme, Reaction } from '../types/Meme';
import { CommentThread } from './CommentThread';
import { RelativeTime } from './RelativeTime';
import { easterEggService } from '../services/easterEggService';

interface MemeCardProps {
  meme: Meme;
  onLike: (memeId: string) => void;
  onReact: (memeId: string, reactionType: Reaction['type']) => void;
}

const MemeCard: React.FC<MemeCardProps> = ({ meme, onLike, onReact }) => {
  const [showComments, setShowComments] = useState(false);
  const [showReactions, setShowReactions] = useState(false);


  const reactionIcons = {
    like: <ThumbsUp className="w-4 h-4" />,
    laugh: <Laugh className="w-4 h-4" />,
    love: <HeartIcon className="w-4 h-4" />,
    wow: <Zap className="w-4 h-4" />,
    sad: <Frown className="w-4 h-4" />,
    angry: <Angry className="w-4 h-4" />,
  };

  const reactionColors = {
    like: 'text-gray-600',
    laugh: 'text-yellow-500',
    love: 'text-red-500',
    wow: 'text-gray-600',
    sad: 'text-gray-500',
    angry: 'text-gray-600',
  };

  // Easter egg functions
  const handleLike = () => {
    onLike(meme.id);

    // Show easter egg toast
    easterEggService.toasts.like();

    // Console easter egg
    console.log(`👍 Liked meme ${meme.id}! ${easterEggService.ui.getRandomStackOverflowQuote()}`);
  };

  const handleComment = () => {
    setShowComments(!showComments);

    if (!showComments) {
      // Show easter egg toast
      easterEggService.toasts.comment();

      // Console easter egg
      console.log(`💬 Commenting on meme ${meme.id}! ${easterEggService.ui.getRandomDeveloperJoke()}`);
    }
  };

  const handleReaction = (reactionType: Reaction['type']) => {
    onReact(meme.id, reactionType);

    // Show easter egg toast
    easterEggService.toasts.like();

    // Console easter egg
    console.log(`🎭 Reacted with ${reactionType} to meme ${meme.id}! ${easterEggService.ui.getRandomStackOverflowQuote()}`);
  };



  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              {meme.authorAvatar && !meme.isAnonymous ? (
                <img
                  src={meme.authorAvatar}
                  alt={meme.author || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <AvatarFallback>
                  {meme.isAnonymous ? 'A' : (meme.author?.charAt(0).toUpperCase() || 'A')}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <p className="font-semibold text-sm">
                {meme.isAnonymous ? 'Anonymous' : (meme.author || 'Anonymous')}
              </p>
              <p className="text-xs text-muted-foreground">
                <RelativeTime
                  date={meme.uploadDate}
                  className="text-muted-foreground"
                />
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Meme Image */}
        <div className="relative">
          <img
            src={meme.imageUrl}
            alt={meme.caption || 'Meme'}
            className="w-full rounded-lg object-cover"
          />
        </div>

        {/* Caption */}
        {meme.caption && (
          <p className="text-sm">{meme.caption}</p>
        )}

        {/* Reactions Summary */}
        {meme.reactions.length > 0 && (
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <div className="flex -space-x-1">
              {meme.reactions.slice(0, 3).map((reaction, index) => (
                <div
                  key={reaction.id}
                  className={`w-5 h-5 rounded-full bg-background border-2 border-background flex items-center justify-center ${reactionColors[reaction.type]}`}
                  style={{ zIndex: 3 - index }}
                >
                  {reactionIcons[reaction.type]}
                </div>
              ))}
            </div>
            <span>{meme.likes} likes</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className="flex items-center space-x-1"
            >
              <Heart className={`w-4 h-4 ${meme.likes > 0 ? 'text-red-500 fill-red-500' : ''}`} />
              <span>{meme.likes}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleComment}
              className="flex items-center space-x-1"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{meme.comments.length}</span>
            </Button>

            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReactions(!showReactions)}
                className="flex items-center space-x-1"
              >
                <Zap className="w-4 h-4" />
              </Button>

              {showReactions && (
                <div className="absolute top-10 left-0 bg-background border rounded-lg shadow-lg p-2 flex space-x-1 z-10">
                  {Object.entries(reactionIcons).map(([type, icon]) => (
                    <Button
                      key={type}
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handleReaction(type as Reaction['type']);
                        setShowReactions(false);
                      }}
                      className={`w-8 h-8 p-0 ${reactionColors[type as Reaction['type']]}`}
                    >
                      {icon}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button variant="ghost" size="sm">
            <Share className="w-4 h-4" />
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="pt-4 border-t">
            <CommentThread memeId={meme.id} initialComments={meme.comments} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemeCard;
