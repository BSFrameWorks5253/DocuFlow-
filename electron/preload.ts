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
    ipcRenderer.invoke('cad-convert-dwg-to-dxf', dwgBuffer)
});
