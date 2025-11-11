
import React from 'react';
import type { Idea } from '../types';
import { ScoreBadge } from './ui/ScoreBadge';

interface SidebarProps {
  ideas: Idea[];
  onSelectIdea: (idea: Idea) => void;
  selectedIdea: Idea | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ ideas, onSelectIdea, selectedIdea }) => {
  return (
    <aside className="w-full md:w-[350px] flex-shrink-0 bg-brand-surface border-r border-brand-muted flex flex-col overflow-y-auto">
      <div className="p-4 border-b border-brand-muted">
        <h2 className="text-lg font-semibold">Ý tưởng đã tạo ({ideas.length})</h2>
      </div>
      <ul className="flex-grow p-2">
        {ideas.map((idea) => (
          <li key={idea.id}>
            <button
              onClick={() => onSelectIdea(idea)}
              className={`w-full text-left p-3 my-1 rounded-lg transition-colors duration-200 flex justify-between items-start gap-2 ${
                selectedIdea?.id === idea.id
                  ? 'bg-brand-primary/10'
                  : 'hover:bg-brand-muted'
              }`}
            >
              <div className="flex-grow">
                <p className={`font-medium ${selectedIdea?.id === idea.id ? 'text-brand-primary' : 'text-brand-text'}`}>{idea.upgradedTitle}</p>
                <p className="text-xs text-brand-text-muted mt-1">{idea.category}</p>
              </div>
              <ScoreBadge score={idea.totalScore} priority={idea.priority} />
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};