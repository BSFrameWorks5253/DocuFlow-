import React, { useEffect, useState, useRef } from 'react';
import { 
  Minus, 
  Square, 
  X, 
  ShieldCheck, 
  Sparkles, 
  RefreshCw, 
  ArrowLeft,
  ChevronDown,
  Grid,
  PenTool,
  Layers,
  Scissors,
  Compass,
  FileSpreadsheet,
  FileText,
  ImageIcon,
  Lock,
  UploadCloud,
  FileDigit,
  Check
} from 'lucide-react';
import { NavigationTab } from '../../types';
import { UpdateModal } from './UpdateModal';

interface TitleBarProps {
  queueCount?: number;
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onClearFiles?: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  queueCount = 0,
  currentTab,
  onSelectTab
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [updateData, setUpdateData] = useState<any>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.isMaximized().then(setIsMaximized);

      const unsub = window.electronAPI.onUpdateAvailable?.((data: any) => {
        if (data?.hasUpdate) {
          setUpdateData(data);
        }
      });

      setTimeout(() => {
        window.electronAPI?.checkForUpdates?.().then((res: any) => {
          if (res?.hasUpdate) {
            setUpdateData(res);
          }
        }).catch(() => {});
      }, 3000);

      return () => {
        if (unsub) unsub();
      };
    }
  }, []);

  // Close switcher dropdown on outside click or Escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setSwitcherOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSwitcherOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleManualCheck = async () => {
    if (checking || !window.electronAPI) return;
    setChecking(true);
    try {
      const res = await window.electronAPI.checkForUpdates?.();
      if (res?.hasUpdate) {
        setUpdateData(res);
        setUpdateModalOpen(true);
      } else {
        alert('You are already running the latest version of PDF Master Pro!');
      }
    } catch (e: any) {
      console.warn('Manual check error:', e);
    } finally {
      setChecking(false);
    }
  };

  const handleMinimize = () => window.electronAPI?.minimize();
  const handleMaximize = () => {
    window.electronAPI?.maximize();
    setIsMaximized(!isMaximized);
  };
  const handleClose = () => window.electronAPI?.close();

  const toolMeta: Record<NavigationTab, { label: string; icon: any; category: string }> = {
    'all-tools': { label: 'All Tools Hub', icon: Grid, category: 'Home' },
    'workspace': { label: 'Smart Dropzone', icon: UploadCloud, category: 'Workspace' },
    'pdf-editor': { label: 'Edit & Sign Studio', icon: PenTool, category: 'Edit & Sign' },
    'pdf-merge': { label: 'Merge & Fusion Studio', icon: Layers, category: 'Organize' },
    'pdf-split': { label: 'Split PDF Studio', icon: Scissors, category: 'Organize' },
    'pdf-organizer': { label: 'Page Studio', icon: FileDigit, category: 'Organize' },
    'cad-studio': { label: 'CAD Blueprint Studio', icon: Compass, category: 'CAD Engineering' },
    'office-suite': { label: 'Office to PDF Studio', icon: FileSpreadsheet, category: 'Convert' },
    'reverse-suite': { label: 'PDF to Office & OCR', icon: FileText, category: 'Convert' },
    'image-gallery': { label: 'Photos to PDF Album', icon: ImageIcon, category: 'Convert' },
    'pdf-security': { label: 'Security & Optimization', icon: Lock, category: 'Security' }
  };

  const currentTool = toolMeta[currentTab] || toolMeta['all-tools'];
  const CurrentIcon = currentTool.icon;

  const quickSwitchTools: Array<{ id: NavigationTab; label: string; icon: any }> = [
    { id: 'all-tools', label: 'All Tools Hub', icon: Grid },
    { id: 'workspace', label: 'Auto Dropzone', icon: UploadCloud },
    { id: 'pdf-editor', label: 'Edit & Sign', icon: PenTool },
    { id: 'pdf-merge', label: 'Merge & Fusion', icon: Layers },
    { id: 'pdf-split', label: 'Split PDF', icon: Scissors },
    { id: 'pdf-organizer', label: 'Page Studio', icon: FileDigit },
    { id: 'cad-studio', label: 'CAD to Blueprint', icon: Compass },
    { id: 'office-suite', label: 'Office to PDF', icon: FileSpreadsheet },
    { id: 'reverse-suite', label: 'PDF to Office & OCR', icon: FileText },
    { id: 'image-gallery', label: 'Photos to PDF', icon: ImageIcon },
    { id: 'pdf-security', label: 'Security & Stamp', icon: Lock }
  ];

  return (
    <>
      <div className="h-11 bg-white border-b border-slate-200/90 flex items-center justify-between px-3.5 select-none [-webkit-app-region:drag] z-50 shadow-2xs shrink-0">
        
        {/* LEFT SECTION: BRAND OR BACK TO HUB + ACTIVE TOOL */}
        <div className="flex items-center gap-3 [-webkit-app-region:no-drag]">
          {currentTab === 'all-tools' ? (
            /* Home / Dashboard Brand */
            <div className="flex items-center gap-2.5">
              <div className="size-7 rounded-lg bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-500/40 flex items-center justify-center shadow-xs text-indigo-400 font-black text-[12px] tracking-tight select-none">
                PM
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[13.5px] tracking-tight text-slate-900 flex items-center gap-1.5">
                  PDF Master <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-200 uppercase tracking-wider">PRO</span>
                </span>
                <span className="font-mono text-[10.5px] text-slate-400 font-semibold">
                  v1.0.0
                </span>
              </div>
            </div>
          ) : (
            /* Inside Active Tool Workspace: Clean Breadcrumb & Switcher */
            <div className="flex items-center gap-2.5" ref={switcherRef}>
              <button
                onClick={() => onSelectTab('all-tools')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs flex items-center gap-1.5 transition border border-slate-200/80 cursor-pointer shadow-2xs active:scale-95"
                title="Return to All Tools Hub"
              >
                <ArrowLeft className="size-3.5" />
                <span>All Tools</span>
              </button>

              <div className="h-4 w-px bg-slate-200" />

              {/* Active Tool Badge with Fast Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSwitcherOpen(!switcherOpen)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200/80 text-indigo-950 font-bold text-xs flex items-center gap-2 transition cursor-pointer"
                >
                  <CurrentIcon className="size-3.5 text-indigo-600" />
                  <span>{currentTool.label}</span>
                  <ChevronDown className={`size-3 text-indigo-500 transition-transform ${switcherOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Quick Tool Switcher Menu */}
                {switcherOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
                      Switch Tool
                    </div>
                    {quickSwitchTools.map((t) => {
                      const Icon = t.icon;
                      const isSelected = currentTab === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => {
                            onSelectTab(t.id);
                            setSwitcherOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-50 font-bold text-indigo-950'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={`size-3.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                            <span>{t.label}</span>
                          </div>
                          {isSelected && <Check className="size-3.5 text-indigo-600" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* CENTER ENGINE PRIVACY & ACTIVE FILES BADGE */}
        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-600 font-medium px-2.5 py-0.5 rounded-full bg-slate-50 border border-slate-200/80">
            <ShieldCheck className="size-3 text-emerald-600" />
            <span>100% Offline & Private Engine</span>
          </div>

          {updateData?.hasUpdate && (
            <button
              onClick={() => setUpdateModalOpen(true)}
              className="[-webkit-app-region:no-drag] px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs hover:opacity-95 transition cursor-pointer"
            >
              <Sparkles className="size-3" />
              Update v{updateData.latestVersion} Ready
            </button>
          )}

          {queueCount > 0 && (
            <span className="bg-indigo-50 text-indigo-700 font-mono text-[11px] font-bold px-2 py-0.5 rounded-full border border-indigo-200 shadow-2xs">
              {queueCount} active {queueCount === 1 ? 'file' : 'files'}
            </span>
          )}
        </div>

        {/* RIGHT SECTION: WINDOW CONTROLS & CHECK UPDATE */}
        <div className="flex items-center gap-1 [-webkit-app-region:no-drag]">
          <button
            onClick={handleManualCheck}
            disabled={checking}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition"
            title="Check for Updates"
          >
            <RefreshCw className={`size-3.5 ${checking ? 'animate-spin text-indigo-600' : ''}`} />
          </button>

          <button
            onClick={handleMinimize}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition"
            title="Minimize"
          >
            <Minus className="size-3.5" />
          </button>
          <button
            onClick={handleMaximize}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition"
            title="Maximize"
          >
            <Square className="size-3.5" />
          </button>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-500 hover:text-white hover:bg-rose-600 rounded-md transition ml-0.5"
            title="Close"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Auto-Updater Modal */}
      {updateModalOpen && updateData && (
        <UpdateModal
          updateData={updateData}
          onClose={() => setUpdateModalOpen(false)}
        />
      )}
    </>
  );
};
