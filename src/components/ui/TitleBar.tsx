import React, { useEffect, useState } from 'react';
import { Minus, Square, X, Sparkles, RefreshCw } from 'lucide-react';
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
        alert('You are already running the latest version of DocuFlow Studio Pro!');
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
      <div className="h-11 bg-white border-b border-slate-200/90 flex items-center justify-between px-3 select-none [-webkit-app-region:drag] z-50 shadow-sm">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 [-webkit-app-region:no-drag]">
          <div className="flex items-center gap-2.5">
            {/* Adobe-Style Monogram Tile */}
            <div className="size-7 rounded-lg bg-[#080d19] border border-sky-500 flex items-center justify-center shadow-md shadow-sky-500/10 text-sky-400 font-black text-[12.5px] tracking-tight select-none">
              Df
            </div>
            <span className="font-bold text-sm tracking-tight text-slate-900 flex items-center gap-1.5">
              DocuFlow Studio <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-sky-50 text-sky-600 border border-sky-200">PRO</span>
            </span>
            <span className="font-mono text-[10px] text-slate-400 font-semibold">
              v1.0.0
            </span>
          </div>

          {/* Update Available Pill */}
          {updateData?.hasUpdate ? (
            <button
              onClick={() => setUpdateModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-[10px] animate-pulse hover:bg-emerald-100 transition shadow-xs"
              title="Click to view update details and install"
            >
              <Sparkles className="size-3 text-emerald-600" />
              <span>Update to v{updateData.version}</span>
            </button>
          ) : (
            <button
              onClick={handleManualCheck}
              disabled={checking}
              className="text-[10px] font-semibold text-slate-400 hover:text-sky-600 flex items-center gap-1 transition px-1.5 py-0.5 rounded hover:bg-slate-100"
              title="Check for updates from Anything Hub & GitHub"
            >
              <RefreshCw className={`size-2.5 ${checking ? 'animate-spin text-sky-500' : ''}`} />
              <span>{checking ? 'Checking...' : 'Check Updates'}</span>
            </button>
          )}
        </div>

        {/* Center File Counter (if files active) */}
        <div className="text-xs text-slate-500 font-medium truncate flex items-center gap-2">
          {queueCount > 0 ? (
            <span className="bg-sky-50 text-sky-700 font-mono text-[11px] font-semibold px-2 py-0.5 rounded-full border border-sky-200 shadow-xs">
              {queueCount} {queueCount === 1 ? 'file' : 'files'} active
            </span>
          ) : null}
        </div>

        {/* Windows 11 Controls */}
        <div className="flex items-center gap-1 [-webkit-app-region:no-drag]">
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

      {/* Global Update Modal */}
      <UpdateModal
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        updateData={updateData}
      />
    </>
  );
};

