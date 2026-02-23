/**
 * @file video-actions.ts
 * @description Service to handle video actions and update UI state with AI-powered search
 */

import { searchYouTubeVideos, type YouTubeVideo } from './youtube-api';
import type { Video } from './youtube-videos';

// Global callback to update videos in the UI
let updateVideosCallback: ((videos: Video[]) => void) | null = null;

/**
 * Register a callback to update videos in the UI
 */
export function registerVideoUpdateCallback(callback: (videos: Video[]) => void) {
  updateVideosCallback = callback;
}

/**
 * Unregister the video update callback
 */
export function unregisterVideoUpdateCallback() {
  updateVideosCallback = null;
}

interface SearchVideosParams {
  query: string;
  limit?: number;
  sortBy?: 'relevance' | 'date' | 'viewCount' | 'rating';
  aiRating?: boolean;
}

/**
 * Convert YouTube video to our internal format
 */
function convertYouTubeVideo(video: YouTubeVideo, rank: number): Video {
  // Calculate rating based on engagement
  const views = parseInt(video.viewCount.replace(/[^0-9]/g, '')) || 0;
  const likes = parseInt(video.likeCount) || 0;
  const likeRatio = views > 0 ? (likes / views) * 100 : 0;
  
  return {
    id: video.id,
    rank,
    thumbnail: video.thumbnails.medium?.url || video.thumbnails.default.url,
    title: video.title,
    channel: video.channelTitle,
    views: video.viewCount,
    timeAgo: getTimeAgo(video.publishedAt),
    rating: likeRatio > 0.5 ? 'Excellent' : 'Good',
    description: video.description,
  };
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
 * Rate video relevance based on AI analysis
 * This analyzes title, description, and engagement metrics
 */
function rateVideoRelevance(video: YouTubeVideo, searchQuery: string): number {
  const query = searchQuery.toLowerCase();
  const title = video.title.toLowerCase();
  const description = video.description.toLowerCase();
  
  let score = 0;
  
  // Title relevance (most important)
  const titleWords = query.split(' ').filter(w => w.length > 2);
  const titleMatches = titleWords.filter(word => title.includes(word)).length;
  score += (titleMatches / titleWords.length) * 50;
  
  // Description relevance
  const descWords = query.split(' ').filter(w => w.length > 2);
  const descMatches = descWords.filter(word => description.includes(word)).length;
  score += (descMatches / descWords.length) * 20;
  
  // Engagement metrics (views, likes, recency)
  const views = parseInt(video.viewCount.replace(/[^0-9]/g, '')) || 0;
  const likes = parseInt(video.likeCount) || 0;
  const likeRatio = views > 0 ? (likes / views) : 0;
  
  // Normalize view count (cap at 10M)
  const viewScore = Math.min(views / 10000000, 1) * 15;
  score += viewScore;
  
  // Like ratio bonus
  score += likeRatio * 1000 * 10; // Scale up the ratio
  
  // Recency bonus (prefer newer content)
  const daysSincePublish = (Date.now() - new Date(video.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
  const recencyScore = Math.max(0, 5 - (daysSincePublish / 365) * 5); // Newer = higher score
  score += recencyScore;
  
  return Math.min(score, 100); // Cap at 100
}

/**
 * Search for videos with custom query and AI-based rating/filtering
 * This function is used by Tambo AI to search and update the video list
 */
export async function searchAndUpdateVideos(params: SearchVideosParams) {
  try {
    const { query, limit = 20, sortBy = 'relevance', aiRating = true } = params;
    
    // Search YouTube with the specific query
    const youtubeVideos = await searchYouTubeVideos({
      query,
      maxResults: aiRating ? Math.min(limit * 3, 50) : limit, // Fetch more if AI rating is enabled
      order: sortBy === 'relevance' ? 'relevance' : sortBy === 'date' ? 'date' : 'viewCount',
    });
    
    let videos = youtubeVideos.map((video, index) => convertYouTubeVideo(video, index + 1));
    
    // Apply AI-based rating and filtering
    if (aiRating && videos.length > 0) {
      // Rate each video
      const ratedVideos = videos.map(video => {
        const youtubeVideo = youtubeVideos.find(v => v.id === video.id);
        const relevanceScore = youtubeVideo ? rateVideoRelevance(youtubeVideo, query) : 0;
        return {
          ...video,
          relevanceScore,
        };
      });
      
      // Sort by relevance score
      ratedVideos.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
      
      // Take top results
      videos = ratedVideos.slice(0, limit).map((v, index) => ({
        ...v,
        rank: index + 1,
      }));
    }
    
    // Update the UI if callback is registered
    if (updateVideosCallback) {
      updateVideosCallback(videos);
    }
    
    // Return a summary message
    const message = `Found ${videos.length} videos matching "${query}". ${aiRating ? 'Videos have been AI-rated for relevance. ' : ''}The video list has been updated in the main content area.`;
    
    return {
      success: true,
      message,
      query,
      videoCount: videos.length,
      aiRated: aiRating,
      topVideos: videos.slice(0, 3).map(v => ({
        title: v.title,
        channel: v.channel,
        views: v.views,
        relevanceScore: (v as any).relevanceScore?.toFixed(1),
      }))
    };
  } catch (error) {
    console.error('Failed to search videos:', error);
    
    return {
      success: false,
      message: `Failed to search for "${params.query}". Please try again.`,
      query: params.query,
      videoCount: 0,
      aiRated: false,
      topVideos: []
    };
  }
}
