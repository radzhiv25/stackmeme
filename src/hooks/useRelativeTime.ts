import { useState, useEffect } from 'react';

export const useRelativeTime = (dateString: string, updateInterval: number = 1000) => {
  const [relativeTime, setRelativeTime] = useState('');

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // Handle future dates
    if (diffInSeconds < 0) {
      return 'just now';
    }

    // Less than 1 minute
    if (diffInSeconds < 60) {
      return diffInSeconds <= 1 ? 'just now' : `${diffInSeconds}s ago`;
    }

    // Less than 1 hour
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    }

    // Less than 1 day
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    }

    // Less than 1 week
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }

    // Less than 1 month
    if (diffInSeconds < 2592000) {
      const weeks = Math.floor(diffInSeconds / 604800);
      return `${weeks}w ago`;
    }

    // Less than 1 year
    if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months}mo ago`;
    }

    // More than 1 year
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years}y ago`;
  };

  useEffect(() => {
    // Set initial value
    setRelativeTime(formatRelativeTime(dateString));

    // Set up interval for periodic updates
    const interval = setInterval(() => {
      setRelativeTime(formatRelativeTime(dateString));
    }, updateInterval);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [dateString, updateInterval]);

  return relativeTime;
};
