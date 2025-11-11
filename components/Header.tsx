import React, { useState } from 'react';
import type { VideoType, ViewMode, MixMode } from '../types';

interface HeaderProps {
  onGenerate: (keywords: string, videoType: VideoType, creativeOverdrive: boolean, informationDepth: number) => void;
  onRemix: (newKeywords: string, mixMode: MixMode) => void;
  setViewMode: (mode: ViewMode) => void;
  activeViewMode: ViewMode;
  hasIdeas: boolean;
  onLogoClick: () => void;
  isRemixing: boolean;
  isRemixView: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onGenerate, onRemix, setViewMode, activeViewMode, hasIdeas, onLogoClick, isRemixing, isRemixView }) => {
  const [keywords, setKeywords] = useState<string>('');
  const [videoType, setVideoType] = useState<VideoType>('all');
  const [creativeOverdrive, setCreativeOverdrive] = useState<boolean>(false);
  const [informationDepth, setInformationDepth] = useState<number>(3);
  const [newKeywords, setNewKeywords] = useState<string>('');
  const [mixMode, setMixMode] = useState<MixMode>('remix');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keywords.trim()) {
      onGenerate(keywords, videoType, creativeOverdrive, informationDepth);
    }
  };

  const handleRemixSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKeywords.trim()) {
      onRemix(newKeywords, mixMode);
    }
  };

  const ViewButton: React.FC<{ mode: ViewMode; label: string }> = ({ mode, label }) => (
    <button
      onClick={() => setViewMode(mode)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
        activeViewMode === mode && !isRemixView
          ? 'bg-brand-primary text-white shadow-sm' 
          : 'bg-transparent text-brand-text-muted hover:bg-gray-100'
      }`}
      disabled={isRemixView}
    >
      {label}
    </button>
  );

  return (
    <header className="flex-shrink-0 bg-brand-surface border-b border-brand-border p-4 shadow-sm z-10">
      <div className="flex flex-col items-center justify-between gap-4">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 cursor-pointer" onClick={onLogoClick}>
            <div className="bg-brand-primary p-2 rounded-lg shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
            </div>
            <h1 className="text-xl font-bold text-brand-text-main">HOCMAI: Ma Trận Ý Tưởng TikTok</h1>
          </div>

          <form onSubmit={handleSubmit} className="flex-grow md:max-w-xl w-full flex flex-col items-center gap-2">
            <div className="w-full flex items-center gap-2">
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Từ khóa: 'luyện đề HSA', '2k8 mất gốc Toán'..."
                className="w-full px-4 py-2 bg-gray-50 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
              />
              <select 
                value={videoType} 
                onChange={(e) => setVideoType(e.target.value as VideoType)}
                className="px-3 py-2 bg-gray-50 border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition appearance-none"
              >
                <option value="all">Tất cả</option>
                <option value="in-house">Nội bộ</option>
                <option value="ctv">CTV Review</option>
                <option value="koc">KOC Lan tỏa</option>
              </select>
              <button type="submit" className="px-5 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-primary-hover transition-colors duration-200">
                Tạo ý tưởng
              </button>
            </div>
            <div className="w-full flex items-center justify-between mt-2">
                <label className="flex items-center gap-2 text-sm text-brand-text-muted cursor-pointer">
                    <input 
                        type="checkbox"
                        checked={creativeOverdrive}
                        onChange={(e) => setCreativeOverdrive(e.target.checked)}
                        className="w-4 h-4 rounded bg-gray-50 border-brand-border text-brand-primary focus:ring-brand-primary"
                    />
                    Đột phá Sáng tạo
                </label>
                <div className="flex items-center gap-2 text-sm text-brand-text-muted">
                    <label htmlFor="depth-slider" className="whitespace-nowrap">Độ sâu:</label>
                    <input 
                        id="depth-slider"
                        type="range"
                        min="1"
                        max="5"
                        value={informationDepth}
                        onChange={(e) => setInformationDepth(Number(e.target.value))}
                        className="w-20 md:w-24 cursor-pointer"
                        title={`Độ sâu thông tin: ${informationDepth}`}
                    />
                    <span className="font-mono text-brand-text-main">{informationDepth}</span>
                </div>
            </div>
          </form>

          {hasIdeas && (
            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-brand-border">
              <ViewButton mode="dashboard" label="Bảng tin" />
              <ViewButton mode="matrix" label="Ma trận" />
              <ViewButton mode="chart" label="Biểu đồ" />
            </div>
          )}
        </div>
        
        {hasIdeas && (
          <div className="w-full mt-2 p-4 bg-gray-50/50 rounded-lg border border-brand-border">
             <form onSubmit={handleRemixSubmit} className="flex flex-col md:flex-row items-center gap-3">
              <label className="text-md font-semibold text-brand-primary whitespace-nowrap">Trộn & Mở Rộng Ý Tưởng:</label>
              <input
                type="text"
                value={newKeywords}
                onChange={(e) => setNewKeywords(e.target.value)}
                placeholder="Thêm từ khóa mới '2k9', 'voucher'..."
                className="flex-grow w-full px-4 py-2 bg-brand-surface border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
              />
              <select 
                value={mixMode} 
                onChange={(e) => setMixMode(e.target.value as MixMode)}
                className="px-3 py-2 bg-brand-surface border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition appearance-none"
              >
                <option value="remix">Remix</option>
                <option value="spin-off">Spin-off</option>
                <option value="cross-theme">Cross-theme</option>
              </select>
              <button type="submit" disabled={isRemixing} className="px-5 py-2 bg-brand-secondary text-white font-semibold rounded-lg hover:bg-teal-400 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed">
                {isRemixing ? 'Đang xử lý...' : 'Thực hiện'}
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
};