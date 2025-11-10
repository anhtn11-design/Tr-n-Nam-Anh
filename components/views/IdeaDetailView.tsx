import React from 'react';
import type { Idea, ScoreCategory } from '../../types';
import { Card } from '../ui/Card';
import { ScoreBadge } from '../ui/ScoreBadge';

interface IdeaDetailViewProps {
  idea: Idea;
}

const ScoreBar: React.FC<{ label: string; score: number; maxScore?: number; colorClass?: string }> = ({ label, score, maxScore = 5, colorClass = 'bg-brand-primary' }) => (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-brand-text-muted">{label}</span>
        <span className="text-sm font-medium text-brand-text">{score.toFixed(1)} / {maxScore}</span>
      </div>
      <div className="w-full bg-brand-muted rounded-full h-2.5">
        <div className={`${colorClass} h-2.5 rounded-full`} style={{ width: `${(score / maxScore) * 100}%` }}></div>
      </div>
    </div>
  );

const DetailSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
  <Card className="p-6">
    <h3 className="text-lg font-semibold text-brand-primary mb-3">{title}</h3>
    {children}
  </Card>
);

export const IdeaDetailView: React.FC<IdeaDetailViewProps> = ({ idea }) => {
    const scoreCategories: { key: ScoreCategory; label: string }[] = [
        { key: 'relevance', label: 'Liên quan chiến dịch' },
        { key: 'viralPotential', label: 'Tiềm năng Viral' },
        { key: 'feasibility', label: 'Tính khả thi' },
        { key: 'audienceFit', label: 'Phù hợp đối tượng' },
        { key: 'brandFit', label: 'Phù hợp thương hiệu' },
        { key: 'novelty', label: 'Tính mới lạ' },
        { key: 'trendFit', label: 'Khả năng bắt trend' },
        { key: 'engagementPotential', label: 'Tiềm năng tương tác' },
        { key: 'productFit', label: 'Gắn kết sản phẩm' },
        { key: 'emotionImpact', label: 'Tác động cảm xúc' },
    ];
    
  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
                <p className="text-sm text-brand-primary font-semibold">{idea.category} • {idea.videoFormat}</p>
                <h2 className="text-3xl font-bold text-brand-text mt-1">{idea.upgradedTitle}</h2>
                <p className="mt-2 text-brand-text-muted italic">Ý tưởng gốc: "{idea.title}"</p>
            </div>
            <div className="flex-shrink-0">
                <ScoreBadge score={idea.totalScore} priority={idea.priority} large />
            </div>
        </div>
        <p className="mt-2 text-brand-text-muted">Triển khai: <span className="font-semibold text-brand-text">{idea.implementationSuggestion}</span></p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <DetailSection title="Nội dung & Kịch bản">
              <div className="space-y-4 text-brand-text">
                <div>
                    <h4 className="font-semibold text-brand-text-muted">Tóm tắt</h4>
                    <p>{idea.contentSummary}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-brand-text-muted">Hướng kịch bản</h4>
                    <p className="whitespace-pre-wrap">{idea.scriptDirection}</p>
                </div>
              </div>
            </DetailSection>

            <DetailSection title="Biến thể Sáng tạo">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-brand-text-muted mb-2">Format Remix</h4>
                  <ul className="list-disc list-inside space-y-2 text-brand-text">
                    {idea.formatRemixes.map((format, i) => <li key={i}>{format}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-brand-text-muted mb-2">Tone Remix (Tiêu đề)</h4>
                  <ul className="list-disc list-inside space-y-2 text-brand-text">
                    {idea.toneRemixes.map((remix, i) => <li key={i}><strong>{remix.tone}:</strong> "{remix.upgradedTitle}"</li>)}
                  </ul>
                </div>
              </div>
            </DetailSection>
            
            {idea.priority === '⭐ Top Tier' && (
                 <DetailSection title="Hooks & Phụ đề">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <h4 className="font-semibold text-brand-text-muted mb-2">Hooks (3 giây đầu)</h4>
                            <div className="space-y-4">
                                {idea.hooks.full?.length > 0 && (
                                <div>
                                    <h5 className="font-bold text-sm text-brand-text">Hook đầy đủ (Giọng nói)</h5>
                                    <ul className="list-disc list-inside space-y-1 text-brand-text mt-1">
                                    {idea.hooks.full.map((hook, i) => <li key={`full-${i}`}>{hook}</li>)}
                                    </ul>
                                </div>
                                )}
                                {idea.hooks.mini?.length > 0 && (
                                <div>
                                    <h5 className="font-bold text-sm text-brand-text">Mini-hook (Tối ưu hóa)</h5>
                                    <div className="space-y-3 mt-2">
                                        {idea.hooks.mini.map((hook, i) => (
                                            <div key={`mini-${i}`} className="bg-brand-dark p-3 rounded-lg border border-brand-muted transition-shadow hover:shadow-lg hover:border-brand-primary/50">
                                                <p className="text-brand-text font-medium">"{hook.text}"</p>
                                                <div className="flex items-center justify-between mt-2 text-xs">
                                                    <span className="px-2 py-1 font-mono bg-sky-900/70 text-sky-300 rounded-full">{hook.formula}</span>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-semibold text-brand-text-muted">Retention Score:</span>
                                                        <span className="font-bold text-teal-300 text-sm">{hook.retentionScore}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                )}
                                {idea.hooks.reverse?.length > 0 && (
                                <div>
                                    <h5 className="font-bold text-sm text-brand-text">Hook đảo ngược</h5>
                                    <ul className="list-disc list-inside space-y-1 text-brand-text mt-1">
                                    {idea.hooks.reverse.map((hook, i) => <li key={`reverse-${i}`}>{hook}</li>)}
                                    </ul>
                                </div>
                                )}
                            </div>
                         </div>
                         <div>
                            <h4 className="font-semibold text-brand-text-muted mb-2">Phụ đề (Captions)</h4>
                            <ul className="list-disc list-inside space-y-2 text-brand-text">
                                {idea.captions.map((caption, i) => <li key={i}>{caption}</li>)}
                            </ul>
                         </div>
                    </div>
                </DetailSection>
            )}
        </div>

        <div className="space-y-6">
            <DetailSection title="Phân tích sáng tạo">
                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-semibold text-brand-text-muted">Chiến lược sáng tạo</p>
                        <p className="text-md font-bold text-purple-300">{idea.creativeStrategy}</p>
                    </div>
                     <div>
                        <p className="text-sm font-semibold text-brand-text-muted">Loại biến thể</p>
                        <p className="text-md font-bold text-sky-300">{idea.variationType}</p>
                    </div>
                     <div>
                        <p className="text-sm font-semibold text-brand-text-muted">Cảm xúc chính</p>
                        <p className="text-md font-bold text-brand-text">{idea.mainEmotion}</p>
                    </div>
                    <div className="pt-2">
                        <ScoreBar label="Điểm Viral" score={idea.viralScore} maxScore={10} colorClass="bg-cyan-400" />
                    </div>
                </div>
            </DetailSection>

            <DetailSection title="Ma trận điểm">
              <div className="space-y-4">
                {scoreCategories.map(({key, label}) => (
                    idea.scores[key] !== undefined && <ScoreBar key={key} label={label} score={idea.scores[key]} />
                ))}
              </div>
            </DetailSection>

            {idea.priority === '⭐ Top Tier' && (
                <DetailSection title="Hashtags">
                    <div className="flex flex-wrap gap-2">
                        {idea.hashtagPack.map((tag, i) => (
                            <span key={i} className="bg-brand-muted text-brand-primary text-xs font-mono px-2 py-1 rounded">
                                {tag}
                            </span>
                        ))}
                    </div>
                </DetailSection>
            )}
        </div>
      </div>
    </div>
  );
};
