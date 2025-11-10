import React from 'react';
import type { Idea } from '../../types';
import { ScoreBadge } from '../ui/ScoreBadge';

interface MatrixTableViewProps {
  ideas: Idea[];
  onSelectIdea: (idea: Idea) => void;
}

export const MatrixTableView: React.FC<MatrixTableViewProps> = ({ ideas, onSelectIdea }) => {

  const getProminentHook = (idea: Idea): string => {
    if (idea.hooks?.mini && idea.hooks.mini.length > 0) {
      const bestMiniHook = idea.hooks.mini.reduce((best, current) =>
        current.retentionScore > best.retentionScore ? current : best
      );
      return bestMiniHook.text;
    }
    if (idea.hooks?.full && idea.hooks.full.length > 0) {
      return idea.hooks.full[0];
    }
    return 'Chưa có';
  };

  return (
    <div className="bg-brand-surface rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-brand-text-muted">
          <thead className="text-xs text-brand-text uppercase bg-brand-muted/30">
            <tr>
              <th scope="col" className="px-6 py-3 min-w-[300px]">Ý tưởng Nâng cấp / Gốc</th>
              <th scope="col" className="px-6 py-3">Chiến lược / Biến thể</th>
              <th scope="col" className="px-6 py-3">Cảm xúc chính</th>
              <th scope="col" className="px-6 py-3 text-center">Điểm / Viral</th>
              <th scope="col" className="px-6 py-3">Triển khai</th>
              <th scope="col" className="px-6 py-3">Hook nổi bật</th>
            </tr>
          </thead>
          <tbody>
            {ideas.map((idea) => (
              <tr 
                key={idea.id} 
                className="bg-brand-surface border-b border-brand-muted hover:bg-brand-muted/50 cursor-pointer"
                onClick={() => onSelectIdea(idea)}
              >
                <th scope="row" className="px-6 py-4 font-medium text-brand-text whitespace-normal">
                  <p>{idea.upgradedTitle}</p>
                  <p className="text-xs text-brand-text-muted font-normal italic mt-1">Gốc: {idea.title}</p>
                </th>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="px-2 py-1 text-xs font-medium text-purple-200 bg-purple-900/50 rounded-full w-fit">{idea.creativeStrategy}</span>
                    <span className="px-2 py-1 text-xs font-medium text-sky-200 bg-sky-900/50 rounded-full w-fit">{idea.variationType}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{idea.mainEmotion}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col items-center gap-1">
                    <ScoreBadge score={idea.totalScore} priority={idea.priority} />
                    <div className="text-xs font-bold text-cyan-300 mt-1">Viral: {idea.viralScore.toFixed(1)}</div>
                  </div>
                </td>
                <td className="px-6 py-4">{idea.implementationSuggestion}</td>
                <td className="px-6 py-4 text-brand-text italic truncate max-w-xs">"{getProminentHook(idea)}"</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
