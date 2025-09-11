import React, { useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { storageService } from '../services/appwriteService';
import { Upload, X } from 'lucide-react';

interface UserProfileProps { }

const UserProfile: React.FC<UserProfileProps> = () => {
    const { user, userProfile, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(userProfile?.name || user?.name || '');
    const [bio, setBio] = useState(userProfile?.bio || '');
    const [avatar, setAvatar] = useState(userProfile?.avatar || '');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = async () => {
        if (!name.trim()) {
            setError('Name is required');
            return;
        }

        setIsSaving(true);
        setError('');

        try {
            let avatarUrl = avatar;

            // Upload new avatar if file is selected
            if (avatarFile) {
                const { url } = await storageService.uploadAvatar(avatarFile);
                avatarUrl = url;
            }

            await updateProfile(name, bio || undefined, avatarUrl || undefined);
            setIsEditing(false);
            setAvatarFile(null);
            setAvatarPreview(null);
        } catch (err) {
            setError('Failed to update profile');
            console.error('Profile update error:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setName(userProfile?.name || user?.name || '');
        setBio(userProfile?.bio || '');
        setAvatar(userProfile?.avatar || '');
        setAvatarFile(null);
        setAvatarPreview(null);
        setIsEditing(false);
        setError('');
    };

    const handleAvatarSelect = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    if (!user) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-center text-gray-500">Please log in to view your profile.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Your Profile</CardTitle>
                    <CardDescription>
                        Manage your profile information and settings
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={avatarPreview || avatar} />
                                <AvatarFallback className="text-lg">
                                    {(userProfile?.name || user?.name || 'U').charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            {isEditing && (
                                <Button
                                    type="button"
                                    size="sm"
                                    className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0"
                                    onClick={openFileDialog}
                                >
                                    <Upload className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        <div className="flex-1">
                            {isEditing ? (
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Input
                                            placeholder="Avatar URL or upload file"
                                            value={avatar}
                                            onChange={(e) => setAvatar(e.target.value)}
                                        />
                                        {avatarFile && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setAvatarFile(null);
                                                    setAvatarPreview(null);
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                    {avatarFile && (
                                        <p className="text-xs text-gray-500">
                                            New avatar: {avatarFile.name}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <h3 className="text-xl font-semibold">{userProfile?.name || user?.name}</h3>
                                    <p className="text-gray-500">{user?.email}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleAvatarSelect(file);
                        }}
                        className="hidden"
                    />

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Name</label>
                            {isEditing ? (
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                />
                            ) : (
                                <p className="text-gray-900">{userProfile?.name || user?.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Bio</label>
                            {isEditing ? (
                                <Textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Tell us about yourself..."
                                    rows={3}
                                />
                            ) : (
                                <p className="text-gray-900">{userProfile?.bio || 'No bio yet'}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium">Friends:</span> {userProfile?.friendsCount || 0}
                            </div>
                            <div>
                                <span className="font-medium">Memes:</span> {userProfile?.memesCount || 0}
                            </div>
                            <div>
                                <span className="font-medium">Status:</span> {userProfile?.isOnline ? 'Online' : 'Offline'}
                            </div>
                            <div>
                                <span className="font-medium">Member since:</span> {new Date(user?.registration || '').toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        {isEditing ? (
                            <>
                                <Button onClick={handleSave} disabled={isSaving}>
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <Button variant="outline" onClick={handleCancel}>
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button onClick={() => setIsEditing(true)}>
                                    Edit Profile
                                </Button>
                            </>
                        )}
                    </div>

                    {error && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default UserProfile;

