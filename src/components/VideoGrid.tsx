import React from 'react';

interface VideoGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
}

export const VideoGrid: React.FC<VideoGridProps> = ({ 
  children, 
  columns = 4 
}) => {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {children}
    </div>
  );
};
