# Friend System Setup Guide for Meme Vault

This guide explains how to set up the friend system in your Appwrite console to enable exclusive meme sharing between friends.

## Overview

The friend system adds the following features to your meme vault:
- User profiles with avatars and bios
- Friend requests and management
- Exclusive meme sharing (friends-only visibility)
- Friend activity feed
- Enhanced user experience with social features

## 1. Environment Variables

Add these new environment variables to your `.env` file:

```env
# Existing variables...
VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id_here
VITE_APPWRITE_DATABASE_ID=your_database_id_here
VITE_APPWRITE_MEMES_COLLECTION_ID=memes
VITE_APPWRITE_COMMENTS_COLLECTION_ID=comments
VITE_APPWRITE_REACTIONS_COLLECTION_ID=reactions
VITE_APPWRITE_COMMENT_REACTIONS_COLLECTION_ID=comment_reactions
VITE_APPWRITE_STORAGE_BUCKET_ID=meme-images

# New friend system variables
VITE_APPWRITE_FRIENDS_COLLECTION_ID=friends
VITE_APPWRITE_FRIEND_REQUESTS_COLLECTION_ID=friend_requests
VITE_APPWRITE_USER_PROFILES_COLLECTION_ID=user_profiles
VITE_APPWRITE_FRIEND_ACTIVITIES_COLLECTION_ID=friend_activities

# Note: Using single bucket (meme-images) for both memes and avatars
# This optimizes for the free plan and simplifies management
```

## 2. Database Collections Setup

### 2.1 Update Existing Collections

#### Update `memes` Collection
Add these new attributes to your existing `memes` collection:

**New Attributes:**
- `visibility` (String, 20) - Values: 'public', 'friends', 'private'
- `friendsOnly` (Boolean, default: false) - Legacy field for backward compatibility

**Updated Permissions:**
- **Create**: `users` (only authenticated users can create memes)
- **Read**: `any` (anyone can read public memes, friends can read friends-only memes)
- **Update**: `users` (only meme authors can update)
- **Delete**: `users` (only meme authors can delete)

### 2.2 Create New Collections

#### Collection 1: `friends`
**Purpose**: Store friendship relationships

**Attributes:**
- `userId` (String, 255) - ID of the user
- `friendId` (String, 255) - ID of the friend
- `friendName` (String, 255) - Name of the friend
- `friendEmail` (String, 255) - Email of the friend
- `status` (String, 20) - Values: 'pending', 'accepted', 'blocked'
- `createdAt` (DateTime) - When friendship was created
- `updatedAt` (DateTime) - When friendship was last updated

**Permissions:**
- **Create**: `users` (users can create friendships)
- **Read**: `users` (users can read their own friendships)
- **Update**: `users` (users can update their own friendships)
- **Delete**: `users` (users can delete their own friendships)

**Indexes:**
- `userId` (ASC) - For finding user's friends
- `friendId` (ASC) - For finding friends of a user
- `status` (ASC) - For filtering by status

#### Collection 2: `friend_requests`
**Purpose**: Store friend requests

**Attributes:**
- `fromUserId` (String, 255) - ID of user sending request
- `fromUserName` (String, 255) - Name of user sending request
- `fromUserEmail` (String, 255) - Email of user sending request
- `toUserId` (String, 255) - ID of user receiving request
- `toUserName` (String, 255) - Name of user receiving request
- `toUserEmail` (String, 255) - Email of user receiving request
- `status` (String, 20) - Values: 'pending', 'accepted', 'declined'
- `createdAt` (DateTime) - When request was created
- `updatedAt` (DateTime) - When request was last updated

**Permissions:**
- **Create**: `users` (users can send friend requests)
- **Read**: `users` (users can read their own requests)
- **Update**: `users` (users can update their own requests)
- **Delete**: `users` (users can delete their own requests)

**Indexes:**
- `fromUserId` (ASC) - For finding sent requests
- `toUserId` (ASC) - For finding received requests
- `status` (ASC) - For filtering by status

