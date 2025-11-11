import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Idea } from '../../types';
import { Card } from '../ui/Card';

interface MatrixChartViewProps {
  ideas: Idea[];
  onSelectIdea: (idea: Idea) => void;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-2 bg-brand-surface border border-brand-muted rounded-lg shadow-lg text-sm">
        <p className="font-bold text-brand-primary">{data.title}</p>
        <p>Tác động: {data.y.toFixed(2)}</p>
        <p>Khả thi: {data.x.toFixed(2)}</p>
        <p>Tổng điểm: {data.z.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

export const MatrixChartView: React.FC<MatrixChartViewProps> = ({ ideas, onSelectIdea }) => {
  const chartData = ideas.map(idea => ({
    x: idea.scores.feasibility,
    y: idea.scores.viralPotential,
    z: idea.totalScore,
    title: idea.title,
    implementation: idea.implementationSuggestion,
    original: idea,
  }));

  const inHouseData = chartData.filter(d => d.implementation === 'Nội bộ');
  const kocData = chartData.filter(d => d.implementation === 'KOC/CTV');

  return (
    <Card className="p-4 h-[70vh] animate-fade-in">
      <h2 className="text-xl font-bold mb-4">Ma trận Tác động vs. Khả thi</h2>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#EAE6E1" />
          <XAxis 
            type="number" 
            dataKey="x" 
            name="Khả thi" 
            unit="" 
            domain={[1, 5]} 
            label={{ value: "Mức độ khả thi →", position: 'insideBottom', offset: -10 }}
            stroke="#6B7281"
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            name="Tác động / Tiềm năng Viral" 
            unit="" 
            domain={[1, 5]} 
            label={{ value: "← Mức độ tác động", angle: -90, position: 'insideLeft' }}
            stroke="#6B7281"
          />
          <ZAxis type="number" dataKey="z" range={[60, 400]} name="Tổng điểm" unit="" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
          <Legend />
          <Scatter 
            name="Nội bộ" 
            data={inHouseData} 
            fill="#BFBFE3" 
            shape="circle" 
            onClick={(props) => onSelectIdea(props.original)} 
            className="cursor-pointer"
          />
          <Scatter 
            name="KOC/CTV" 
            data={kocData} 
            fill="#C4E2E4" 
            shape="triangle" 
            onClick={(props) => onSelectIdea(props.original)} 
            className="cursor-pointer"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </Card>
  );
};