import { createContext } from 'react';
import type { Meme, Reaction, UploadMemeData } from '../types/Meme';

interface MemeContextType {
  memes: Meme[];
  addMeme: (data: UploadMemeData) => void;
  likeMeme: (memeId: string) => void;
  addComment: (memeId: string, comment: string) => void;
  addReaction: (memeId: string, reactionType: Reaction['type']) => void;
  loading: boolean;
}

export const MemeContext = createContext<MemeContextType | undefined>(undefined);
