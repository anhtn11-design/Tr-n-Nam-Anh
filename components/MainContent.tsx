import React from 'react';
import type { Idea, ViewMode, RemixedIdea } from '../types';
import { DashboardView } from './views/DashboardView';
import { MatrixTableView } from './views/MatrixTableView';
import { MatrixChartView } from './views/MatrixChartView';
import { IdeaDetailView } from './views/IdeaDetailView';
import { RemixView } from './views/RemixView';

interface MainContentProps {
  ideas: Idea[];
  remixedIdeas: RemixedIdea[];
  selectedIdea: Idea | null;
  viewMode: ViewMode;
  isRemixView: boolean;
  onSelectIdea: (idea: Idea) => void;
}

const WelcomeScreen: React.FC = () => (
    <div className="flex-grow flex items-center justify-center">
        <div className="text-center p-8 bg-brand-surface rounded-xl shadow-lg max-w-2xl mx-auto">
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="text-3xl font-bold text-brand-text mb-2">Chào mừng đến với Ma Trận Ý Tưởng TikTok</h2>
            <p className="text-brand-text-muted mb-6">
                Nhập từ khóa liên quan đến chiến dịch, sản phẩm, hoặc insight học sinh vào thanh tìm kiếm phía trên để bắt đầu tạo ý tưởng video lan truyền. AI sẽ phân tích, chấm điểm, và tối ưu hóa nội dung cho bạn.
            </p>
            <div className="bg-brand-dark p-4 rounded-lg text-left text-sm">
                <p className="font-mono text-brand-text-muted">Ví dụ từ khóa:</p>
                <ul className="list-disc list-inside mt-2 font-mono text-brand-primary">
                    <li>Thi thử TSA, 2k8, mất gốc Hóa</li>
                    <li>Luyện đề HSA, phụ huynh chọn sách ôn thi</li>
                    <li>Review khóa học online</li>
                </ul>
            </div>
        </div>
    </div>
);


export const MainContent: React.FC<MainContentProps> = ({ ideas, remixedIdeas, selectedIdea, viewMode, isRemixView, onSelectIdea }) => {
  if (isRemixView) {
    return <RemixView remixedIdeas={remixedIdeas} />;
  }
  
  if (selectedIdea) {
    return <IdeaDetailView idea={selectedIdea} />;
  }
  
  if (ideas.length === 0) {
    return <WelcomeScreen />;
  }

  switch (viewMode) {
    case 'dashboard':
      return <DashboardView ideas={ideas} onSelectIdea={onSelectIdea} />;
    case 'matrix':
      return <MatrixTableView ideas={ideas} onSelectIdea={onSelectIdea}/>;
    case 'chart':
      return <MatrixChartView ideas={ideas} onSelectIdea={onSelectIdea}/>;
    default:
      return <DashboardView ideas={ideas} onSelectIdea={onSelectIdea} />;
  }
};
