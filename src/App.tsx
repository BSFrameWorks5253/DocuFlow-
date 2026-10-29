import React, { useState } from 'react';
import { TitleBar } from './components/ui/TitleBar';
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
      {/* 1. Unified Light Studio TitleBar & Navigation */}
      <TitleBar 
        queueCount={activeQueueCount} 
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
      />

      {/* 2. Main Stage Content Area (Full Vertical Screen Height, Zero Clutter) */}
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

      {/* 3. Bottom Studio Brand Bar */}
      <footer className="h-7 bg-white border-t border-slate-200/90 px-4 flex items-center justify-between text-xs text-slate-600 shadow-2xs select-none shrink-0">
        <div className="flex items-center gap-2 font-medium">
          <span className="font-extrabold text-slate-900 tracking-tight">VectorForge Studio</span>
          <span className="font-mono text-[10.5px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/80 font-semibold">
            v1.0.0
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-[11px] text-slate-500">Precision Vector & Document Engineering Workstation</span>
        </div>

        <div className="font-medium text-slate-700 text-[11px]">
          <span>Developer: <strong className="text-slate-900 font-semibold">Burhanuddin Sounasath</strong></span>
        </div>
      </footer>
    </div>
  );
};
