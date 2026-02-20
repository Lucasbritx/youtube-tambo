/**
 * @file youtube-api.ts
 * @description YouTube Data API v3 integration service
 */

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  channelId: string;
  channelTitle: string;
  thumbnails: {
    default: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    high: { url: string; width: number; height: number };
    standard?: { url: string; width: number; height: number };
    maxres?: { url: string; width: number; height: number };
  };
  publishedAt: string;
  viewCount: string;
  likeCount: string;
  commentCount: string;
  duration: string;
  tags?: string[];
}

export interface YouTubeSearchParams {
  query?: string;
  category?: string;
  maxResults?: number;
  order?: 'date' | 'rating' | 'relevance' | 'viewCount';
  publishedAfter?: string;
  publishedBefore?: string;
  videoDuration?: 'short' | 'medium' | 'long' | 'any';
  regionCode?: string;
}

export interface YouTubeVideoStatistics {
  viewCount: string;
  likeCount: string;
  commentCount: string;
  favoriteCount: string;
}

const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

/**
 * Get YouTube API key from environment
 */
function getApiKey(): string {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error(
      'YouTube API key not found. Please set NEXT_PUBLIC_YOUTUBE_API_KEY in your .env.local file'
    );
  }
  return apiKey;
}

/**
 * Format duration from ISO 8601 to readable format
 */
function formatDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '0:00';

  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');

  if (hours) {
    return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
  }
  return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
}

/**
 * Format view count to readable format
 */
function formatViewCount(count: string): string {
  const num = parseInt(count, 10);
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M views`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K views`;
  }
  return `${num} views`;
}

/**
 * Calculate time ago from publish date
 */
function getTimeAgo(publishedAt: string): string {
  const now = new Date();
  const published = new Date(publishedAt);
  const diffMs = now.getTime() - published.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffYears > 0) {
    return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
  }
  if (diffMonths > 0) {
    return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
  }
  if (diffWeeks > 0) {
    return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
  }
  if (diffDays > 0) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  }
  return 'Today';
}

/**
 * Search for videos on YouTube
 */
export async function searchYouTubeVideos(
  params: YouTubeSearchParams = {}
): Promise<YouTubeVideo[]> {
  const apiKey = getApiKey();
  const {
    query = 'trending tech programming',
    maxResults = 10,
    order = 'viewCount',
    videoDuration = 'any',
    regionCode = 'US',
  } = params;

  try {
    // Step 1: Search for videos
    const searchParams = new URLSearchParams({
      part: 'snippet',
      maxResults: maxResults.toString(),
      q: query,
      type: 'video',
      order,
      videoDuration,
      regionCode,
      key: apiKey,
    });

    if (params.publishedAfter) {
      searchParams.append('publishedAfter', params.publishedAfter);
    }
    if (params.publishedBefore) {
      searchParams.append('publishedBefore', params.publishedBefore);
    }

    const searchResponse = await fetch(
      `${YOUTUBE_API_BASE_URL}/search?${searchParams.toString()}`
    );

    if (!searchResponse.ok) {
      const error = await searchResponse.json();
      throw new Error(`YouTube API error: ${error.error?.message || 'Unknown error'}`);
    }

    const searchData = await searchResponse.json();
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');

    if (!videoIds) {
      return [];
    }

    // Step 2: Get video details including statistics
    const videoParams = new URLSearchParams({
      part: 'snippet,contentDetails,statistics',
      id: videoIds,
      key: apiKey,
    });

    const videoResponse = await fetch(
      `${YOUTUBE_API_BASE_URL}/videos?${videoParams.toString()}`
    );

    if (!videoResponse.ok) {
      throw new Error('Failed to fetch video details');
    }

    const videoData = await videoResponse.json();

    // Transform to our format
    return videoData.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      channelId: item.snippet.channelId,
      channelTitle: item.snippet.channelTitle,
      thumbnails: item.snippet.thumbnails,
      publishedAt: item.snippet.publishedAt,
      viewCount: formatViewCount(item.statistics.viewCount),
      likeCount: item.statistics.likeCount || '0',
      commentCount: item.statistics.commentCount || '0',
      duration: formatDuration(item.contentDetails.duration),
      tags: item.snippet.tags || [],
    }));
  } catch (error) {
    console.error('YouTube API Error:', error);
    throw error;
  }
}

/**
 * Get trending videos by category
 */
export async function getTrendingVideosByCategory(
  category: string,
  maxResults: number = 10
): Promise<YouTubeVideo[]> {
  const categoryQueries: Record<string, string> = {
    'React': 'React.js tutorial programming',
    'AI & ML': 'Artificial Intelligence Machine Learning',
    'JavaScript': 'JavaScript programming tutorial',
    'Tech Careers': 'software engineering career tech jobs',
    'Web Dev': 'web development tutorial frontend backend',
    'Open Source': 'open source software development',
  };

  const query = categoryQueries[category] || category;
  
  // Get videos from the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return searchYouTubeVideos({
    query,
    maxResults,
    order: 'viewCount',
    publishedAfter: thirtyDaysAgo.toISOString(),
  });
}

/**
 * Get video by ID
 */
export async function getYouTubeVideoById(videoId: string): Promise<YouTubeVideo | null> {
  const apiKey = getApiKey();

  try {
    const params = new URLSearchParams({
      part: 'snippet,contentDetails,statistics',
      id: videoId,
      key: apiKey,
    });

    const response = await fetch(`${YOUTUBE_API_BASE_URL}/videos?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Failed to fetch video');
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return null;
    }

    const item = data.items[0];
    return {
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      channelId: item.snippet.channelId,
      channelTitle: item.snippet.channelTitle,
      thumbnails: item.snippet.thumbnails,
      publishedAt: item.snippet.publishedAt,
      viewCount: formatViewCount(item.statistics.viewCount),
      likeCount: item.statistics.likeCount || '0',
      commentCount: item.statistics.commentCount || '0',
      duration: formatDuration(item.contentDetails.duration),
      tags: item.snippet.tags || [],
    };
  } catch (error) {
    console.error('YouTube API Error:', error);
    return null;
  }
}

/**
 * Get channel statistics
 */
export async function getChannelStatistics(channelId: string) {
  const apiKey = getApiKey();

  try {
    const params = new URLSearchParams({
      part: 'statistics,snippet',
      id: channelId,
      key: apiKey,
    });

    const response = await fetch(`${YOUTUBE_API_BASE_URL}/channels?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Failed to fetch channel statistics');
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return null;
    }

    const item = data.items[0];
    return {
      subscriberCount: item.statistics.subscriberCount,
      videoCount: item.statistics.videoCount,
      viewCount: item.statistics.viewCount,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnails: item.snippet.thumbnails,
    };
  } catch (error) {
    console.error('YouTube API Error:', error);
    return null;
  }
}

export { formatViewCount, getTimeAgo, formatDuration };
