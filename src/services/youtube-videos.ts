/**
 * @file youtube-videos.ts
 * @description YouTube video data service with real API integration and mock fallback
 */

import {
  searchYouTubeVideos,
  getTrendingVideosByCategory as getYouTubeTrendingByCategory,
  getYouTubeVideoById,
  getTimeAgo,
  type YouTubeVideo,
} from './youtube-api';

export interface Video {
  id: string;
  rank: number;
  thumbnail: string;
  title: string;
  channel: string;
  views: string;
  timeAgo: string;
  rating: 'Excellent' | 'Good';
  category?: string;
  description?: string;
}

const mockVideos: Video[] = [
  {
    id: '1',
    rank: 1,
    thumbnail: 'https://picsum.photos/seed/video1/400/225',
    title: 'Why Replacing Developers with AI is a Bad Idea',
    channel: 'MACKARD',
    views: '2.0M views',
    timeAgo: '1 weeks ago',
    rating: 'Excellent',
    category: 'AI & ML',
    description: 'An in-depth analysis of why AI cannot fully replace human developers and the importance of human creativity in software development.'
  },
  {
    id: '2',
    rank: 2,
    thumbnail: 'https://picsum.photos/seed/video2/400/225',
    title: 'The wild rise of OpenClaw',
    channel: 'FIRESHIP',
    views: '1.3M views',
    timeAgo: '1 weeks ago',
    rating: 'Excellent',
    category: 'Open Source',
    description: 'Exploring the rapid growth and adoption of OpenClaw, a new open-source AI framework.'
  },
  {
    id: '3',
    rank: 3,
    thumbnail: 'https://picsum.photos/seed/video3/400/225',
    title: 'A brief history of programming languages',
    channel: 'FIRESHIP',
    views: '591K views',
    timeAgo: '3 weeks ago',
    rating: 'Excellent',
    category: 'Tech Careers',
    description: 'A comprehensive overview of how programming languages evolved from assembly to modern high-level languages.'
  },
  {
    id: '4',
    rank: 4,
    thumbnail: 'https://picsum.photos/seed/video4/400/225',
    title: "Claude Code's New Agent Teams Are Revolutionary",
    channel: 'BART SLODYCZKA',
    views: '140K views',
    timeAgo: '5 days ago',
    rating: 'Excellent',
    category: 'AI & ML',
    description: 'Discover how Claude AI\'s new agent teams feature is changing the landscape of AI-assisted development.'
  },
  {
    id: '5',
    rank: 5,
    thumbnail: 'https://picsum.photos/seed/video5/400/225',
    title: "I Read Honey's Source Code and Here's What I Found",
    channel: 'THE PRIMETIME',
    views: '879K views',
    timeAgo: '3 weeks ago',
    rating: 'Excellent',
    category: 'Web Dev',
    description: 'A detailed code review of the Honey browser extension revealing interesting implementation details.'
  },
  {
    id: '6',
    rank: 6,
    thumbnail: 'https://picsum.photos/seed/video6/400/225',
    title: 'Cursor Is Lying To Developers About This Feature',
    channel: 'BASIC DEV',
    views: '291K views',
    timeAgo: '2 weeks ago',
    rating: 'Excellent',
    category: 'Tech Careers',
    description: 'Investigating controversial claims about Cursor AI and what developers need to know.'
  },
  {
    id: '7',
    rank: 7,
    thumbnail: 'https://picsum.photos/seed/video7/400/225',
    title: 'Learning to code has changed forever',
    channel: 'TECH WITH TIM',
    views: '136K views',
    timeAgo: '1 weeks ago',
    rating: 'Excellent',
    category: 'Tech Careers',
    description: 'How AI tools and new learning platforms are revolutionizing the way people learn programming.'
  },
  {
    id: '8',
    rank: 8,
    thumbnail: 'https://picsum.photos/seed/video8/400/225',
    title: 'The Best Place to Learn AI in 2026?',
    channel: 'JASON WEST',
    views: '181K views',
    timeAgo: '1 weeks ago',
    rating: 'Good',
    category: 'AI & ML',
    description: 'Comparing top AI learning platforms and resources for aspiring AI engineers in 2026.'
  },
  {
    id: '9',
    rank: 9,
    thumbnail: 'https://picsum.photos/seed/video9/400/225',
    title: 'React 19 - Everything You Need to Know',
    channel: 'FIRESHIP',
    views: '2.5M views',
    timeAgo: '2 weeks ago',
    rating: 'Excellent',
    category: 'React',
    description: 'A comprehensive guide to all the new features and improvements in React 19.'
  },
  {
    id: '10',
    rank: 10,
    thumbnail: 'https://picsum.photos/seed/video10/400/225',
    title: 'JavaScript Performance Tips That Actually Work',
    channel: 'WEB DEV SIMPLIFIED',
    views: '450K views',
    timeAgo: '1 weeks ago',
    rating: 'Excellent',
    category: 'JavaScript',
    description: 'Proven techniques to optimize JavaScript performance in modern web applications.'
  }
];

