import React from 'react';
import { z } from 'zod';

export const videoCardSchema = z.object({
  rank: z.number().describe('Video rank number'),
  thumbnail: z.string().describe('URL of the video thumbnail'),
  title: z.string().describe('Video title'),
  channel: z.string().describe('Channel name'),
  views: z.string().describe('View count (e.g., "2.0M views")'),
  timeAgo: z.string().describe('Time since upload (e.g., "1 weeks ago")'),
  rating: z.enum(['Excellent', 'Good']).describe('Video rating'),
});

export type VideoCardProps = z.infer<typeof videoCardSchema> & {
  onClick?: () => void;
};

export const VideoCard: React.FC<VideoCardProps> = ({
  rank,
  thumbnail,
  title,
  channel,
  views,
  timeAgo,
  rating,
  onClick
}) => {
  return (
    <div 
      onClick={onClick}
      className="flex flex-col gap-3 cursor-pointer group"
    >
      {/* Thumbnail */}
      <div className="relative rounded-xl overflow-hidden bg-gray-200 aspect-video">
        <img 
          src={thumbnail} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Rank Badge */}
        <div className="absolute top-3 left-3 bg-black/80 text-white px-3 py-1 rounded text-sm font-bold">
          #{rank}
        </div>
      </div>

      {/* Video Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-medium text-gray-700">{channel}</p>
            <p>
              {views} · {timeAgo}
            </p>
          </div>
          
          {/* Rating Badge */}
          <span 
            className={`
              px-3 py-1 rounded-full text-xs font-medium
              ${rating === 'Excellent' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-blue-100 text-blue-700'
              }
            `}
          >
            {rating}
          </span>
        </div>
      </div>
    </div>
  );
};
