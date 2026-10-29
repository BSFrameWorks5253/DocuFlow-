import React from 'react';
import { 
  Grid,
  UploadCloud,
  PenTool,
  Layers,
  Scissors,
  ShieldCheck,
  RefreshCcw,
  Image as ImageIcon,
  FileSpreadsheet,
  Compass,
  FileDigit
} from 'lucide-react';
import { NavigationTab } from '../../types';

interface NavigationRibbonProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export const NavigationRibbon: React.FC<NavigationRibbonProps> = ({
  currentTab,
  onTabChange
}) => {
  const tabs: Array<{
    id: NavigationTab;
    label: string;
    icon: any;
    badge?: string;
  }> = [
    {
      id: 'all-tools',
      label: 'All Tools Hub',
      icon: Grid
    },
    {
      id: 'workspace',
      label: 'Auto Dropzone',
      icon: UploadCloud,
      badge: 'Batch'
    },
    {
      id: 'pdf-editor',
      label: 'Edit & Sign',
      icon: PenTool
    },
    {
      id: 'pdf-merge',
      label: 'Merge & Fusion',
      icon: Layers
    },
    {
      id: 'pdf-split',
      label: 'Split PDF',
      icon: Scissors
    },
    {
      id: 'pdf-organizer',
      label: 'Page Studio',
      icon: FileDigit
    },
    {
      id: 'cad-studio',
      label: 'CAD Blueprint',
      icon: Compass,
      badge: 'DWG'
    },
    {
      id: 'office-suite',
      label: 'Office to PDF',
      icon: FileSpreadsheet
    },
    {
      id: 'reverse-suite',
      label: 'PDF to Office & OCR',
      icon: RefreshCcw
    },
    {
      id: 'image-gallery',
      label: 'Photos to PDF',
      icon: ImageIcon
    },
    {
      id: 'pdf-security',
      label: 'Security & Stamp',
      icon: ShieldCheck
    }
  ];

  return (
    <div className="h-12 bg-white border-b border-slate-200/90 px-3 flex items-center justify-between select-none shadow-2xs shrink-0">
      <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-1 w-full">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = currentTab === t.id;

          return (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 border cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100 hover:border-slate-200/60'
              }`}
            >
              <Icon className={`size-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
              <span>{t.label}</span>
              {t.badge && (
                <span className={`text-[9.5px] px-1 py-0.2 rounded font-mono font-bold uppercase ${
                  isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}>
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