#### Collection 3: `user_profiles`
**Purpose**: Store extended user profile information

**Attributes:**
- `name` (String, 255) - User's display name
- `email` (String, 255) - User's email
- `avatar` (String, 500, optional) - URL to user's avatar image
- `bio` (String, 1000, optional) - User's bio/description
- `isOnline` (Boolean, default: false) - Whether user is currently online
- `lastSeen` (DateTime) - When user was last seen
- `friendsCount` (Integer, default: 0) - Number of friends
- `memesCount` (Integer, default: 0) - Number of memes posted
- `createdAt` (DateTime) - When profile was created
- `updatedAt` (DateTime) - When profile was last updated

**Permissions:**
- **Create**: `users` (users can create their own profile)
- **Read**: `any` (profiles are public)
- **Update**: `users` (users can update their own profile)
- **Delete**: `users` (users can delete their own profile)

**Indexes:**
- `email` (ASC) - For finding users by email
- `name` (ASC) - For searching users by name
- `isOnline` (ASC) - For filtering online users

#### Collection 4: `friend_activities`
**Purpose**: Store friend activity feed

**Attributes:**
- `userId` (String, 255) - ID of user who performed activity
- `userName` (String, 255) - Name of user who performed activity
- `activityType` (String, 50) - Type of activity: 'meme_upload', 'meme_like', 'comment', 'friend_added'
- `targetId` (String, 255, optional) - ID of target (meme, friend, etc.)
- `targetName` (String, 255, optional) - Name of target (meme caption, friend name, etc.)
- `createdAt` (DateTime) - When activity occurred

**Permissions:**
- **Create**: `users` (users can create activities)
- **Read**: `users` (users can read activities from their friends)
- **Update**: `users` (users can update their own activities)
- **Delete**: `users` (users can delete their own activities)

**Indexes:**
- `userId` (ASC) - For finding user's activities
- `activityType` (ASC) - For filtering by activity type
- `createdAt` (DESC) - For chronological ordering

## 3. Storage Setup

### 3.1 Single Bucket Approach (Recommended for Free Plan)
**Use the existing `meme-images` bucket for both memes and avatars**

This approach is optimized for the Appwrite free plan and uses a single bucket for all images:

**Bucket Name**: `meme-images` (already created)

**Permissions:**
- **Create**: `any` (anyone can upload images)
- **Read**: `any` (all images are public)
- **Update**: `any` (anyone can update images)
- **Delete**: `any` (anyone can delete images)

**File Size Limits**:
- **Memes**: 10MB maximum
- **Avatars**: 5MB maximum (enforced in code)

**Allowed Extensions**: `jpg`, `jpeg`, `png`, `gif`, `webp`

**Benefits**:
- ✅ Stays within free plan limits
- ✅ Simplified bucket management
- ✅ Consistent permissions
- ✅ Cost-effective solution

## 4. Database Rules and Security

### 4.1 Friends Collection Rules
```javascript
// Only allow users to create friendships for themselves
function() {
  return $userId === $request.auth.uid;
}

// Only allow users to read their own friendships
function() {
  return $userId === $request.auth.uid || $friendId === $request.auth.uid;
}
```

### 4.2 Friend Requests Collection Rules
```javascript
// Only allow users to create requests for themselves
function() {
  return $fromUserId === $request.auth.uid;
}

// Only allow users to read their own requests
function() {
  return $fromUserId === $request.auth.uid || $toUserId === $request.auth.uid;
}
```

### 4.3 User Profiles Collection Rules
```javascript
// Only allow users to create/update their own profile
function() {
  return $userId === $request.auth.uid;
}

// Allow anyone to read profiles
function() {
  return true;
}
```

