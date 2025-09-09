# Meme Vault - Deployment Guide

## Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/meme-vault)

## Prerequisites

1. **Appwrite Account**: Sign up at [cloud.appwrite.io](https://cloud.appwrite.io)
2. **Node.js**: Version 18 or higher
3. **Git**: For version control

## Environment Setup

1. Copy the environment template:
   ```bash
   cp env.example .env
   ```

2. Fill in your Appwrite credentials in `.env`:
   ```env
   VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   VITE_APPWRITE_PROJECT_ID=your_project_id_here
   VITE_APPWRITE_DATABASE_ID=meme-vault
   VITE_APPWRITE_MEMES_COLLECTION_ID=memes
   VITE_APPWRITE_COMMENTS_COLLECTION_ID=comments
   VITE_APPWRITE_REACTIONS_COLLECTION_ID=reactions
   VITE_APPWRITE_COMMENT_REACTIONS_COLLECTION_ID=comment_reactions
   VITE_APPWRITE_STORAGE_BUCKET_ID=meme-images
   ```

## Appwrite Setup

Follow the detailed setup guide in [APPWRITE_SETUP.md](./APPWRITE_SETUP.md) to configure your Appwrite project with the required collections and permissions.

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment Options

### 1. Vercel (Recommended)

1. **Connect Repository**:
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Vercel will automatically detect it's a Vite project

2. **Environment Variables**:
   - Add all your environment variables in Vercel dashboard
   - Go to Project Settings → Environment Variables
   - Add each variable from your `.env` file

3. **Deploy**:
   - Vercel will automatically deploy on every push to main branch
   - Custom domain can be configured in project settings

### 2. Netlify

1. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Environment Variables**:
   - Add environment variables in Site Settings → Environment Variables

3. **Deploy**:
   - Connect your Git repository
   - Netlify will build and deploy automatically

### 3. GitHub Pages

1. **Add GitHub Actions**:
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm ci
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

2. **Environment Variables**:
   - Add secrets in repository settings
   - Use `${{ secrets.VARIABLE_NAME }}` in workflow

### 4. Self-Hosted

1. **Build the project**:
   ```bash
   npm run build:prod
   ```

2. **Serve the dist folder**:
   - Use any static file server (nginx, Apache, etc.)
   - Or use a simple server: `npx serve dist`

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_APPWRITE_ENDPOINT` | Your Appwrite API endpoint | Yes |
| `VITE_APPWRITE_PROJECT_ID` | Your Appwrite project ID | Yes |
| `VITE_APPWRITE_DATABASE_ID` | Database ID (usually 'meme-vault') | Yes |
| `VITE_APPWRITE_MEMES_COLLECTION_ID` | Memes collection ID | Yes |
| `VITE_APPWRITE_COMMENTS_COLLECTION_ID` | Comments collection ID | Yes |
| `VITE_APPWRITE_REACTIONS_COLLECTION_ID` | Reactions collection ID | Yes |
| `VITE_APPWRITE_COMMENT_REACTIONS_COLLECTION_ID` | Comment reactions collection ID | Yes |
| `VITE_APPWRITE_STORAGE_BUCKET_ID` | Storage bucket for images | Yes |
| `VITE_DEBUG_MODE` | Enable debug logging (optional) | No |

## Post-Deployment Checklist

- [ ] Appwrite project is configured with all collections
- [ ] Environment variables are set in deployment platform
- [ ] Storage bucket permissions are set to public read
- [ ] Database collections have correct permissions
- [ ] Test anonymous meme upload
- [ ] Test commenting and reactions
- [ ] Test user authentication (if enabled)
- [ ] Verify responsive design on mobile
- [ ] Check console for any errors

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure your domain is added to Appwrite's allowed origins
   - Check Appwrite project settings

2. **Environment Variables Not Loading**:
   - Ensure variables start with `VITE_`
   - Restart development server after adding variables
   - Check deployment platform environment variable settings

3. **Build Failures**:
   - Run `npm run type-check` to check for TypeScript errors
   - Run `npm run lint` to check for linting errors
   - Ensure all dependencies are installed

4. **Image Upload Issues**:
   - Check storage bucket permissions
   - Verify file size limits
   - Check allowed file extensions

### Getting Help

- Check the [Appwrite Documentation](https://appwrite.io/docs)
- Review the [APPWRITE_SETUP.md](./APPWRITE_SETUP.md) guide
- Check browser console for error messages
- Verify network requests in browser dev tools

## Performance Optimization

- Images are automatically optimized by Vite
- Code is split into chunks for better loading
- Static assets are cached with proper headers
- Consider implementing image compression for large uploads

## Security Notes

- Never commit `.env` files to version control
- Use environment variables for all sensitive data
- Regularly update dependencies
- Monitor Appwrite usage and set appropriate limits
- Consider implementing rate limiting for production use