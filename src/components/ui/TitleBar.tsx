import React, { useEffect, useState } from 'react';
import { Minus, Square, X, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import { UpdateModal } from './UpdateModal';

interface TitleBarProps {
  queueCount?: number;
  onClearFiles?: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  queueCount = 0
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [updateData, setUpdateData] = useState<any>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.isMaximized().then(setIsMaximized);

      // Listen for auto-detected updates from main process
      const unsub = window.electronAPI.onUpdateAvailable?.((data: any) => {
        if (data?.hasUpdate) {
          setUpdateData(data);
        }
      });

      // Initial check after 3 seconds
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

  return (
    <>
      <div className="h-11 bg-white border-b border-slate-200/90 flex items-center justify-between px-3.5 select-none [-webkit-app-region:drag] z-50 shadow-2xs">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 [-webkit-app-region:no-drag]">
          <div className="flex items-center gap-2.5">
            {/* High-Definition App Monogram Tile */}
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
        </div>

        {/* Center Engine Privacy & Active Files Badge */}
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
              {queueCount} active {queueCount === 1 ? 'document' : 'documents'}
            </span>
          )}
        </div>

        {/* Windows 11 Controls & Check Update */}
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
