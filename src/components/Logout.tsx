import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';

const Logout: React.FC = () => {
    const { logout, user } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
                Welcome, {user?.name || user?.email}!
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
                Sign Out
            </Button>
        </div>
    );
};

export default Logout;
