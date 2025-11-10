
import React from 'react';

interface ScoreBadgeProps {
  score: number;
  priority: string;
  large?: boolean;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score, priority, large = false }) => {
  const getPriorityColorClasses = () => {
    if (priority.includes('Top Tier')) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500';
    if (priority.includes('Thử nghiệm')) return 'bg-amber-500/20 text-amber-300 border-amber-500';
    return 'bg-slate-500/20 text-slate-300 border-slate-500';
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
