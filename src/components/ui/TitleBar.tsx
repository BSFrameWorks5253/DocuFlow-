import React, { useEffect, useState } from 'react';
import { Minus, Square, X, ShieldCheck } from 'lucide-react';

interface TitleBarProps {
  queueCount?: number;
  onClearFiles?: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  queueCount = 0,
  onClearFiles
}) => {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.isMaximized().then(setIsMaximized);
    }
  }, []);

  const handleMinimize = () => window.electronAPI?.minimize();
  const handleMaximize = () => {
    window.electronAPI?.maximize();
    setIsMaximized(!isMaximized);
  };
  const handleClose = () => window.electronAPI?.close();

  return (
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

        {queueCount > 0 && (
          <span className="bg-indigo-50 text-indigo-700 font-mono text-[11px] font-bold px-2 py-0.5 rounded-full border border-indigo-200 shadow-2xs">
            {queueCount} active {queueCount === 1 ? 'document' : 'documents'}
          </span>
        )}
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
  );
};
