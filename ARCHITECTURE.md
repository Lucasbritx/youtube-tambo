# Video Update Architecture

## Component Hierarchy

```
App
└── TamboProvider
    └── MyDashboard (wrapped with VideoProvider)
        ├── VideoProvider (Context)
        │   └── DashboardContent
        │       ├── Tab: Discover
        │       ├── Tab: Dashboard
        │       ├── Content Area
        │       │   └── TrendingTechVideos
        │       │       └── VideoGrid (8 VideoCards)
        │       └── ChatSidebar (Tambo Chat)
        └── Callback Registration
            └── video-actions.registerVideoUpdateCallback()
```

## Data Flow

### 1. Initial Load
```
DashboardContent mounts
    ↓
Registers updateVideos callback
    ↓
TrendingTechVideos fetches default videos
    ↓
Displays 8 trending tech videos
```

### 2. User Query (via Chat)
```
User types: "Show me React videos"
    ↓
Tambo AI processes request
    ↓
Calls searchVideos({ category: "React" })
    ↓
searchAndUpdateVideos() executes
    ├── Fetches videos from YouTube API
    ├── Calls registered callback: updateVideos(videos)
    └── Returns summary message
    ↓
VideoContext updates state
    ↓
TrendingTechVideos re-renders with new videos
    ↓
User sees updated grid + chat confirmation
```

## State Management

### VideoContext State
```typescript
{
  videos: Video[],              // Current videos to display
  setVideos: (videos) => void,  // Direct setter
  selectedCategory: string | null,
  setSelectedCategory: (cat) => void,
  updateVideos: (videos) => void  // Callback-friendly updater
}
```

### Callback Pattern
```typescript
// In video-actions.ts
let updateVideosCallback: ((videos: Video[]) => void) | null = null;

export function registerVideoUpdateCallback(callback) {
  updateVideosCallback = callback;
}

export async function searchAndUpdateVideos(params) {
  const videos = await getTrendingVideos(params);
  
  // Update UI via callback
  if (updateVideosCallback) {
    updateVideosCallback(videos);
  }
  
  return { success: true, message: "...", ... };
}
```

### Dashboard Registration
```typescript
function DashboardContent() {
  const { updateVideos } = useVideoContext();
  
  React.useEffect(() => {
    // Register on mount
    registerVideoUpdateCallback(updateVideos);
    
    // Cleanup on unmount
    return () => unregisterVideoUpdateCallback();
  }, [updateVideos]);
}
```

## Tambo Tool Configuration

### searchVideos Tool
```typescript
{
  name: "searchVideos",
  description: "Search for YouTube videos and UPDATE the main video list...",
  tool: searchAndUpdateVideos,
  inputSchema: z.object({
    category: z.string().optional(),
    limit: z.number().optional(),
    sortBy: z.enum(["views", "recent", "rating"]).optional(),
    useRealApi: z.boolean().optional(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
    videoCount: z.number(),
    category: z.string(),
    videos: z.array(z.object({
      title: z.string(),
      channel: z.string(),
      views: z.string(),
    })),
  }),
}
```

### AI Decision Tree
```
User says "show me videos"
    ↓
Is user asking to DISPLAY videos?
    ├── YES → Use searchVideos() → Updates main grid
    └── NO → Is it for analytics?
        ├── YES → Use trendingVideos() → Returns data
        └── NO → Use videoAnalytics() → Returns stats
```

## Communication Flow

```
┌─────────────────┐
│   User Input    │
│  (Chat Sidebar) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Tambo AI      │
│  (Processes)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ searchVideos()  │
│   (Tool Call)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│YouTube API Call │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Video Data      │
└────────┬────────┘
         │
         ├─────────────┐
         │             │
         ▼             ▼
┌────────────┐   ┌─────────────┐
│ Callback   │   │ Return to   │
│ (Update UI)│   │ AI (Message)│
└──────┬─────┘   └──────┬──────┘
       │                │
       ▼                ▼
┌─────────────┐   ┌─────────────┐
│ Main Grid   │   │ Chat Reply  │
│ (Updates)   │   │ (Confirms)  │
└─────────────┘   └─────────────┘
```

## Why This Pattern?

### ✅ Advantages
1. **Separation of Concerns**: Tools don't need React dependencies
2. **Type Safety**: Full TypeScript support throughout
3. **Testability**: Easy to test without React components
4. **Flexibility**: Can update UI from anywhere
5. **Clean Chat**: No bulky components in chat
6. **Better UX**: Videos in main area, not sidebar

### ⚠️ Considerations
1. **Global State**: Uses module-level callback (not pure React)
2. **Single Instance**: Only one dashboard can be active
3. **Cleanup**: Must unregister on unmount

### Alternative Approaches Considered

❌ **Pass updateVideos as tool parameter**
- Problem: Tambo tools can't accept functions

❌ **Use Tambo component state**
- Problem: Need to update external component, not chat

❌ **Custom events/EventEmitter**
- More complex, same result

✅ **Callback pattern** (chosen)
- Simple, direct, type-safe
- Works with Tambo's tool system
- Easy to debug

## File Dependencies

```
src/
├── contexts/
│   └── VideoContext.tsx
│       └── Exports: useVideoContext, VideoProvider
├── services/
│   ├── youtube-api.ts
│   │   └── Direct YouTube API calls
│   ├── youtube-videos.ts
│   │   └── Video data transformation
│   └── video-actions.ts
│       └── Exports: searchAndUpdateVideos, register/unregister
├── lib/
│   └── tambo.ts
│       └── Registers searchVideos tool
└── components/
    ├── MyDashboard.tsx
    │   └── Uses: VideoProvider, registerCallback
    ├── TrendingTechVideos.tsx
    │   └── Displays videos from props or fetches
    └── VideoCard.tsx
        └── Individual video display
```

## Error Handling

```typescript
async function searchAndUpdateVideos(params) {
  try {
    const videos = await getTrendingVideos(params);
    
    if (updateVideosCallback) {
      updateVideosCallback(videos);
    } else {
      console.warn('No video update callback registered');
    }
    
    return { success: true, ... };
  } catch (error) {
    console.error('Failed to fetch videos:', error);
    return {
      success: false,
      message: 'Failed to fetch videos. Please try again.',
      videoCount: 0,
      category: params?.category || 'All',
      videos: []
    };
  }
}
```

---

**Last Updated**: February 23, 2026  
**Status**: ✅ Implemented and tested
