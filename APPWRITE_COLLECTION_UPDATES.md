# Appwrite Collection Updates Required

## Comments Collection Updates

### Add New Attribute: `dislikes`
- **Attribute ID**: `dislikes`
- **Type**: `integer`
- **Size**: `8` (for 64-bit integer)
- **Default**: `0`
- **Required**: `true`
- **Array**: `false`

### Current Comments Collection Schema
```
comments:
  - $id (string, auto-generated)
  - $createdAt (datetime, auto-generated)
  - $updatedAt (datetime, auto-generated)
  - memeId (string, required)
  - text (string, required)
  - author (string, optional)
  - authorId (string, optional)
  - parentId (string, optional)
  - depth (integer, required, default: 0)
  - likes (integer, required, default: 0)
  - dislikes (integer, required, default: 0) ← NEW
  - repliesCount (integer, required, default: 0)
  - isAnonymous (boolean, required, default: true)
  - timestamp (datetime, required)
```

## Comment Reactions Collection Updates

### Add New Attributes:
1. **`type` enum update** - Add `dislike` to existing enum
2. **`likesCount`** - Total likes for this comment
3. **`dislikesCount`** - Total dislikes for this comment

### Updated Comment Reactions Collection Schema
```
comment_reactions:
  - $id (string, auto-generated)
  - $createdAt (datetime, auto-generated)
  - $updatedAt (datetime, auto-generated)
  - commentId (string, required)
  - type (enum, required) ← UPDATE: add "dislike" to existing enum
  - likesCount (integer, required, default: 0) ← NEW
  - dislikesCount (integer, required, default: 0) ← NEW
  - author (string, optional)
  - authorId (string, optional)
  - isAnonymous (boolean, required, default: true)
  - timestamp (datetime, required)
```

## Memes Collection Updates

### Add New Attributes:
1. **`dislikes`** - Total dislikes for this meme
2. **`likesCount`** - Total likes count (if not already present)
3. **`dislikesCount`** - Total dislikes count

### Updated Memes Collection Schema
```
memes:
  - $id (string, auto-generated)
  - $createdAt (datetime, auto-generated)
  - $updatedAt (datetime, auto-generated)
  - imageId (string, required)
  - imageUrl (string, required)
  - caption (string, optional)
  - author (string, optional)
  - authorId (string, optional)
  - likes (integer, required, default: 0)
  - dislikes (integer, required, default: 0) ← NEW
  - likesCount (integer, required, default: 0) ← NEW
  - dislikesCount (integer, required, default: 0) ← NEW
  - commentsCount (integer, required, default: 0)
  - reactionsCount (integer, required, default: 0)
  - isAnonymous (boolean, required, default: true)
  - timestamp (datetime, required)
```

## Service Updates Required

### Comment Service Functions to Update

1. **createCommentReaction()** - Update to handle like/dislike separately
2. **getCommentReactions()** - Filter by reaction type
3. **deleteCommentReaction()** - Handle both like and dislike removal
4. **updateCommentCounts()** - Update both likes and dislikes counts

### New Service Functions Needed

1. **likeComment(commentId: string)** - Increment likes, decrement dislikes if exists
2. **dislikeComment(commentId: string)** - Increment dislikes, decrement likes if exists
3. **removeCommentReaction(commentId: string, type: 'like' | 'dislike')** - Remove specific reaction

## Database Permissions

### Comments Collection Permissions
- **Create**: `any` (for anonymous comments)
- **Read**: `any` (public read access)
- **Update**: `any` (for updating counts)
- **Delete**: `any` (for comment deletion)

### Comment Reactions Collection Permissions
- **Create**: `any` (for anonymous reactions)
- **Read**: `any` (public read access)
- **Update**: `any` (for updating reactions)
- **Delete**: `any` (for removing reactions)

## Migration Steps

1. **Add `dislikes` attribute to comments collection**
2. **Update comment_reactions collection schema**
3. **Update existing comment records** (set dislikes = 0 for existing comments)
4. **Update service functions** to handle separate like/dislike logic
5. **Test the new functionality** with both like and dislike buttons

## Example Data Structure

### Comment with Likes and Dislikes
```json
{
  "$id": "comment123",
  "memeId": "meme456",
  "text": "This is a great comment!",
  "author": "Anonymous",
  "likes": 5,
  "dislikes": 2,
  "repliesCount": 1,
  "isAnonymous": true,
  "timestamp": "2024-01-15T10:30:00Z",
  "$createdAt": "2024-01-15T10:30:00Z"
}
```

### Comment Reaction
```json
{
  "$id": "reaction789",
  "commentId": "comment123",
  "reactionType": "like",
  "author": "Anonymous",
  "isAnonymous": true,
  "timestamp": "2024-01-15T10:35:00Z",
  "$createdAt": "2024-01-15T10:35:00Z"
}
```

## Frontend Updates Completed

✅ **Comment Interface** - Added `dislikes: number` field
✅ **Dummy Data** - Updated all comments with dislike counts
✅ **UI Components** - Updated CommentItem to show separate like/dislike counts
✅ **Color Coding** - Green for likes, red for dislikes
✅ **Voting Buttons** - Separate upvote/downvote buttons with counts

## Next Steps

1. Update Appwrite collections as described above
2. Update comment service functions
3. Test the like/dislike functionality
4. Deploy and verify everything works correctly
