import React from 'react';
import { 
  Grid,
  Sparkles,
  PenTool,
  Layers,
  Scissors,
  ShieldCheck,
  RefreshCcw,
  Image as ImageIcon,
  FileSpreadsheet,
  Compass
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
  }> = [
    {
      id: 'all-tools',
      label: 'All Tools Hub',
      icon: Grid
    },
    {
      id: 'workspace',
      label: 'Auto Dropzone',
      icon: Sparkles
    },
    {
      id: 'pdf-editor',
      label: 'Edit & Sign',
      icon: PenTool
    },
    {
      id: 'pdf-merge',
      label: 'Merge PDF',
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
      icon: Layers
    },
    {
      id: 'pdf-security',
      label: 'Security & Watermark',
      icon: ShieldCheck
    },
    {
      id: 'reverse-suite',
      label: 'PDF to Office & Images',
      icon: RefreshCcw
    },
    {
      id: 'image-gallery',
      label: 'Photos to PDF & Word',
      icon: ImageIcon
    },
    {
      id: 'office-suite',
      label: 'Office to PDF',
      icon: FileSpreadsheet
    },
    {
      id: 'cad-studio',
      label: 'CAD to Blueprint',
      icon: Compass
    }
  ];

  return (
    <div className="h-12 bg-white border-b border-slate-200/90 px-4 flex items-center justify-between select-none shadow-2xs shrink-0">
      <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = currentTab === t.id;

          return (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 border ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100/70 border-slate-200/80'
              }`}
            >
              <Icon className={`size-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span className="leading-none">{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
