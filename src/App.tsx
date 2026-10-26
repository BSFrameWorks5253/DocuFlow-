import React, { useState } from 'react';
import { TitleBar } from './components/ui/TitleBar';
import { NavigationRibbon } from './components/ui/NavigationRibbon';
import { PdfellaAllToolsHub } from './components/features/PdfellaAllToolsHub';
import { ContextSmartWorkspace } from './components/features/ContextSmartWorkspace';
import { PdfEditorStudio } from './components/features/PdfEditorStudio';
import { PdfMergeStudio } from './components/features/PdfMergeStudio';
import { PdfSplitStudio } from './components/features/PdfSplitStudio';
import { PdfPageStudio } from './components/features/PdfPageStudio';
import { PdfSecurityStudio } from './components/features/PdfSecurityStudio';
import { ReverseConverterStudio } from './components/features/ReverseConverterStudio';
import { ImageGalleryStudio } from './components/features/ImageGalleryStudio';
import { OfficeConverterStudio } from './components/features/OfficeConverterStudio';
import { CadToPdfStudio } from './components/features/CadToPdfStudio';
import { NavigationTab } from './types';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('all-tools');
  const [activeQueueCount, setActiveQueueCount] = useState<number>(0);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#F8FAFC] text-slate-800 select-none overflow-hidden font-sans">
      {/* 1. Light Studio TitleBar */}
      <TitleBar queueCount={activeQueueCount} />

      {/* 2. PDFella Tool Directory Ribbon */}
      <NavigationRibbon
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
      />

      {/* 3. Main Stage Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {currentTab === 'all-tools' && (
          <PdfellaAllToolsHub
            onSelectTool={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'workspace' && (
          <ContextSmartWorkspace
            onFilesChange={setActiveQueueCount}
          />
        )}

        {currentTab === 'pdf-editor' && (
          <PdfEditorStudio />
        )}

        {currentTab === 'pdf-merge' && (
          <PdfMergeStudio />
        )}

        {currentTab === 'pdf-split' && (
          <PdfSplitStudio />
        )}

        {currentTab === 'pdf-organizer' && (
          <PdfPageStudio />
        )}

        {currentTab === 'pdf-security' && (
          <PdfSecurityStudio />
        )}

        {currentTab === 'reverse-suite' && (
          <ReverseConverterStudio />
        )}

        {currentTab === 'image-gallery' && (
          <ImageGalleryStudio />
        )}

        {currentTab === 'office-suite' && (
          <OfficeConverterStudio />
        )}

        {currentTab === 'cad-studio' && (
          <CadToPdfStudio />
        )}
      </main>

      {/* 4. Bottom Studio Brand Bar */}
      <footer className="h-7 bg-white border-t border-slate-200/90 px-4 flex items-center justify-between text-xs text-slate-600 shadow-2xs select-none shrink-0">
        <div className="flex items-center gap-2 font-medium">
          <span className="font-bold text-slate-900">DocuFlow Studio Pro</span>
          <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/80 font-semibold">
            v26.10.26
          </span>
        </div>

        <div className="font-medium text-slate-700">
          <span>Burhanuddin Sounasath</span>
        </div>
      </footer>
    </div>
  );
};