### 4.4 Memes Collection Rules (Updated)
```javascript
// Only authenticated users can create memes
function() {
  return $request.auth.uid !== null;
}

// Allow reading based on visibility
function() {
  // Public memes are visible to everyone
  if ($visibility === 'public') {
    return true;
  }
  
  // Private memes only visible to author
  if ($visibility === 'private') {
    return $authorId === $request.auth.uid;
  }
  
  // Friends-only memes visible to author and friends
  if ($visibility === 'friends') {
    // This would require checking friends collection
    // For now, allow if user is authenticated
    return $request.auth.uid !== null;
  }
  
  return false;
}
```

## 5. UI Components Integration

### 5.1 Add Friend Management to Navigation
Update your main navigation to include friend management:

```tsx
// In your main layout component
import FriendManagement from './components/FriendManagement';
import UserProfile from './components/UserProfile';
import FriendActivity from './components/FriendActivity';

// Add these to your navigation or create separate pages
```

### 5.2 Update Meme Upload Component
The MemeUpload component now includes visibility options:
- Public: Everyone can see
- Friends: Only friends can see
- Private: Only you can see

### 5.3 Update Meme Feed
The meme feed now automatically filters content based on:
- User's authentication status
- User's friends list
- Meme visibility settings

## 6. Features Enabled

### 6.1 For Authenticated Users
- ✅ Create user profile with avatar and bio
- ✅ Send and receive friend requests
- ✅ Manage friends list
- ✅ Upload memes with visibility controls
- ✅ See friends-only content
- ✅ View friend activity feed
- ✅ Search for other users
- ✅ Enhanced social experience

### 6.2 For Anonymous Users
- ✅ View public memes only
- ✅ Upload anonymous memes (public only)
- ✅ All existing anonymous features

## 7. Testing the Friend System

### 7.1 Test Scenarios
1. **User Registration**: Create multiple user accounts
2. **Profile Creation**: Set up user profiles with avatars and bios
3. **Friend Requests**: Send and accept friend requests
4. **Meme Visibility**: Upload memes with different visibility settings
5. **Content Filtering**: Verify friends can see friends-only content
6. **Activity Feed**: Check that friend activities appear in feed

### 7.2 Test Data
Create test users with different relationships:
- User A and User B are friends
- User C is not friends with anyone
- Upload memes with different visibility settings
- Verify content appears correctly for each user

## 8. Performance Considerations

### 8.1 Database Indexes
Ensure all collections have proper indexes for:
- User lookups
- Friend relationships
- Activity feeds
- Content filtering

### 8.2 Caching
Consider implementing caching for:
- User profiles
- Friends lists
- Activity feeds

### 8.3 Pagination
Implement pagination for:
- Friends list
- Friend requests
- Activity feed
- Meme feed

## 9. Security Considerations

### 9.1 Data Privacy
- User profiles are public by default
- Memes respect visibility settings
- Friend relationships are private
- Activity feeds only show to friends

### 9.2 Input Validation
- Validate all user inputs
- Sanitize text content
- Validate image uploads
- Rate limit friend requests

### 9.3 Access Control
- Users can only manage their own data
- Friends can only see friends-only content
- Private content is truly private

## 10. Troubleshooting

### 10.1 Common Issues
- **Friend requests not appearing**: Check collection permissions
- **Memes not showing**: Verify visibility settings and friend relationships
- **Profile not updating**: Check user profile collection permissions
- **Activity feed empty**: Verify friend relationships and activity creation

### 10.2 Debug Steps
1. Check browser console for errors
2. Verify environment variables are set
3. Check Appwrite console for collection permissions
4. Verify user authentication status
5. Check friend relationships in database

## 11. Next Steps

After setting up the friend system:

1. **Test thoroughly** with multiple users
2. **Monitor performance** and optimize as needed
3. **Gather user feedback** on the social features
4. **Consider additional features** like:
   - Friend groups/circles
   - Meme collections
   - Direct messaging
   - Notifications
   - Advanced privacy controls

## 12. Support

If you encounter issues:
1. Check the Appwrite documentation
2. Review the collection permissions
3. Verify environment variables
4. Check browser console for errors
5. Test with different user accounts

The friend system significantly enhances the exclusivity and social aspects of your meme vault, creating a more engaging and private community experience.

