import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const progress = Math.min(100, Math.max(0, (current / total) * 100));
  
  return (
    <div className="w-full h-1 bg-gray-900 fixed top-0 left-0 z-50">
      <div 
        className="h-full bg-white transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};