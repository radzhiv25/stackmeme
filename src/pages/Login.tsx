import React from 'react';
import { Link } from 'react-router-dom';
import Auth from '../components/Auth';

const Login: React.FC = () => {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome Back!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Sign in to access your personalized meme feed and more features.
                    </p>
                </div>

                <Auth />

                <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link to="/" className="text-primary hover:underline">
                            Browse memes anonymously
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

