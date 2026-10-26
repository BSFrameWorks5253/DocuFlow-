export type NavigationTab = 
  | 'all-tools'
  | 'workspace'
  | 'pdf-editor'
  | 'pdf-merge'
  | 'pdf-split'
  | 'pdf-organizer'
  | 'pdf-security'
  | 'reverse-suite'
  | 'image-gallery'
  | 'office-suite'
  | 'cad-studio';

export type SupportedFileType = 
  | 'docx'
  | 'xlsx'
  | 'xls'
  | 'pptx'
  | 'dxf'
  | 'jpg'
  | 'jpeg'
  | 'png'
  | 'webp'
  | 'pdf'
  | 'txt'
  | 'unknown';

export interface QueueItem {
  id: string;
  name: string;
  size: number;
  type: SupportedFileType;
  bytes: Uint8Array;
  status: 'queued' | 'converting' | 'completed' | 'error';
  error?: string;
  convertedBytes?: Uint8Array;
  previewUrl?: string;
}

export interface ImageGalleryItem {
  id: string;
  name: string;
  size: number;
  bytes: Uint8Array;
  previewUrl: string;
  rotation: number;
  width: number;
  height: number;
}

export interface CadStudioConfig {
  theme: 'blueprint' | 'monochrome' | 'layers';
  paperSize: 'a4' | 'a3' | 'a2' | 'a1';
  orientation: 'landscape' | 'portrait';
  scaleToFit: boolean;
}

export interface ElectronAPI {
  minimize: () => Promise<void>;
  maximize: () => Promise<void>;
  close: () => Promise<void>;
  isMaximized: () => Promise<boolean>;
  openFilesDialog: (options?: { filters?: Array<{ name: string; extensions: string[] }> }) => Promise<any>;
  saveFileDialog: (options: { defaultName?: string; buffer: ArrayBuffer; filterName?: string; extension?: string }) => Promise<string | null>;
  revealInFolder: (filePath: string) => Promise<void>;
  selectFolderDialog: () => Promise<string | null>;
  saveFileToFolder: (options: { folderPath: string; fileName: string; buffer: ArrayBuffer }) => Promise<string>;
  saveFilesBatch: (options: { baseDir: string; subFolder?: string; files: Array<{ name: string; buffer: ArrayBuffer }> }) => Promise<{ targetDir: string; savedPaths: string[] }>;
  convertDwgToDxf: (dwgBuffer: ArrayBuffer) => Promise<{ success: boolean; dxfContent?: string; error?: string }>;
  checkForUpdates: (customDir?: string) => Promise<any>;
  downloadUpdate: (options: { downloadUrl: string; setupName: string }) => Promise<string>;
  installUpdate: (installerPath?: string) => Promise<{ success: boolean }>;
  onUpdateAvailable: (callback: (data: any) => void) => () => void;
  onUpdateProgress: (callback: (data: any) => void) => () => void;
  onUpdateDownloaded: (callback: (data: any) => void) => () => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
