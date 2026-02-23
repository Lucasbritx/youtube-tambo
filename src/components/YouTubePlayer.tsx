import React from 'react';
import { X } from 'lucide-react';
import { Video } from '@/services/youtube-videos';

interface YouTubePlayerProps {
  video: Video | null;
  onClose?: () => void;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ video, onClose }) => {
  if (!video) return null;

  // Extract video ID from various YouTube URL formats or use the ID directly
  const videoId = video.id;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-black rounded-lg overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gray-900 px-6 py-4 flex items-center justify-between border-b border-gray-800">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white line-clamp-2">{video.title}</h2>
            <p className="text-sm text-gray-400 mt-1">{video.channel}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded"
            aria-label="Close player"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Video Player */}
        <div className="flex-1 bg-black flex items-center justify-center overflow-hidden">
          <div className="relative w-full h-full">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Video Info */}
        <div className="bg-gray-900 px-6 py-4 border-t border-gray-800">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400">
                  {video.rating}
                </span>
                <span className="text-sm text-gray-400">{video.views}</span>
                <span className="text-sm text-gray-400">{video.timeAgo}</span>
              </div>
              {video.category && (
                <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded">
                  {video.category}
                </span>
              )}
            </div>
            
            {video.description && (
              <p className="text-sm text-gray-300 line-clamp-2">
                {video.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
