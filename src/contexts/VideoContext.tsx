'use client';

import React from 'react';
import type { Video } from '@/services/youtube-videos';

interface VideoContextValue {
  videos: Video[];
  setVideos: (videos: Video[]) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  updateVideos: (videos: Video[]) => void;
}

const VideoContext = React.createContext<VideoContextValue | null>(null);

export function useVideoContext() {
  const context = React.useContext(VideoContext);
  if (!context) {
    throw new Error('useVideoContext must be used within VideoProvider');
  }
  return context;
}

interface VideoProviderProps {
  children: React.ReactNode;
}

export function VideoProvider({ children }: VideoProviderProps) {
  const [videos, setVideos] = React.useState<Video[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const updateVideos = React.useCallback((newVideos: Video[]) => {
    setVideos(newVideos);
  }, []);

  const value = React.useMemo(
    () => ({
      videos,
      setVideos,
      selectedCategory,
      setSelectedCategory,
      updateVideos,
    }),
    [videos, selectedCategory, updateVideos]
  );

  return <VideoContext.Provider value={value}>{children}</VideoContext.Provider>;
}
