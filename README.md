# Meme Vault 🎭

A modern, anonymous meme sharing platform built with React, TypeScript, and Appwrite. Share memes, comment, react, and have fun without needing to create an account!

## ✨ Features

- 🎭 **Anonymous Sharing**: Upload and share memes without creating an account
- 💬 **Real-time Comments**: Comment on memes with nested reply support
- 😂 **Reactions**: Express yourself with like, laugh, love, wow, sad, and angry reactions
- 📱 **Responsive Design**: Beautiful UI that works on all devices
- ⚡ **Real-time Updates**: See new memes and comments instantly
- 🔒 **Privacy First**: No personal data collection, completely anonymous

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- An Appwrite account ([cloud.appwrite.io](https://cloud.appwrite.io))

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd meme-vault
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
cp env.example .env
```

Edit `.env` with your Appwrite credentials:

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

### 3. Set Up Appwrite

Follow the detailed guide in [APPWRITE_SETUP.md](./APPWRITE_SETUP.md) to configure your Appwrite project.

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your app!

## 📚 Documentation

- [**Appwrite Setup Guide**](./APPWRITE_SETUP.md) - Complete Appwrite configuration
- [**Deployment Guide**](./DEPLOYMENT.md) - Deploy to Vercel, Netlify, or GitHub Pages
- [**GitHub Setup**](./GITHUB_SETUP.md) - Repository setup instructions

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:prod   # Production build with optimizations
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run type-check   # Check TypeScript types
```

## 🏗️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Appwrite (Database, Storage, Real-time)
- **State Management**: React Context + Custom Hooks
- **Icons**: Lucide React

## 🎨 UI Components

Built with [shadcn/ui](https://ui.shadcn.com/) components:
- Cards, Buttons, Dialogs
- Input fields and Textareas
- Avatar components
- Skeleton loaders

## 🔧 Development

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── MemeCard.tsx    # Meme display component
│   ├── MemeUpload.tsx  # Upload component
│   └── ...
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── lib/                # Utilities and configurations
├── services/           # API services
├── types/              # TypeScript type definitions
└── utils/              # Helper functions
```

### Key Features Implementation

- **Anonymous Users**: Device fingerprinting for persistent experience
- **Real-time Updates**: WebSocket connections via Appwrite
- **Image Upload**: Drag & drop with preview
- **Comment System**: Nested replies with real-time updates
- **Reaction System**: Multiple reaction types with counts

## 🚀 Deployment

The app is ready for deployment on:
- **Vercel** (Recommended)
- **Netlify**
- **GitHub Pages**
- **Any static hosting service**

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Troubleshooting

### Common Issues

1. **Appwrite Connection Error**: Check your environment variables
2. **Build Failures**: Run `npm run type-check` and `npm run lint`
3. **Image Upload Issues**: Verify storage bucket permissions

### Getting Help

- Check the [Appwrite Documentation](https://appwrite.io/docs)
- Review the setup guides in this repository
- Open an issue for bugs or feature requests

## 🎯 Roadmap

- [ ] User authentication (optional)
- [ ] Meme collections and favorites
- [ ] Advanced search and filtering
- [ ] Moderation tools
- [ ] Mobile app (React Native)

---

**Happy Meme Sharing!** 🎭✨