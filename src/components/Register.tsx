import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { easterEggService } from '../services/easterEggService';
import { toast } from 'sonner';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            toast.error('Passwords do not match! Please try again.');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            toast.error('Password must be at least 8 characters long!');
            return;
        }

        setLoading(true);

        try {
            await register(email, password, name);
            toast.success('Account created successfully! Welcome to StackMeme! 🎉');
            navigate('/feed');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Registration failed';
            setError(errorMessage);
            easterEggService.toasts.error();
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleRegister = () => {
        // Fake Google registration with funny toast
        easterEggService.toasts.google();

        // Console easter egg
        console.log(`🔍 Fake Google registration attempted! ${easterEggService.ui.getRandomStackOverflowQuote()}`);
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                    Enter your information to create a new account
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Google Register Button */}
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleRegister}
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
                        <label htmlFor="name" className="text-sm font-medium">
                            Full Name
                        </label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
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
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                minLength={8}
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
                    <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-sm font-medium">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={loading}
                                minLength={8}
                                className="pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={loading}
                            >
                                {showConfirmPassword ? (
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
                        {loading ? 'Creating account...' : 'Create Account'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default Register;
