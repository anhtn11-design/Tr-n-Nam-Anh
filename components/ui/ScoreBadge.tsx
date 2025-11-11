import React from 'react';

interface ScoreBadgeProps {
  score: number;
  priority: string;
  large?: boolean;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score, priority, large = false }) => {
  const getPriorityColorClasses = () => {
    if (priority.includes('Top Tier')) return 'bg-brand-primary text-white';
    if (priority.includes('Thử nghiệm')) return 'bg-brand-secondary text-brand-text';
    return 'bg-brand-muted text-brand-text-muted';
  };
  
  const baseClasses = 'flex items-center gap-2 rounded-full font-sans';
  const sizeClasses = large ? 'px-4 py-2' : 'px-3 py-1';
  const textClasses = large ? 'text-lg' : 'text-sm';
  const scoreTextClasses = large ? 'text-xl' : 'text-base';

  return (
    <div className={`${baseClasses} ${sizeClasses} ${getPriorityColorClasses()}`}>
      <span className={`${scoreTextClasses} font-bold`}>{score.toFixed(1)}</span>
      <span className={`${textClasses} font-semibold`}>{priority.replace('⭐ ', '').replace('⚙️ ', '')}</span>
    </div>
  );
};