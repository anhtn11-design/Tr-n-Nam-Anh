
import React from 'react';

interface ScoreBadgeProps {
  score: number;
  priority: string;
  large?: boolean;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score, priority, large = false }) => {
  const getPriorityColorClasses = () => {
    if (priority.includes('Top Tier')) return 'bg-brand-primary/20 text-pink-300 border-brand-primary';
    if (priority.includes('Thử nghiệm')) return 'bg-cyan-500/20 text-cyan-300 border-cyan-500';
    return 'bg-brand-muted/50 text-brand-text-muted border-brand-muted';
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