import React, { useState } from 'react';
import type { RemixedIdea, Idea } from '../../types';
import { Card } from '../ui/Card';

interface RemixViewProps {
  remixedIdeas: RemixedIdea[];
}

const CompareCard: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
  <div className="flex-1 bg-gray-50 p-4 rounded-lg border border-brand-border">
    <h4 className="font-bold text-brand-primary mb-2 border-b border-brand-border pb-2">{title}</h4>
    <div className="space-y-3 text-sm">{children}</div>
  </div>
);

const CompareView: React.FC<{ remixedIdea: RemixedIdea }> = ({ remixedIdea }) => {
  const { originalIdea, newPotentialScore, hooks, communicationGoal, videoFormat } = remixedIdea;
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-brand-surface border-t-2 border-brand-secondary">
      <CompareCard title="Ý Tưởng Gốc">
        <div>
          <p className="font-semibold text-brand-text-muted">Điểm:</p>
          <p className="text-brand-text-main">{originalIdea.totalScore?.toFixed(1) || 'N/A'}</p>
        </div>
        <div>
          <p className="font-semibold text-brand-text-muted">Định dạng:</p>
          <p className="text-brand-text-main">{originalIdea.videoFormat || 'N/A'}</p>
        </div>
        <div>
          <p className="font-semibold text-brand-text-muted">Hook cũ:</p>
          <ul className="list-disc list-inside text-brand-text-muted italic">
             {(originalIdea.hooks?.full?.length || 0) > 0
                ? originalIdea.hooks.full.slice(0, 2).map((h, i) => <li key={i}>{h}</li>)
                : <li>Không có</li>
             }
          </ul>
        </div>
      </CompareCard>
      <CompareCard title="Ý Tưởng Mới Mở Rộng">
        <div>
          <p className="font-semibold text-brand-text-muted">Điểm tiềm năng mới:</p>
          <p className="text-brand-text-main">{newPotentialScore.toFixed(1)}</p>
        </div>
        <div>
          <p className="font-semibold text-brand-text-muted">Định dạng & Mục tiêu:</p>
          <p className="text-brand-text-main">{videoFormat} / {communicationGoal}</p>
        </div>
        <div>
          <p className="font-semibold text-brand-text-muted">Hook mới:</p>
           <ul className="list-disc list-inside text-brand-text-main">
            {hooks.map((h, i) => <li key={i}><strong>{h.mini}</strong> - <em>{h.full}</em></li>)}
          </ul>
        </div>
      </CompareCard>
    </div>
  );
};


export const RemixView: React.FC<RemixViewProps> = ({ remixedIdeas }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (remixedIdeas.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center text-center">
        <div>
          <p className="text-2xl font-bold">Không có ý tưởng nào được tạo ra</p>
          <p className="text-brand-text-muted mt-2">Hãy thử lại với từ khóa hoặc chế độ trộn khác.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">Kết quả Trộn & Mở rộng Ý tưởng</h2>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-brand-text-muted">
            <thead className="text-xs text-brand-text-muted uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Ý tưởng mới mở rộng</th>
                <th scope="col" className="px-6 py-3">Chủ đề gốc</th>
                <th scope="col" className="px-6 py-3 text-center">Nguồn</th>
                <th scope="col" className="px-6 py-3 text-center">Điểm mới</th>
                <th scope="col" className="px-6 py-3">Hook Mini</th>
                <th scope="col" className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {remixedIdeas.map((idea) => (
                <React.Fragment key={idea.id}>
                  <tr 
                    className="bg-brand-surface border-b border-brand-border hover:bg-gray-50"
                  >
                    <th scope="row" className="px-6 py-4 font-medium text-brand-text-main whitespace-nowrap">
                      {idea.newExpandedIdea}
                    </th>
                    <td className="px-6 py-4 italic">{idea.originalTheme}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">{idea.ideaSource}</span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-lg text-brand-primary">{idea.newPotentialScore.toFixed(1)}</td>
                    <td className="px-6 py-4 text-brand-text-main italic max-w-xs truncate">"{idea.hooks?.[0]?.mini || 'N/A'}"</td>
                    <td className="px-3 py-4">
                      <button onClick={() => toggleExpand(idea.id)} className="font-semibold text-brand-primary hover:underline">
                         {expandedId === idea.id ? 'Ẩn' : 'So sánh'}
                      </button>
                    </td>
                  </tr>
                  {expandedId === idea.id && (
                     <tr>
                        <td colSpan={6}>
                           <CompareView remixedIdea={idea} />
                        </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};