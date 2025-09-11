import { useState, useEffect } from 'react';
import { statisticsService, type AppStatistics } from '../services/statisticsService';

export const useStatistics = () => {
    const [statistics, setStatistics] = useState<AppStatistics>({
        totalMemes: 0,
        totalUsers: 0,
        totalLikes: 0,
        totalComments: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                setLoading(true);
                setError(null);
                const stats = await statisticsService.getAllStatistics();
                setStatistics(stats);
            } catch (err) {
                console.error('Error fetching statistics:', err);
                setError('Failed to load statistics');
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    return { statistics, loading, error };
};
