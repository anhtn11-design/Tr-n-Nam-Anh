import React from 'react';

interface ScoreBadgeProps {
  score: number;
  priority: string;
  large?: boolean;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score, priority, large = false }) => {
  const getPriorityColorClasses = () => {
    if (priority.includes('Top Tier')) return 'bg-brand-primary/10 text-brand-primary border-brand-primary/50';
    if (priority.includes('Thử nghiệm')) return 'bg-brand-secondary/20 text-teal-600 border-brand-secondary/50';
    return 'bg-gray-100 text-brand-text-muted border-gray-200';
  };
  
  const baseClasses = 'flex items-center gap-2 rounded-full border';
  const sizeClasses = large ? 'px-4 py-2' : 'px-3 py-1';
  const textClasses = large ? 'text-lg' : 'text-sm';
  const scoreTextClasses = large ? 'text-xl' : 'text-base';

  return (
    <div className={`${baseClasses} ${sizeClasses} ${getPriorityColorClasses()}`}>
      <span className={`${scoreTextClasses} font-bold`}>{score.toFixed(1)}</span>
      <span className={`${textClasses} font-semibold`}>{priority}</span>
    </div>
  );
};