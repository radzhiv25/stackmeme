export interface Meme {
  id: string;
  imageUrl: string;
  caption?: string;
  uploadDate: string;
  createdAt: string; // Appwrite automatically manages this
  likes: number;
  dislikes: number; // Separate dislike count
  comments: Comment[];
  reactions: Reaction[];
  author?: string; // Optional for anonymous posts
  authorId?: string; // For authenticated users
  authorAvatar?: string; // Avatar URL for the author
  isAnonymous: boolean; // Whether the meme was posted anonymously
  visibility: 'public' | 'friends' | 'private' | 'anonymous'; // New visibility setting
  friendsOnly?: boolean; // Legacy field for backward compatibility
  userLikes?: string[]; // Array of user IDs who have liked this meme
  userDislikes?: string[]; // Array of user IDs who have disliked this meme
}

export interface Comment {
  id: string;
  memeId: string;
  text: string;
  author?: string; // Optional for anonymous comments
  authorId?: string; // For authenticated users
  parentId?: string; // For replies
  depth: number; // Nesting depth (0 = top-level, 1 = reply, 2 = reply to reply)
  likes: number;
  dislikes: number; // Separate dislike count
  repliesCount: number;
  isAnonymous: boolean;
  timestamp: string;
  createdAt: string; // Appwrite automatically manages this
  replies?: Comment[]; // Nested replies
}

export interface Reaction {
  id: string;
  memeId: string;
  type: 'like' | 'laugh' | 'love' | 'wow' | 'sad' | 'angry';
  author?: string; // Optional for anonymous reactions
  authorId?: string; // For authenticated users
  isAnonymous: boolean;
  timestamp: string;
  createdAt: string; // Appwrite automatically manages this
}

export interface CommentReaction {
  id: string;
  commentId: string;
  type: 'like' | 'dislike' | 'laugh' | 'love' | 'wow' | 'sad' | 'angry';
  author?: string; // Optional for anonymous reactions
  authorId?: string; // For authenticated users
  isAnonymous: boolean;
  timestamp: string;
  createdAt: string; // Appwrite automatically manages this
}

export interface UploadMemeData {
  image: File;
  caption?: string;
  author?: string;
  authorId?: string;
  authorAvatar?: string;
  isAnonymous?: boolean;
  visibility?: 'public' | 'friends' | 'private' | 'anonymous';
}

