# Appwrite Setup Guide for Meme Vault

## 1. Create an Appwrite Project

1. Go to [Appwrite Cloud](https://cloud.appwrite.io) or set up your own Appwrite instance
2. Create a new project
3. Note down your **Project ID** and **API Endpoint**

## 2. Configure Your Project

Update the configuration in `src/lib/appwrite.ts`:

```typescript
client
    .setEndpoint('YOUR_API_ENDPOINT') // Replace with your Appwrite endpoint
    .setProject('YOUR_PROJECT_ID'); // Replace with your project ID
```

## 3. Enable Authentication (Optional)

In your Appwrite console:

1. Go to **Authentication** → **Settings**
2. Enable **Email/Password** authentication
3. Configure your authentication settings as needed

**Note:** Users can interact with memes anonymously, but authentication is available for those who want a personalized experience.

## 4. Set Up Storage for Images

1. Go to **Storage** in your Appwrite console
2. Create a new bucket called `meme-images`
3. Set the following permissions:
   - **Create**: `any` (for anonymous uploads)
   - **Read**: `any` (for public viewing)
   - **Update**: `any` (for image updates)
   - **Delete**: `any` (for image deletion)
4. Set file size limit to 10MB
5. Allowed file extensions: `jpg`, `jpeg`, `png`, `gif`, `webp`

## 5. Create Database and Collections

### 5.1 Create Database
1. Go to **Databases** in your Appwrite console
2. Create a new database called `meme-vault`

### 5.2 Create Collections

#### Collection 1: `memes`
**Purpose**: Store meme posts

**Attributes**:
- `imageId` (String, 255) - ID of the image in storage
- `imageUrl` (String, 500) - Direct URL to the image
- `caption` (String, 1000, optional) - Meme caption
- `author` (String, 255, optional) - Author name (for anonymous posts)
- `authorId` (String, 255, optional) - User ID (for authenticated posts)
- `likes` (Integer, default: 0) - Number of likes
- `commentsCount` (Integer, default: 0) - Number of comments
- `reactionsCount` (Integer, default: 0) - Number of reactions
- `isAnonymous` (Boolean, default: true) - Whether post is anonymous
- `createdAt` (DateTime) - When the meme was created
- `updatedAt` (DateTime) - When the meme was last updated

**Permissions**:
- **Create**: `any` (anyone can create memes)
- **Read**: `any` (anyone can read memes)
- **Update**: `any` (anyone can update likes/reactions)
- **Delete**: `any` (anyone can delete their own memes)

#### Collection 2: `comments`
**Purpose**: Store comments on memes with nested reply support

**Attributes**:
- `memeId` (String, 255) - ID of the meme being commented on
- `text` (String, 1000) - Comment text
- `author` (String, 255, optional) - Author name (for anonymous comments)
- `authorId` (String, 255, optional) - User ID (for authenticated comments)
- `parentId` (String, 255, optional) - ID of parent comment (for replies)
- `depth` (Integer, default: 0) - Nesting depth (0 = top-level, 1 = reply, 2 = reply to reply)
- `likes` (Integer, default: 0) - Number of likes on comment
- `repliesCount` (Integer, default: 0) - Number of direct replies
- `isAnonymous` (Boolean, default: true) - Whether comment is anonymous
- `createdAt` (DateTime) - When the comment was created
- `updatedAt` (DateTime) - When the comment was last updated

**Permissions**:
- **Create**: `any` (anyone can comment)
- **Read**: `any` (anyone can read comments)
- **Update**: `any` (anyone can update likes)
- **Delete**: `any` (anyone can delete their own comments)

#### Collection 3: `reactions`
**Purpose**: Store reactions to memes

**Attributes**:
- `memeId` (String, 255) - ID of the meme being reacted to
- `type` (String, 50) - Reaction type (like, laugh, love, wow, sad, angry)
- `author` (String, 255, optional) - Author name (for anonymous reactions)
- `authorId` (String, 255, optional) - User ID (for authenticated reactions)
- `isAnonymous` (Boolean, default: true) - Whether reaction is anonymous
- `createdAt` (DateTime) - When the reaction was created

**Permissions**:
- **Create**: `any` (anyone can react)
- **Read**: `any` (anyone can read reactions)
- **Update**: `any` (anyone can update their reactions)
- **Delete**: `any` (anyone can delete their own reactions)

#### Collection 4: `comment_reactions`
**Purpose**: Store reactions to comments

**Attributes**:
- `commentId` (String, 255) - ID of the comment being reacted to
- `type` (String, 50) - Reaction type (like, laugh, love, wow, sad, angry)
- `author` (String, 255, optional) - Author name (for anonymous reactions)
- `authorId` (String, 255, optional) - User ID (for authenticated reactions)
- `isAnonymous` (Boolean, default: true) - Whether reaction is anonymous
- `createdAt` (DateTime) - When the reaction was created

**Permissions**:
- **Create**: `any` (anyone can react to comments)
- **Read**: `any` (anyone can read comment reactions)
- **Update**: `any` (anyone can update their comment reactions)
- **Delete**: `any` (anyone can delete their own comment reactions)

## 6. Environment Variables

Create a `.env` file in your project root:

```env
VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id_here
VITE_APPWRITE_DATABASE_ID=your_database_id_here
VITE_APPWRITE_MEMES_COLLECTION_ID=memes
VITE_APPWRITE_COMMENTS_COLLECTION_ID=comments
VITE_APPWRITE_REACTIONS_COLLECTION_ID=reactions
VITE_APPWRITE_COMMENT_REACTIONS_COLLECTION_ID=comment_reactions
VITE_APPWRITE_STORAGE_BUCKET_ID=meme-images
```

The `src/lib/appwrite.ts` file is already configured to use these environment variables.

**Note:** Make sure to add `.env` to your `.gitignore` file to keep your credentials secure.

## 7. User Flow Design

### Anonymous Users (Default Experience)
- ✅ Can view all memes
- ✅ Can upload memes with optional name
- ✅ Can like, comment, and react to memes
- ✅ Can reply to comments
- ✅ No account required
- ✅ Data persists in browser (localStorage fallback)

### Authenticated Users (Enhanced Experience)
- ✅ All anonymous features
- ✅ Personal profile and avatar
- ✅ Follow other users
- ✅ Private messaging
- ✅ Personalized feed
- ✅ Save favorite memes
- ✅ Create collections
- ✅ Advanced search and filtering

### When to Prompt for Authentication
- User wants to follow someone
- User wants to create a collection
- User wants to save memes
- User wants to access advanced features
- User wants to sync data across devices

## 8. Database Indexes (Performance)

Create these indexes for better performance:

### For `memes` collection:
- `createdAt` (DESC) - For chronological feed
- `likes` (DESC) - For trending memes
- `authorId` (ASC) - For user's memes
- `isAnonymous` (ASC) - For filtering

### For `comments` collection:
- `memeId` (ASC) - For meme comments
- `parentId` (ASC) - For comment replies
- `createdAt` (DESC) - For chronological order

### For `reactions` collection:
- `memeId` (ASC) - For meme reactions
- `authorId` (ASC) - For user reactions
- `type` (ASC) - For reaction type filtering

## 9. Test Your Setup

1. Run `npm run dev`
2. Test anonymous meme upload
3. Test commenting and reactions
4. Test user registration/login
5. Verify image uploads work
6. Check that data persists correctly

## 10. Features Included

### Core Features
- ✅ Anonymous meme sharing
- ✅ Image upload with drag & drop
- ✅ Like, comment, and reaction system
- ✅ Comment replies (nested comments)
- ✅ Real-time updates
- ✅ Responsive design
- ✅ Modern UI with Tailwind CSS + shadcn/ui

### Advanced Features (When Authenticated)
- ✅ User profiles and avatars
- ✅ Personal meme collections
- ✅ Follow system
- ✅ Advanced search and filtering
- ✅ Data sync across devices

## 11. Next Steps

1. **Set up Appwrite** following this guide
2. **Test the anonymous flow** - upload memes, comment, react
3. **Implement authentication** - add user registration/login
4. **Add advanced features** - profiles, follow system, collections
5. **Optimize performance** - add pagination, caching
6. **Add moderation** - content filtering, reporting system wil