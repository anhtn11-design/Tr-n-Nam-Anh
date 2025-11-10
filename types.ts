export interface Score {
  relevance: number;
  viralPotential: number;
  feasibility: number;
  audienceFit: number;
  brandFit: number;
  novelty: number;
  trendFit: number;
  engagementPotential: number;
  productFit: number;
  emotionImpact: number;
}

export interface OptimizedMiniHook {
  text: string;
  formula: string;
  retentionScore: number;
}

export interface Idea {
  id: string;
  title: string; // Ý tưởng gốc
  
  // Ý tưởng nâng cấp từ Creative Booster
  upgradedTitle: string;
  creativeStrategy: string; // NEW: Góc nhìn mới, Kết nối bất ngờ, Cảm xúc sâu
  variationType: string; // NEW: Truyền cảm hứng, Bắt trend, Hài hước thông minh
  mainEmotion: string;
  viralScore: number;

  // Các trường còn lại áp dụng cho ý tưởng đã nâng cấp
  contentSummary: string;
  scriptDirection: string;
  category: string;
  scores: Score;
  totalScore: number;
  priority: '⭐ Top Tier' | '⚙️ Thử nghiệm' | '💤 Lưu trữ' | string;
  implementationSuggestion: 'Nội bộ' | 'KOC/CTV' | string;
  videoFormat: string;
  hooks: {
    full: string[];
    mini: OptimizedMiniHook[];
    reverse: string[];
  };
  captions: string[];
  hashtagPack: string[];
  formatRemixes: string[];
  toneRemixes: {
    tone: string;
    upgradedTitle: string;
  }[];
}

export type VideoType = 'all' | 'in-house' | 'ctv' | 'koc';

export type ViewMode = 'dashboard' | 'matrix' | 'chart';

export type ScoreCategory = keyof Score;

export type MixMode = 'remix' | 'spin-off' | 'cross-theme';

export interface RemixedIdea {
  id: string;
  originalTheme: string;
  newExpandedIdea: string;
  videoFormat: string;
  communicationGoal: string;
  ideaSource: string;
  newPotentialScore: number;
  hooks: {
    full: string;
    mini: string;
  }[];
  originalIdea: Idea; // To facilitate comparison
}
