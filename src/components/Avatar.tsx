import React from 'react';
import { Friend } from '../types';

interface AvatarProps {
  friend: Friend;
  className?: string; // Additional classes for the container
  size?: 'xs' | 'sm' | 'md';
}

export default function Avatar({ friend, className = '', size = 'md' }: AvatarProps) {
  const sizeClasses = {
    xs: 'w-20 h-20 text-[20px]',
    sm: 'w-24 h-24 text-2xl',
    md: 'w-32 h-32 text-4xl',
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white shadow-sm shrink-0 ${friend.avatarColor} overflow-hidden ${className}`}>
      {friend.avatarUrl ? (
        <img src={friend.avatarUrl} alt={friend.name} className="w-full h-full object-cover" />
      ) : (
        friend.avatarEmoji
      )}
    </div>
  );
}
