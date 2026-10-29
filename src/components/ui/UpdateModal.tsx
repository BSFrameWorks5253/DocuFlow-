import React, { useState, useEffect } from 'react';
import { Download, Sparkles, CheckCircle2, AlertCircle, X, RefreshCw } from 'lucide-react';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  updateData: any;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({ isOpen, onClose, updateData }) => {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState('');
  const [downloaded, setDownloaded] = useState(false);
  const [installerPath, setInstallerPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!window.electronAPI) return;

    const unsubProgress = window.electronAPI.onUpdateProgress?.((data: any) => {
      setProgress(data.percent || 0);
      setSpeed(data.speed || '');
    });

    const unsubDownloaded = window.electronAPI.onUpdateDownloaded?.((data: any) => {
      setDownloading(false);
      setDownloaded(true);
      setInstallerPath(data.filePath);
    });

    return () => {
      if (unsubProgress) unsubProgress();
      if (unsubDownloaded) unsubDownloaded();
    };
  }, []);

  if (!isOpen || !updateData) return null;

  const handleStartDownload = async () => {
    try {
      setError(null);
      setDownloading(true);
      setProgress(0);
      await window.electronAPI?.downloadUpdate({
        downloadUrl: updateData.downloadUrl,
        setupName: updateData.setupName
      });
    } catch (err: any) {
      setDownloading(false);
      setError(err?.message || 'Download failed');
    }
  };

  const handleInstall = () => {
    try {
      window.electronAPI?.installUpdate(installerPath || undefined);
    } catch (err: any) {
      setError(err?.message || 'Failed to launch installer');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-sky-50 via-white to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20 font-black text-sm">
              Df
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">DocuFlow Studio Pro Update</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">
                  v{updateData.version}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Current: v{updateData.currentVersion || '1.0.0'} · {updateData.sizeFormatted || 'Setup Package'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-slate-600">
          <div className="space-y-1.5">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-sky-500" />
              What's New in this Release:
            </span>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-slate-700 max-h-36 overflow-y-auto font-sans">
              {(updateData.releaseNotes || []).map((note: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-sky-500 mt-0.5">•</span>
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Download Progress */}
          {downloading && (
            <div className="space-y-2 pt-2">
              <div className="flex justify-between font-mono text-[11px] text-slate-600">
                <span>Downloading {updateData.setupName}...</span>
                <span>{progress}% {speed && `(${speed})`}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {downloaded && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
              <span className="font-medium">Installer downloaded and verified successfully! Ready to restart and install.</span>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 font-semibold text-xs transition"
          >
            Later
          </button>

          {!downloaded ? (
            <button
              onClick={handleStartDownload}
              disabled={downloading}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all ${
                downloading
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/25 hover:scale-105'
              }`}
            >
              {downloading ? (
                <>
                  <RefreshCw className="size-3.5 animate-spin" />
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="size-3.5" />
                  <span>Download & Install Setup</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleInstall}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/25 hover:scale-105 transition-all"
            >
              <CheckCircle2 className="size-3.5" />
              <span>Restart & Complete Setup</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
