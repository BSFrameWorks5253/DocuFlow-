import React, { useEffect, useState } from 'react';
import { Minus, Square, X } from 'lucide-react';

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
  );
};
