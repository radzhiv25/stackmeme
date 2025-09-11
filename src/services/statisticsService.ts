import { databases, Query } from '../lib/appwrite';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const MEMES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_MEMES_COLLECTION_ID;
const USER_PROFILES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USER_PROFILES_COLLECTION_ID;

export interface AppStatistics {
    totalMemes: number;
    totalUsers: number;
    totalLikes: number;
    totalComments: number;
}

export const statisticsService = {
    // Get total count of memes
    async getTotalMemes(): Promise<number> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                MEMES_COLLECTION_ID,
                [Query.limit(1)] // We only need the total count
            );
            return response.total;
        } catch (error) {
            console.error('Error fetching total memes:', error);
            return 0;
        }
    },

    // Get total count of users
    async getTotalUsers(): Promise<number> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                USER_PROFILES_COLLECTION_ID,
                [Query.limit(1)] // We only need the total count
            );
            return response.total;
        } catch (error) {
            console.error('Error fetching total users:', error);
            return 0;
        }
    },

    // Get total likes across all memes
    async getTotalLikes(): Promise<number> {
        try {
            // Get all memes to sum up likes
            const response = await databases.listDocuments(
                DATABASE_ID,
                MEMES_COLLECTION_ID,
                [Query.limit(1000)] // Get up to 1000 memes to sum likes
            );

            return response.documents.reduce((total, meme) => {
                return total + (meme.likes || 0);
            }, 0);
        } catch (error) {
            console.error('Error fetching total likes:', error);
            return 0;
        }
    },

    // Get total comments across all memes
    async getTotalComments(): Promise<number> {
        try {
            // Get all memes to sum up comments
            const response = await databases.listDocuments(
                DATABASE_ID,
                MEMES_COLLECTION_ID,
                [Query.limit(1000)] // Get up to 1000 memes to sum comments
            );

            return response.documents.reduce((total, meme) => {
                return total + (meme.commentsCount || 0);
            }, 0);
        } catch (error) {
            console.error('Error fetching total comments:', error);
            return 0;
        }
    },

    // Get all statistics at once
    async getAllStatistics(): Promise<AppStatistics> {
        try {
            const [totalMemes, totalUsers, totalLikes, totalComments] = await Promise.all([
                this.getTotalMemes(),
                this.getTotalUsers(),
                this.getTotalLikes(),
                this.getTotalComments()
            ]);

            return {
                totalMemes,
                totalUsers,
                totalLikes,
                totalComments
            };
        } catch (error) {
            console.error('Error fetching statistics:', error);
            return {
                totalMemes: 0,
                totalUsers: 0,
                totalLikes: 0,
                totalComments: 0
            };
        }
    }
};
