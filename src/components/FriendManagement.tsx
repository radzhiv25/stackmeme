import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import type { UserProfile } from '../types/Friend';

const FriendManagement: React.FC = () => {
    const {
        friends,
        friendRequests,
        sendFriendRequest,
        acceptFriendRequest,
        declineFriendRequest,
        removeFriend,
        searchUsers
    } = useAuth();


    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [friendEmail, setFriendEmail] = useState('');
    const [isSendingRequest, setIsSendingRequest] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setError('');

        try {
            const results = await searchUsers(searchQuery);
            setSearchResults(results);
        } catch (err) {
            setError('Failed to search users');
            console.error('Search error:', err);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSendFriendRequest = async () => {
        if (!friendEmail.trim()) return;

        setIsSendingRequest(true);
        setError('');

        try {
            await sendFriendRequest(friendEmail);
            setFriendEmail('');
            setError('');
            // Friend requests will be automatically refreshed by the AuthContext
        } catch (err) {
            console.error('Friend request error:', err);
            setError(err instanceof Error ? err.message : 'Failed to send friend request');
        } finally {
            setIsSendingRequest(false);
        }
    };

    const handleAcceptRequest = async (requestId: string) => {
        try {
            await acceptFriendRequest(requestId);
        } catch (err) {
            setError('Failed to accept friend request');
        }
    };

    const handleDeclineRequest = async (requestId: string) => {
        try {
            await declineFriendRequest(requestId);
        } catch (err) {
            setError('Failed to decline friend request');
        }
    };

    const handleRemoveFriend = async (friendId: string) => {
        if (window.confirm('Are you sure you want to remove this friend?')) {
            try {
                await removeFriend(friendId);
            } catch (err) {
                setError('Failed to remove friend');
            }
        }
    };

    const pendingRequests = friendRequests.filter((req: any) => req.status === 'pending');

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Friend Management</CardTitle>
                    <CardDescription>
                        Manage your friends and friend requests
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="friends" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="friends">Friends ({friends.length})</TabsTrigger>
                            <TabsTrigger value="requests">Requests ({pendingRequests.length})</TabsTrigger>
                            <TabsTrigger value="search">Search Users</TabsTrigger>
                            <TabsTrigger value="add">Add Friend</TabsTrigger>
                        </TabsList>

                        <TabsContent value="friends" className="space-y-4">
                            <h3 className="text-lg font-semibold">Your Friends</h3>
                            {friends.length === 0 ? (
                                <p className="text-gray-500">No friends yet. Add some friends to get started!</p>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                                    {friends.map((friend: any) => (
                                        <Card key={friend.id} className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <Avatar>
                                                    <AvatarImage src={friend.avatar} />
                                                    <AvatarFallback>{friend.friendName.charAt(0).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{friend.friendName}</p>
                                                    <p className="text-xs text-gray-500 truncate">{friend.friendEmail}</p>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleRemoveFriend(friend.friendId)}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="requests" className="space-y-4">
                            <h3 className="text-lg font-semibold">Friend Requests</h3>
                            {pendingRequests.length === 0 ? (
                                <p className="text-gray-500">No pending friend requests.</p>
                            ) : (
                                <div className="space-y-4">
                                    {pendingRequests.map((request: any) => (
                                        <Card key={request.id} className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <Avatar>
                                                        <AvatarFallback>{request.fromUserName.charAt(0).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{request.fromUserName}</p>
                                                        <p className="text-sm text-gray-500">{request.fromUserEmail}</p>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleAcceptRequest(request.id)}
                                                    >
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDeclineRequest(request.id)}
                                                    >
                                                        Decline
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="search" className="space-y-4">
                            <h3 className="text-lg font-semibold">Search Users</h3>
                            <div className="flex space-x-2">
                                <Input
                                    placeholder="Search by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <Button onClick={handleSearch} disabled={isSearching}>
                                    {isSearching ? 'Searching...' : 'Search'}
                                </Button>
                            </div>

                            {searchResults.length > 0 && (
                                <div className="space-y-4">
                                    <h4 className="font-medium">Search Results</h4>
                                    {searchResults.map((user) => (
                                        <Card key={user.id} className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <Avatar>
                                                        <AvatarImage src={user.avatar} />
                                                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{user.name}</p>
                                                        <p className="text-sm text-gray-500">{user.email}</p>
                                                        {user.bio && <p className="text-sm text-gray-600">{user.bio}</p>}
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    onClick={() => {
                                                        setFriendEmail(user.email);
                                                        // Switch to add friend tab
                                                        const addTab = document.querySelector('[value="add"]') as HTMLElement;
                                                        addTab?.click();
                                                    }}
                                                >
                                                    Add Friend
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="add" className="space-y-4">
                            <h3 className="text-lg font-semibold">Add Friend by Email</h3>
                            <div className="space-y-4">
                                <div>
                                    <Input
                                        placeholder="Enter friend's email address"
                                        value={friendEmail}
                                        onChange={(e) => setFriendEmail(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendFriendRequest()}
                                    />
                                </div>
                                <Button
                                    onClick={handleSendFriendRequest}
                                    disabled={isSendingRequest || !friendEmail.trim()}
                                    className="w-full"
                                >
                                    {isSendingRequest ? 'Sending...' : 'Send Friend Request'}
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>

                    {error && (
                        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default FriendManagement;