/**
 * Check if YouTube API is configured
 */
function isYouTubeApiConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_YOUTUBE_API_KEY && 
         process.env.NEXT_PUBLIC_YOUTUBE_API_KEY !== 'your_youtube_api_key_here';
}

/**
 * Convert YouTube API video to our Video format
 */
function convertYouTubeVideoToVideo(youtubeVideo: YouTubeVideo, rank: number): Video {
  // Calculate rating based on like count and view count
  const likes = parseInt(youtubeVideo.likeCount, 10) || 0;
  const views = parseInt(youtubeVideo.viewCount.replace(/[^\d]/g, ''), 10) || 1;
  const likeRatio = likes / views;
  const rating: 'Excellent' | 'Good' = likeRatio > 0.05 ? 'Excellent' : 'Good';

  return {
    id: youtubeVideo.id,
    rank,
    thumbnail: youtubeVideo.thumbnails.high?.url || youtubeVideo.thumbnails.medium.url,
    title: youtubeVideo.title,
    channel: youtubeVideo.channelTitle,
    views: youtubeVideo.viewCount,
    timeAgo: getTimeAgo(youtubeVideo.publishedAt),
    rating,
    description: youtubeVideo.description,
  };
}

export interface GetTrendingVideosParams {
  category?: string;
  limit?: number;
  sortBy?: 'views' | 'recent' | 'rating';
  useRealApi?: boolean;
}

/**
 * Get trending tech videos with optional filtering
 */
export async function getTrendingVideos(params?: GetTrendingVideosParams): Promise<Video[]> {
  const useRealApi = params?.useRealApi !== false && isYouTubeApiConfigured();

  if (useRealApi) {
    try {
      let youtubeVideos: YouTubeVideo[];

      if (params?.category) {
        // Get videos by category
        youtubeVideos = await getYouTubeTrendingByCategory(
          params.category,
          params?.limit || 10
        );
      } else {
        // Get general trending tech videos
        youtubeVideos = await searchYouTubeVideos({
          query: 'trending tech programming software development',
          maxResults: params?.limit || 10,
          order: params?.sortBy === 'recent' ? 'date' : 'viewCount',
        });
      }

      // Convert to our format and add ranks
      return youtubeVideos.map((video, index) => 
        convertYouTubeVideoToVideo(video, index + 1)
      );
    } catch (error) {
      console.error('Failed to fetch from YouTube API, falling back to mock data:', error);
      // Fall through to mock data
    }
  }

  // Use mock data (fallback or if API not configured)
  let videos = [...mockVideos];

  // Filter by category
  if (params?.category) {
    videos = videos.filter(v => v.category === params.category);
  }

  // Sort videos
  if (params?.sortBy === 'views') {
    videos.sort((a, b) => {
      const aViews = parseViews(a.views);
      const bViews = parseViews(b.views);
      return bViews - aViews;
    });
  } else if (params?.sortBy === 'rating') {
    videos.sort((a, b) => {
      if (a.rating === 'Excellent' && b.rating !== 'Excellent') return -1;
      if (a.rating !== 'Excellent' && b.rating === 'Excellent') return 1;
      return 0;
    });
  }

  // Limit results
  if (params?.limit) {
    videos = videos.slice(0, params.limit);
  }

  return videos;
}

/**
 * Get video analytics summary
 */
export async function getVideoAnalytics() {
  const videos = await getTrendingVideos({ limit: 50 });
  const totalViews = videos.reduce((sum, video) => sum + parseViews(video.views), 0);
  const excellentCount = videos.filter(v => v.rating === 'Excellent').length;
  
  return {
    totalVideos: videos.length,
    totalViews: formatViews(totalViews),
    excellentRating: excellentCount,
    averageViews: formatViews(totalViews / videos.length),
    categories: ['React', 'AI & ML', 'JavaScript', 'Tech Careers', 'Web Dev', 'Open Source']
  };
}

/**
 * Get video by ID
 */
export async function getVideoById(id: string): Promise<Video | null> {
  const useRealApi = isYouTubeApiConfigured();

  if (useRealApi) {
    try {
      const youtubeVideo = await getYouTubeVideoById(id);
      if (youtubeVideo) {
        return convertYouTubeVideoToVideo(youtubeVideo, 0);
      }
    } catch (error) {
      console.error('Failed to fetch video from YouTube API:', error);
    }
  }

  // Fallback to mock data
  return mockVideos.find(v => v.id === id) || null;
}

// Helper functions
function parseViews(viewString: string): number {
  const match = viewString.match(/([0-9.]+)([KM]?)/);
  if (!match) return 0;
  
  const num = parseFloat(match[1]);
  const multiplier = match[2] === 'K' ? 1000 : match[2] === 'M' ? 1000000 : 1;
  
  return num * multiplier;
}

function formatViews(views: number): string {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M views`;
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(0)}K views`;
  }
  return `${views} views`;
}
