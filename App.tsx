import React, { useState, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { Spinner } from './components/ui/Spinner';
import { generateIdeas, remixIdeas } from './services/geminiService';
import type { Idea, VideoType, ViewMode, MixMode, RemixedIdea } from './types';

const App: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [remixedIdeas, setRemixedIdeas] = useState<RemixedIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRemixing, setIsRemixing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [remixError, setRemixError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [isRemixView, setIsRemixView] = useState<boolean>(false);

  const resetAllViews = () => {
    setSelectedIdea(null);
    setIsRemixView(false);
    setRemixedIdeas([]);
    setRemixError(null);
  };

  const handleGenerate = useCallback(async (keywords: string, videoType: VideoType, creativeOverdrive: boolean, informationDepth: number) => {
    setIsLoading(true);
    setError(null);
    setIdeas([]);
    resetAllViews();
    try {
      const generatedIdeas = await generateIdeas(keywords, videoType, creativeOverdrive, informationDepth);
      setIdeas(generatedIdeas);
      setViewMode('dashboard');
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'Lỗi không xác định';
      setError(`Không thể tạo ý tưởng. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRemix = useCallback(async (newKeywords: string, mixMode: MixMode) => {
    setIsRemixing(true);
    setRemixError(null);
    setRemixedIdeas([]);
    setSelectedIdea(null);
    try {
      const result = await remixIdeas(newKeywords, ideas, mixMode);
      setRemixedIdeas(result);
      setIsRemixView(true);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'Lỗi không xác định';
      setRemixError(`Không thể trộn ý tưởng. ${errorMessage}`);
    } finally {
      setIsRemixing(false);
    }
  }, [ideas]);

  const handleSelectIdea = useCallback((idea: Idea) => {
    setSelectedIdea(idea);
    setIsRemixView(false); // Exit remix view when selecting a normal idea
  }, []);
  
  const handleClearSelection = useCallback(() => {
    resetAllViews();
  }, []);

  const displayedIdeas = useMemo(() => {
    return ideas.sort((a, b) => b.totalScore - a.totalScore);
  }, [ideas]);

  const currentLoadingMessage = isRemixing ? "AI đang trộn và mở rộng ý tưởng..." : "AI đang sáng tạo ý tưởng...";

  return (
    <div className="flex flex-col h-screen font-sans bg-brand-dark text-brand-text">
      <Header 
        onGenerate={handleGenerate} 
        onRemix={handleRemix}
        setViewMode={setViewMode} 
        activeViewMode={viewMode} 
        hasIdeas={ideas.length > 0} 
        onLogoClick={handleClearSelection}
        isRemixing={isRemixing}
        isRemixView={isRemixView}
      />
      <div className="flex-grow flex overflow-hidden">
        {ideas.length > 0 && (
          <Sidebar ideas={displayedIdeas} onSelectIdea={handleSelectIdea} selectedIdea={selectedIdea} />
        )}
        <main className="flex-1 flex flex-col overflow-y-auto p-4 md:p-6 lg:p-8 bg-brand-dark">
          {(isLoading || isRemixing) && (
            <div className="flex-grow flex items-center justify-center">
              <div className="text-center">
                <Spinner />
                <p className="mt-4 text-brand-text-muted">{currentLoadingMessage}</p>
              </div>
            </div>
          )}
          {!(isLoading || isRemixing) && (error || remixError) && (
            <div className="flex-grow flex items-center justify-center">
              <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Lỗi: </strong>
                <span className="block sm:inline">{error || remixError}</span>
              </div>
            </div>
          )}
          {!(isLoading || isRemixing) && !error && !remixError && (
            <MainContent 
              ideas={displayedIdeas}
              remixedIdeas={remixedIdeas}
              selectedIdea={selectedIdea} 
              viewMode={viewMode}
              isRemixView={isRemixView}
              onSelectIdea={handleSelectIdea} 
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
