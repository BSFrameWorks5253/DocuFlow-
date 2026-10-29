import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  close: () => ipcRenderer.invoke('window-close'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  openFilesDialog: (options?: { filters?: Array<{ name: string; extensions: string[] }> }) =>
    ipcRenderer.invoke('dialog-open-files', options),
  saveFileDialog: (options: { defaultName?: string; buffer: ArrayBuffer; filterName?: string; extension?: string }) =>
    ipcRenderer.invoke('dialog-save-file', options),
  revealInFolder: (filePath: string) => ipcRenderer.invoke('reveal-in-folder', filePath),
  selectFolderDialog: () => ipcRenderer.invoke('dialog-select-folder'),
  saveFileToFolder: (options: { folderPath: string; fileName: string; buffer: ArrayBuffer }) =>
    ipcRenderer.invoke('save-file-to-folder', options),
  saveFilesBatch: (options: { baseDir: string; subFolder?: string; files: Array<{ name: string; buffer: ArrayBuffer }> }) =>
    ipcRenderer.invoke('save-files-batch', options),
  convertDwgToDxf: (dwgBuffer: ArrayBuffer) =>
    ipcRenderer.invoke('cad-convert-dwg-to-dxf', dwgBuffer),
  checkForUpdates: (customDir?: string) => ipcRenderer.invoke('update:check', customDir),
  downloadUpdate: (options: { downloadUrl: string; setupName: string }) => ipcRenderer.invoke('update:download', options),
  installUpdate: (installerPath?: string) => ipcRenderer.invoke('update:install', installerPath),
  onUpdateAvailable: (callback: (data: any) => void) => {
    const handler = (_: any, data: any) => callback(data);
    ipcRenderer.on('update:available', handler);
    return () => ipcRenderer.removeListener('update:available', handler);
  },
  onUpdateProgress: (callback: (data: any) => void) => {
    const handler = (_: any, data: any) => callback(data);
    ipcRenderer.on('update:progress', handler);
    return () => ipcRenderer.removeListener('update:progress', handler);
  },
  onUpdateDownloaded: (callback: (data: any) => void) => {
    const handler = (_: any, data: any) => callback(data);
    ipcRenderer.on('update:downloaded', handler);
    return () => ipcRenderer.removeListener('update:downloaded', handler);
  }
});
