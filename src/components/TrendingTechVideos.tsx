import React from 'react';
import { VideoCard } from './VideoCard';
import { VideoGrid } from './VideoGrid';
import { CategoryPill } from './CategoryPill';
import { ChevronRight } from 'lucide-react';

interface Video {
  id: string;
  rank: number;
  thumbnail: string;
  title: string;
  channel: string;
  views: string;
  timeAgo: string;
  rating: 'Excellent' | 'Good';
}

interface TrendingTechVideosProps {
  videos?: Video[];
  categories?: string[];
  onVideoClick?: (videoId: string) => void;
  onCategoryClick?: (category: string) => void;
}

// Sample data
const defaultVideos: Video[] = [
  {
    id: '1',
    rank: 1,
    thumbnail: '/api/placeholder/400/225',
    title: 'Why Replacing Developers with AI is...',
    channel: 'MACKARD',
    views: '2.0M views',
    timeAgo: '1 weeks ago',
    rating: 'Excellent'
  },
  {
    id: '2',
    rank: 2,
    thumbnail: '/api/placeholder/400/225',
    title: 'The wild rise of OpenClaw...',
    channel: 'FIRESHIP',
    views: '1.3M views',
    timeAgo: '1 weeks ago',
    rating: 'Excellent'
  },
  {
    id: '3',
    rank: 3,
    thumbnail: '/api/placeholder/400/225',
    title: 'A brief history of programming...',
    channel: 'FIRESHIP',
    views: '591K views',
    timeAgo: '3 weeks ago',
    rating: 'Excellent'
  },
  {
    id: '4',
    rank: 4,
    thumbnail: '/api/placeholder/400/225',
    title: "Claude Code's New Agent Teams Are...",
    channel: 'BART SLODYCZKA',
    views: '140K views',
    timeAgo: '5 days ago',
    rating: 'Excellent'
  },
  {
    id: '5',
    rank: 5,
    thumbnail: '/api/placeholder/400/225',
    title: "I Read Honey's Source Code",
    channel: 'THE PRIMETIME',
    views: '879K views',
    timeAgo: '3 weeks ago',
    rating: 'Excellent'
  },
  {
    id: '6',
    rank: 6,
    thumbnail: '/api/placeholder/400/225',
    title: 'Cursor Is Lying To Developers...',
    channel: 'BASIC DEV',
    views: '291K views',
    timeAgo: '2 weeks ago',
    rating: 'Excellent'
  },
  {
    id: '7',
    rank: 7,
    thumbnail: '/api/placeholder/400/225',
    title: 'Learning to code has changed',
    channel: 'TECH WITH TIM',
    views: '136K views',
    timeAgo: '1 weeks ago',
    rating: 'Excellent'
  },
  {
    id: '8',
    rank: 8,
    thumbnail: '/api/placeholder/400/225',
    title: 'The Best Place to Learn AI in 2026?...',
    channel: 'JASON WEST',
    views: '181K views',
    timeAgo: '1 weeks ago',
    rating: 'Good'
  }
];

const defaultCategories = ['React', 'AI & ML', 'JavaScript', 'Tech Careers', 'Web Dev', 'Open Source'];

export const TrendingTechVideos: React.FC<TrendingTechVideosProps> = ({
  videos = defaultVideos,
  categories = defaultCategories,
  onVideoClick,
  onCategoryClick
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

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
        {videos.map((video) => (
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
        ))}
      </VideoGrid>
    </div>
  );
};
