import React from 'react';
import { VideoCard } from './VideoCard';
import { VideoGrid } from './VideoGrid';
import { CategoryPill } from './CategoryPill';
import { ChevronRight } from 'lucide-react';
import { getTrendingVideos, type Video } from '@/services/youtube-videos';

interface TrendingTechVideosProps {
  videos?: Video[];
  categories?: string[];
  onVideoClick?: (videoId: string) => void;
  onCategoryClick?: (category: string) => void;
}

const defaultCategories = ['React', 'AI & ML', 'JavaScript', 'Tech Careers', 'Web Dev', 'Open Source'];

export const TrendingTechVideos: React.FC<TrendingTechVideosProps> = ({
  videos: propVideos,
  categories = defaultCategories,
  onVideoClick,
  onCategoryClick
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [videos, setVideos] = React.useState<Video[]>(propVideos || []);
  const [isLoading, setIsLoading] = React.useState(false);

  // Fetch videos on component mount and when category changes
  React.useEffect(() => {
    if (propVideos) {
      // If videos are provided as props, use those instead
      setVideos(propVideos);
      return;
    }

    const fetchVideos = async () => {
      setIsLoading(true);
      try {
        const fetchedVideos = await getTrendingVideos({
          category: selectedCategory || undefined,
          limit: 8,
          sortBy: 'views',
          useRealApi: true // Force real API usage
        });
        setVideos(fetchedVideos);
      } catch (error) {
        console.error('Failed to fetch trending videos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [selectedCategory, propVideos]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category);
    onCategoryClick?.(category);
  };

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {categories.map((category) => (
          <CategoryPill
            key={category}
            label={category}
            isActive={selectedCategory === category}
            onClick={() => handleCategoryClick(category)}
          />
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Newest Videos</h2>
        <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
          See all
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Video Grid */}
      <VideoGrid columns={4}>
        {isLoading ? (
          <div className="col-span-4 flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : videos.length === 0 ? (
          <div className="col-span-4 text-center py-12 text-gray-500">
            No videos found{selectedCategory ? ` for ${selectedCategory}` : ''}
          </div>
        ) : (
          videos.map((video) => (
            <VideoCard
              key={video.id}
              rank={video.rank}
              thumbnail={video.thumbnail}
              title={video.title}
              channel={video.channel}
              views={video.views}
              timeAgo={video.timeAgo}
              rating={video.rating}
              onClick={() => onVideoClick?.(video.id)}
            />
          ))
        )}
      </VideoGrid>
    </div>
  );
};
