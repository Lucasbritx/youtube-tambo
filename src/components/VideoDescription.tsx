import React from 'react';

interface VideoDescriptionProps {
  title?: string;
  description?: string;
  channel?: string;
  views?: string;
  uploadDate?: string;
  tags?: string[];
}

export const VideoDescription: React.FC<VideoDescriptionProps> = ({
  title,
  description,
  channel,
  views,
  uploadDate,
  tags = []
}) => {
  return (
    <div className="bg-white rounded-lg p-6 space-y-4">
      {title && (
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      )}
      
      {(channel || views || uploadDate) && (
        <div className="flex items-center gap-4 text-sm text-gray-600">
          {channel && <span className="font-medium">{channel}</span>}
          {views && <span>{views}</span>}
          {uploadDate && <span>{uploadDate}</span>}
        </div>
      )}

      {description && (
        <p className="text-gray-700 leading-relaxed">{description}</p>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {tags.map((tag, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
