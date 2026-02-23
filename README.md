# AI-Powered YouTube Video Search with Tambo

A Next.js application with [Tambo AI](https://tambo.co) integration for intelligent YouTube video discovery. Ask Tambo about any topic and it will search YouTube, rate videos by relevance, and display them in a beautiful grid with an embedded video player.

<img width="1414" height="752" alt="image" src="https://github.com/user-attachments/assets/0f38e89c-d8cd-497c-a6d1-1a21c0159372" />


## Features

✨ **AI-Powered Video Search** - Search YouTube for any topic using natural language
🎯 **Smart Video Ranking** - AI rates and filters videos for relevance
▶️ **Embedded Video Player** - Click any thumbnail to watch with full YouTube controls
🔄 **Real-time Updates** - Watch video grid update instantly as Tambo searches
💬 **Generative AI Chat** - Talk to Tambo to discover, filter, and explore videos
🎨 **Modern UI** - Clean, responsive dashboard with dark mode support
🌐 **YouTube Integration** - Real-time video data from YouTube API
🧠 **Smart Behavior** - Tambo searches immediately without asking follow-up questions

## Quick Start

### 1. Setup Environment

```bash
# Copy example env file
cp example.env.local .env.local
```

Then add your API keys:
```env
NEXT_PUBLIC_TAMBO_API_KEY=your_tambo_api_key
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key  # Optional - uses mock data if not provided
```

Get your API keys:
- **Tambo API Key**: [tambo.co/dashboard](https://tambo.co/dashboard)
- **YouTube API Key**: [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000) in your browser.

## 🎯 How to Use

### Main Routes

| Route | Description |
|-------|-------------|
| `/` | Full chat interface with video search and player |

### Example Queries

Try asking Tambo any of these:

```
"Show me React tutorials"
"Find videos about machine learning for beginners"
"I want to learn Python async programming"
"Best practices for system design interviews"
"Web development tips and tricks"
"How to pass Amazon software engineer interviews"
"TypeScript advanced patterns"
"Next.js full-stack development"
```

### Workflow

<img width="1384" height="705" alt="image" src="https://github.com/user-attachments/assets/fadd8adb-4506-4f94-b9c6-da4fa1a65a74" />
<img width="1413" height="748" alt="image" src="https://github.com/user-attachments/assets/8dc3b88a-636d-40d2-a741-3ec8faf925e5" />


1. **Search** - Ask Tambo to find videos about any topic
2. **Browse** - View search results in a grid with video information
3. **Watch** - Click any thumbnail to watch the video with full controls
4. **Refine** - Ask Tambo to search again with different terms
5. **Discover** - Get recommendations and explore new topics

## 📚 Documentation

### Core Features

- **[QUICK_START.md](./QUICK_START.md)** - Quick reference with example queries
- **[SEARCH_BEHAVIOR_FIX.md](./SEARCH_BEHAVIOR_FIX.md)** - How Tambo behavior was optimized for immediate search
- **[VIDEO_PLAYER_IMPLEMENTATION.md](./VIDEO_PLAYER_IMPLEMENTATION.md)** - YouTube video player implementation details

### Architecture & Integration

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Component hierarchy and data flow
- **[VIDEO_UPDATE_IMPLEMENTATION.md](./VIDEO_UPDATE_IMPLEMENTATION.md)** - How videos update in real-time
- **[AI_VIDEO_SEARCH.md](./AI_VIDEO_SEARCH.md)** - AI-powered video search system

### YouTube API Setup

- **[YOUTUBE_API_SETUP.md](./YOUTUBE_API_SETUP.md)** - How to configure YouTube API
- **[YOUTUBE_API_STATUS.md](./YOUTUBE_API_STATUS.md)** - API status and troubleshooting
- **[YOUTUBE_DASHBOARD.md](./YOUTUBE_DASHBOARD.md)** - Dashboard setup and monitoring

### Development Guide

- **[CLAUDE.md](./CLAUDE.md)** - Development guidelines for the Tambo template
- **[TEST_QUERIES.md](./TEST_QUERIES.md)** - Test queries and expected results

## 🏗️ Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Home page
│   ├── layout.tsx               # Root layout with providers
│   ├── globals.css              # Global styles
│   └── chat/
│       └── page.tsx             # Main chat interface
├── components/
│   ├── MyDashboard.tsx          # Main dashboard container
│   ├── TrendingTechVideos.tsx   # Video grid and search
│   ├── VideoCard.tsx            # Individual video card
│   ├── YouTubePlayer.tsx        # Video player modal ⭐ NEW
│   ├── ChatSidebar.tsx          # Chat sidebar
│   ├── Tab.tsx                  # Tab navigation
│   ├── VideoGrid.tsx            # Grid layout
│   ├── VideoDescription.tsx     # Video metadata
│   ├── tambo/                   # Tambo components
│   │   ├── message-thread-full.tsx
│   │   ├── message-input.tsx
│   │   ├── message.tsx
│   │   ├── graph.tsx
│   │   └── ...
│   └── ui/
│       └── card-data.tsx
├── lib/
│   ├── tambo.ts                 # AI component & tool registration ⭐ UPDATED
│   ├── system-prompt.ts         # System prompt guide ⭐ NEW
│   ├── thread-hooks.ts          # Thread management
│   ├── use-anonymous-user-key.ts
│   └── utils.ts
├── services/
│   ├── youtube-videos.ts        # Video data service
│   ├── youtube-api.ts           # YouTube API integration
│   ├── video-actions.ts         # Video update callbacks
│   └── population-stats.ts      # Demo data
└── contexts/
    └── VideoContext.tsx         # Video state management
```

## 🔧 Configuration

### AI Search Behavior

The AI is configured to:
- **Search immediately** without asking follow-up questions
- **Extract intent** from user messages automatically
- **Rate results** using AI for relevance ranking
- **Update UI** in real-time as results arrive

See [SEARCH_BEHAVIOR_FIX.md](./SEARCH_BEHAVIOR_FIX.md) for implementation details.

### Register New AI Tools

Tools are registered in `src/lib/tambo.ts`:

```tsx
export const tools: TamboTool[] = [
  {
    name: "searchVideos",
    description: "PRIMARY TOOL FOR VIDEO SEARCH. ALWAYS use immediately...",
    tool: searchAndUpdateVideos,
    inputSchema: z.object({
      query: z.string().describe("User's search intent"),
      limit: z.number().optional().default(8),
      sortBy: z.enum(["relevance", "date", "viewCount", "rating"]).optional(),
      aiRating: z.boolean().optional().default(true),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string(),
      query: z.string(),
      videoCount: z.number(),
      topVideos: z.array(z.object({...})),
    }),
  },
  // Add more tools here
];
```

### Add New Components

Components are registered in `src/lib/tambo.ts`:

```tsx
export const components: TamboComponent[] = [
  {
    name: "Graph",
    description: "A component that renders various types of charts",
    component: Graph,
    propsSchema: graphSchema,
  },
  // Add more components here
];
```

## 🎬 Key Components

### YouTubePlayer
- **File**: `src/components/YouTubePlayer.tsx`
- **Purpose**: Display embedded YouTube videos in a modal
- **Features**:
  - Full YouTube embed with native controls
  - Autoplay enabled
  - Video metadata display
  - Dark theme design
  - Close button and responsive layout

### TrendingTechVideos
- **File**: `src/components/TrendingTechVideos.tsx`
- **Purpose**: Display video grid and handle search
- **Features**:
  - Category filtering
  - Real-time video updates
  - Click to play functionality
  - Loading states

### MyDashboard
- **File**: `src/components/MyDashboard.tsx`
- **Purpose**: Main container for dashboard and chat
- **Features**:
  - Tab navigation (Discover/Dashboard)
  - Video context management
  - Chat sidebar integration
  - Player state management

## 📋 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint checks |
| `npm run lint:fix` | Run ESLint with auto-fix |

## 🛠️ Tech Stack

### Framework & UI
- [Next.js](https://nextjs.org) 15 with App Router
- [React](https://react.dev) 19
- [TypeScript](https://www.typescriptlang.org/)

### AI & Integration
- [Tambo AI SDK](https://tambo.co) (`@tambo-ai/react`)
- [YouTube Data API v3](https://developers.google.com/youtube/v3)

### Styling & Components
- [Tailwind CSS](https://tailwindcss.com) v4
- [Lucide React](https://lucide.dev) - Icons
- [Recharts](https://recharts.org) - Data visualization

### Validation & Utils
- [Zod](https://zod.dev) - Schema validation
- [Framer Motion](https://motion.dev) - Animations

## 🚀 Performance Tips

1. **Limit videos per search**: Default is 8 videos (configurable)
2. **AI ranking enabled**: Uses AI to filter low-relevance videos
3. **Caching**: Video data is cached in component state
4. **Lazy loading**: Videos load as they come into view

## 🐛 Troubleshooting

### Videos not showing?
- Check that `NEXT_PUBLIC_YOUTUBE_API_KEY` is set in `.env.local`
- Verify the YouTube API is enabled in Google Cloud Console
- Check browser console for API errors

### Search not working?
- Verify `NEXT_PUBLIC_TAMBO_API_KEY` is set correctly
- Check that Tambo API is accessible from your network
- Ensure the chat has loaded completely

### Player not playing video?
- Check that video ID is valid (should be a YouTube video ID)
- Verify YouTube hasn't removed the video
- Clear browser cache and try again

### Can't find expected videos?
- Try more specific search queries
- Check the AI rating threshold in `AIVideoSearch.ts`
- Disable AI rating if mock data is being used

## 📖 Resources

### External Documentation
- **[Tambo Documentation](https://docs.tambo.co)** - Complete Tambo SDK docs
- **[YouTube API Docs](https://developers.google.com/youtube/v3)** - YouTube API reference
- **[Next.js Documentation](https://nextjs.org/docs)** - Next.js guide
- **[React Documentation](https://react.dev)** - React reference
- **[Tailwind CSS](https://tailwindcss.com/docs)** - Styling guide

### Project Files
- **[QUICK_START.md](./QUICK_START.md)** - Quick reference guide
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture
- **[AI_VIDEO_SEARCH.md](./AI_VIDEO_SEARCH.md)** - Search algorithm details
- **[SEARCH_BEHAVIOR_FIX.md](./SEARCH_BEHAVIOR_FIX.md)** - Tambo optimization
- **[VIDEO_PLAYER_IMPLEMENTATION.md](./VIDEO_PLAYER_IMPLEMENTATION.md)** - Player details
- **[YOUTUBE_API_SETUP.md](./YOUTUBE_API_SETUP.md)** - API configuration
- **[TEST_QUERIES.md](./TEST_QUERIES.md)** - Test examples

## 💡 Contributing

To contribute improvements:

1. Create a feature branch
2. Make your changes
3. Update relevant documentation files
4. Test thoroughly
5. Submit a pull request

## 📝 License

MIT - Feel free to use this project as a starting point for your own applications.

## 🤝 Support

- **Issues**: Check existing documentation files
- **Tambo Help**: [Tambo Discord](https://tambo.co/community)
- **YouTube API Issues**: [Google Cloud Support](https://cloud.google.com/support)

---

**Happy video searching!** 🎥✨
