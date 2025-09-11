import React from 'react';
import { useRelativeTime } from '../hooks/useRelativeTime';

interface RelativeTimeProps {
  date: string;
  updateInterval?: number;
  className?: string;
  title?: string; // For showing full date on hover
}

export const RelativeTime: React.FC<RelativeTimeProps> = ({ 
  date, 
  updateInterval = 1000, 
  className = '',
  title
}) => {
  const relativeTime = useRelativeTime(date, updateInterval);
  
  // Generate title from date if not provided
  const fullDate = title || new Date(date).toLocaleString();

  return (
    <time 
      className={className}
      title={fullDate}
      dateTime={date}
    >
      {relativeTime}
    </time>
  );
};

