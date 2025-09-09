import { useContext } from 'react';
import { MemeContext } from '../contexts/MemeContextDefinition';

export const useMeme = () => {
    const context = useContext(MemeContext);
    if (context === undefined) {
        throw new Error('useMeme must be used within a MemeProvider');
    }
    return context;
};

