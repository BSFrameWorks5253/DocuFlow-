import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

// Enable GPU Hardware Acceleration & Low-Latency 2D Canvas Rasterization
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('enable-accelerated-2d-canvas');
app.commandLine.appendSwitch('enable-features', 'CanvasOopRasterization');

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1320,
    height: 860,
    minWidth: 1000,
    minHeight: 680,
    backgroundColor: '#F8FAFC',
    show: false,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webSecurity: false
    },
    icon: path.join(__dirname, '../public/icon.ico')
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

  if (isDev) {
    const loadDev = () => {
      mainWindow?.loadURL('http://localhost:5174').catch(() => {
        setTimeout(loadDev, 300);
      });
    };
    loadDev();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Window controls
ipcMain.handle('window-minimize', () => mainWindow?.minimize());
ipcMain.handle('window-maximize', () => {
  if (mainWindow?.isMaximized()) mainWindow.unmaximize();
  else mainWindow?.maximize();
});
ipcMain.handle('window-close', () => mainWindow?.close());
ipcMain.handle('window-is-maximized', () => mainWindow?.isMaximized() || false);

// File Dialogs
ipcMain.handle('dialog-open-files', async (_event, options) => {
  if (!mainWindow) return null;
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: options?.filters || [
      { name: 'All Formats (Word, Excel, Images, CAD, PDFs)', extensions: ['docx', 'xlsx', 'xls', 'dwg', 'dxf', 'jpg', 'jpeg', 'png', 'webp', 'pdf', 'txt'] },
      { name: 'AutoCAD Drawings (*.dwg, *.dxf)', extensions: ['dwg', 'dxf'] },
      { name: 'Word Documents (*.docx)', extensions: ['docx'] },
      { name: 'Excel Sheets (*.xlsx, *.xls)', extensions: ['xlsx', 'xls'] },
      { name: 'Images (*.jpg, *.png, *.webp)', extensions: ['jpg', 'jpeg', 'png', 'webp'] },
      { name: 'PDF Documents (*.pdf)', extensions: ['pdf'] },
      { name: 'All Files (*.*)', extensions: ['*'] }
    ]
  });

  if (result.canceled || result.filePaths.length === 0) return null;

  return result.filePaths.map((fp) => {
    const stats = fs.statSync(fp);
    const data = fs.readFileSync(fp);
    return {
      path: fp,
      name: path.basename(fp),
      size: stats.size,
      buffer: data.buffer
    };
  });
});

function toNodeBuffer(buf: any): Buffer {
  if (!buf) return Buffer.alloc(0);
  if (Buffer.isBuffer(buf)) return buf;
  if (buf instanceof ArrayBuffer) return Buffer.from(buf);
  if (ArrayBuffer.isView(buf)) return Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength);
  if (typeof buf === 'object' && Array.isArray(buf.data)) return Buffer.from(buf.data);
  if (typeof buf === 'object' && buf.buffer) return toNodeBuffer(buf.buffer);
  return Buffer.from(buf);
}

ipcMain.handle('dialog-save-file', async (_event, { defaultName, buffer, filterName, extension }) => {
  if (!mainWindow) return null;
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: defaultName || 'Converted_Document.pdf',
    filters: [{ name: filterName || 'PDF Document (*.pdf)', extensions: [extension || 'pdf'] }]
  });

  if (result.canceled || !result.filePath) return null;

  try {
    const nodeBuf = toNodeBuffer(buffer);
    fs.writeFileSync(result.filePath, nodeBuf);
    shell.showItemInFolder(result.filePath);
    return result.filePath;
  } catch (err: any) {
    console.error('Failed to write saved file:', err);
    throw err;
  }
});

ipcMain.handle('reveal-in-folder', async (_event, filePath) => {
  if (filePath) {
    shell.showItemInFolder(filePath);
  }
});

ipcMain.handle('dialog-select-folder', async () => {
  if (!mainWindow) return null;
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory', 'createDirectory']
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});

ipcMain.handle('save-file-to-folder', async (_event, { folderPath, fileName, buffer }) => {
  const targetPath = path.join(folderPath, fileName);
  fs.writeFileSync(targetPath, toNodeBuffer(buffer));
  shell.showItemInFolder(targetPath);
  return targetPath;
});

ipcMain.handle('save-files-batch', async (_event, { baseDir, subFolder, files }) => {
  const targetDir = subFolder ? path.join(baseDir, subFolder) : baseDir;
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const savedPaths: string[] = [];
  for (const f of files) {
    const filePath = path.join(targetDir, f.name);
    fs.writeFileSync(filePath, toNodeBuffer(f.buffer));
    savedPaths.push(filePath);
  }

  if (savedPaths.length > 0) {
    shell.showItemInFolder(savedPaths[0]);
  } else {
    shell.showItemInFolder(targetDir);
  }
  return { targetDir, savedPaths };
});

// AutoCAD DWG to DXF Conversion via LibreDWG Wasm
ipcMain.handle('cad-convert-dwg-to-dxf', async (_event, dwgBuffer: ArrayBuffer) => {
  try {
    const { convertDwgToDxf } = require('dwg2dxf-converter');
    const tempDir = app.getPath('temp');
    const randSuffix = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const tempDwgPath = path.join(tempDir, `dwg_${randSuffix}.dwg`);
    const tempDxfPath = path.join(tempDir, `dwg_${randSuffix}.dxf`);

    fs.writeFileSync(tempDwgPath, toNodeBuffer(dwgBuffer));

    const result = await convertDwgToDxf(tempDwgPath, tempDxfPath, { timeout: 60000 });

    try {
      if (fs.existsSync(tempDwgPath)) fs.unlinkSync(tempDwgPath);
    } catch {}

    if (!result.success || !fs.existsSync(tempDxfPath)) {
      throw new Error(result.error || 'Failed to convert AutoCAD DWG drawing');
    }

    const dxfContent = fs.readFileSync(tempDxfPath, 'utf8');

    try {
      if (fs.existsSync(tempDxfPath)) fs.unlinkSync(tempDxfPath);
    } catch {}

    return { success: true, dxfContent };
  } catch (err: any) {
    console.error('Error in cad-convert-dwg-to-dxf:', err);
    return { success: false, error: err.message || 'AutoCAD DWG conversion failed' };
  }
});
