import React, { useMemo } from 'react';
import type { Idea } from '../../types';
import { Card } from '../ui/Card';
import { ScoreBadge } from '../ui/ScoreBadge';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DashboardViewProps {
  ideas: Idea[];
  onSelectIdea: (idea: Idea) => void;
}

const COLORS = {
    'Nội bộ': '#B5B5DE', // brand-primary
    'KOC/CTV': '#BBDADB', // brand-accent
};

export const DashboardView: React.FC<DashboardViewProps> = ({ ideas, onSelectIdea }) => {
  const top5Ideas = useMemo(() => ideas.sort((a,b) => b.viralScore - a.viralScore).slice(0, 5), [ideas]);
  
  const implementationData = useMemo(() => {
    const counts = ideas.reduce((acc, idea) => {
      const key = idea.implementationSuggestion;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [ideas]);

  const categoryData = useMemo(() => {
    const counts = ideas.reduce((acc, idea) => {
      const key = idea.category;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [ideas]);

  const topTrends = useMemo(() => {
    const formatCounts: Record<string, number> = {};
    ideas.forEach(idea => {
      formatCounts[idea.videoFormat] = (formatCounts[idea.videoFormat] || 0) + 1;
    });
    return Object.entries(formatCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(item => item[0]);
  }, [ideas]);

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold">Tổng Quan Bảng Tin</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
              <h3 className="text-brand-text-muted font-semibold">Tổng số ý tưởng</h3>
              <p className="text-4xl font-bold text-brand-primary">{ideas.length}</p>
          </Card>
          <Card className="p-6">
              <h3 className="text-brand-text-muted font-semibold">Ý tưởng Top Tier</h3>
              <p className="text-4xl font-bold text-brand-primary">{ideas.filter(i => i.priority === '⭐ Top Tier').length}</p>
          </Card>
          <Card className="p-6">
              <h3 className="text-brand-text-muted font-semibold">Điểm Viral TB</h3>
              <p className="text-4xl font-bold text-brand-secondary">
                  {(ideas.reduce((sum, i) => sum + i.viralScore, 0) / (ideas.length || 1)).toFixed(1)}
              </p>
          </Card>
           <Card className="p-6">
              <h3 className="text-brand-text-muted font-semibold">Điểm Tiềm năng TB</h3>
              <p className="text-4xl font-bold text-brand-accent">
                  {(ideas.reduce((sum, i) => sum + i.scores.viralPotential, 0) / (ideas.length || 1)).toFixed(1)}
              </p>
          </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold p-4 border-b border-brand-muted">Top 5 Ý Tưởng Viral Nhất</h3>
          <ul className="p-2">
            {top5Ideas.map(idea => (
              <li key={idea.id} onClick={() => onSelectIdea(idea)} className="flex justify-between items-center p-3 hover:bg-brand-muted rounded-lg cursor-pointer">
                <div>
                  <p className="font-medium text-brand-text">{idea.upgradedTitle}</p>
                  <p className="text-sm text-brand-text-muted">{idea.creativeStrategy} - {idea.variationType}</p>
                </div>
                 <div className="text-right">
                    <ScoreBadge score={idea.totalScore} priority={idea.priority} />
                    <p className="text-xs font-bold text-brand-secondary mt-1">Viral: {idea.viralScore.toFixed(1)}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Phân bổ triển khai</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={implementationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {implementationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#8884d8'} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#FAF8F5', border: '1px solid #E7E2DC', borderRadius: '0.5rem' }}/>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};