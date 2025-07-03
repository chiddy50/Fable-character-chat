// components/LoadingSpinner.tsx
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  message 
}) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-8xl'
  };

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <i className={`bx bx-loader-circle bx-spin text-gray-500 ${sizeClasses[size]}`}></i>
      {message && (
        <span className="text-xs text-gray-500 ml-2 mt-2">{message}</span>
      )}
    </div>
  );
};