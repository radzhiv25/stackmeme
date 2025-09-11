import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { easterEggService } from '../services/easterEggService';
import { toast } from 'sonner';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            toast.success('Welcome back! You have successfully logged in! 🎉');
            navigate('/feed');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            setError(errorMessage);
            easterEggService.toasts.error();
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        // Fake Google login with funny toast
        easterEggService.toasts.google();

        // Console easter egg
        console.log(`🔍 Fake Google login attempted! ${easterEggService.ui.getRandomStackOverflowQuote()}`);
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>
                    Enter your credentials to sign in to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Google Login Button */}
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleLogin}
                    className="w-full mb-4 flex items-center gap-2"
                >
                    <FaGoogle className="w-4 h-4 text-red-500" />
                    Continue with Google
                </Button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                            Email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">
                            Password
                        </label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                className="pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading}
                            >
                                {showPassword ? (
                                    <FaEyeSlash className="h-4 w-4 text-gray-400" />
                                ) : (
                                    <FaEye className="h-4 w-4 text-gray-400" />
                                )}
                            </Button>
                        </div>
                    </div>
                    {error && (
                        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                            {error}
                        </div>
                    )}
                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default Login;
