# Environment Setup Instructions

## 1. Create .env file

Create a `.env` file in your project root with the following content:

```env
# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_actual_project_id_here
VITE_APPWRITE_DATABASE_ID=your_actual_database_id_here
VITE_APPWRITE_MEMES_COLLECTION_ID=memes
VITE_APPWRITE_COMMENTS_COLLECTION_ID=comments
VITE_APPWRITE_REACTIONS_COLLECTION_ID=reactions
VITE_APPWRITE_STORAGE_BUCKET_ID=meme-images
```

## 2. Get Your Appwrite Details

1. Go to your Appwrite console
2. Select your project
3. Go to **Settings** → **General**
4. Copy your **Project ID** and replace `your_actual_project_id_here` in the .env file
5. Your endpoint should be `https://cloud.appwrite.io/v1` (for cloud) or your custom endpoint

## 3. Verify Your Database Setup

Make sure you have created these in your Appwrite console:

### Database: `meme-vault`
### Collections:
- `memes` (with all the attributes from the setup guide)
- `comments` (with all the attributes from the setup guide)  
- `reactions` (with all the attributes from the setup guide)

### Storage Bucket: `meme-images`
- Permissions: Create/Read/Update/Delete = `any`
- File size limit: 10MB
- Allowed extensions: jpg, jpeg, png, gif, webp

## 4. Test the Integration

Once you've set up the .env file, run:

```bash
npm run dev
```

The app should now connect to your Appwrite backend!
