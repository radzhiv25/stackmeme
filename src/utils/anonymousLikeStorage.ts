// Utility for tracking anonymous user likes in localStorage
// This allows anonymous users to have a "1 user 1 like" experience

const ANONYMOUS_LIKES_KEY = 'stackmeme_anonymous_likes';
const ANONYMOUS_DISLIKES_KEY = 'stackmeme_anonymous_dislikes';

export interface AnonymousLikeData {
    likedMemes: string[];
    dislikedMemes: string[];
}

export const anonymousLikeStorage = {
    // Get all liked meme IDs for anonymous user
    getLikedMemes(): string[] {
        try {
            const data = localStorage.getItem(ANONYMOUS_LIKES_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading anonymous likes from localStorage:', error);
            return [];
        }
    },

    // Get all disliked meme IDs for anonymous user
    getDislikedMemes(): string[] {
        try {
            const data = localStorage.getItem(ANONYMOUS_DISLIKES_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading anonymous dislikes from localStorage:', error);
            return [];
        }
    },

    // Check if anonymous user has liked a specific meme
    hasLikedMeme(memeId: string): boolean {
        const likedMemes = this.getLikedMemes();
        return likedMemes.includes(memeId);
    },

    // Check if anonymous user has disliked a specific meme
    hasDislikedMeme(memeId: string): boolean {
        const dislikedMemes = this.getDislikedMemes();
        return dislikedMemes.includes(memeId);
    },

    // Add a meme to liked list
    likeMeme(memeId: string): void {
        try {
            const likedMemes = this.getLikedMemes();
            if (!likedMemes.includes(memeId)) {
                const newLikedMemes = [...likedMemes, memeId];
                localStorage.setItem(ANONYMOUS_LIKES_KEY, JSON.stringify(newLikedMemes));
            }
        } catch (error) {
            console.error('Error saving anonymous like to localStorage:', error);
        }
    },

    // Remove a meme from liked list
    unlikeMeme(memeId: string): void {
        try {
            const likedMemes = this.getLikedMemes();
            const newLikedMemes = likedMemes.filter(id => id !== memeId);
            localStorage.setItem(ANONYMOUS_LIKES_KEY, JSON.stringify(newLikedMemes));
        } catch (error) {
            console.error('Error removing anonymous like from localStorage:', error);
        }
    },

    // Add a meme to disliked list
    dislikeMeme(memeId: string): void {
        try {
            const dislikedMemes = this.getDislikedMemes();
            if (!dislikedMemes.includes(memeId)) {
                const newDislikedMemes = [...dislikedMemes, memeId];
                localStorage.setItem(ANONYMOUS_DISLIKES_KEY, JSON.stringify(newDislikedMemes));
            }
        } catch (error) {
            console.error('Error saving anonymous dislike to localStorage:', error);
        }
    },

    // Remove a meme from disliked list
    undislikeMeme(memeId: string): void {
        try {
            const dislikedMemes = this.getDislikedMemes();
            const newDislikedMemes = dislikedMemes.filter(id => id !== memeId);
            localStorage.setItem(ANONYMOUS_DISLIKES_KEY, JSON.stringify(newDislikedMemes));
        } catch (error) {
            console.error('Error removing anonymous dislike from localStorage:', error);
        }
    },

    // Toggle like for anonymous user
    toggleLike(memeId: string): { liked: boolean; wasDisliked: boolean } {
        const hasLiked = this.hasLikedMeme(memeId);
        const hasDisliked = this.hasDislikedMeme(memeId);

        if (hasLiked) {
            // User already liked, so unlike
            this.unlikeMeme(memeId);
            return { liked: false, wasDisliked: false };
        } else {
            // User hasn't liked, so like
            this.likeMeme(memeId);

            // If user had disliked, remove from dislikes
            if (hasDisliked) {
                this.undislikeMeme(memeId);
                return { liked: true, wasDisliked: true };
            }

            return { liked: true, wasDisliked: false };
        }
    },

    // Get all anonymous like data
    getAllData(): AnonymousLikeData {
        return {
            likedMemes: this.getLikedMemes(),
            dislikedMemes: this.getDislikedMemes()
        };
    },

    // Clear all anonymous like data (useful for testing or user preference)
    clearAllData(): void {
        try {
            localStorage.removeItem(ANONYMOUS_LIKES_KEY);
            localStorage.removeItem(ANONYMOUS_DISLIKES_KEY);
        } catch (error) {
            console.error('Error clearing anonymous like data:', error);
        }
    }
};
