import { app, BrowserWindow, ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { spawn } from 'child_process';
import { URL } from 'url';

export interface DocuFlowUpdateInfo {
  version: string;
  latestVersion: string;
  currentVersion: string;
  hasUpdate: boolean;
  downloadUrl: string;
  setupName: string;
  sizeFormatted?: string;
  releaseNotes: string[];
  source: 'anything-local' | 'anything-catalog' | 'github-api';
  localInstallerPath?: string;
}

export class DocuFlowAutoUpdater {
  private static DEFAULT_REPO = 'BSFrameWorks5253/DocuFlow-';
  private static DEFAULT_ANYTHING_DIR = 'C:\\Users\\Burhanuddin\\OneDrive\\Desktop\\Anything\\Anything';
  private static isDownloading = false;
  private static downloadedInstallerPath: string | null = null;

  public static resolveAnythingDir(customPath?: string): string | null {
    const candidates = [
      customPath,
      this.DEFAULT_ANYTHING_DIR,
      'C:\\Users\\Burhanuddin\\OneDrive\\Desktop\\Anything',
      path.resolve(process.cwd(), '..', 'Anything', 'Anything'),
      path.resolve(process.cwd(), '..', 'Anything'),
      path.resolve(app.getAppPath(), '..', 'Anything', 'Anything'),
      path.resolve(app.getAppPath(), '..', 'Anything')
    ].filter((p): p is string => Boolean(p && typeof p === 'string' && fs.existsSync(p)));

    for (const dir of candidates) {
      const catalogPath = path.join(dir, 'published-apps', 'catalog.json');
      const releaseJson = path.join(dir, 'releases', 'docuflow-studio', 'release.json');
      const releasesDir = path.join(dir, 'releases', 'docuflow-studio');
      if (fs.existsSync(catalogPath) || fs.existsSync(releaseJson) || fs.existsSync(releasesDir)) {
        return dir;
      }
    }
    return null;
  }

  public static compareVersions(v1: string, v2: string): number {
    const p1 = String(v1).replace(/^[vV]/, '').split(/[-_]/)[0].split('.').map(Number);
    const p2 = String(v2).replace(/^[vV]/, '').split(/[-_]/)[0].split('.').map(Number);
    const len = Math.max(p1.length, p2.length);
    for (let i = 0; i < len; i++) {
      const n1 = p1[i] || 0;
      const n2 = p2[i] || 0;
      if (n1 > n2) return 1;
      if (n1 < n2) return -1;
    }
    return 0;
  }

  public static async checkForUpdates(
    mainWindow?: BrowserWindow | null,
    anythingDirPath?: string
  ): Promise<DocuFlowUpdateInfo> {
    const currentVer = (app.getVersion() || '1.0.0').replace(/^[vV]/, '').trim();

    // 1. Check Anything Hub
    const resolvedAnythingDir = this.resolveAnythingDir(anythingDirPath);
    if (resolvedAnythingDir) {
      const anythingUpdate = this.checkAnythingEcosystem(resolvedAnythingDir, currentVer);
      if (anythingUpdate && anythingUpdate.hasUpdate) {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('update:available', anythingUpdate);
        }
        return anythingUpdate;
      }
    }

    // 2. Check GitHub Releases
    try {
      const endpoint = `https://api.github.com/repos/${this.DEFAULT_REPO}/releases/latest`;
      const data = await this.fetchJson(endpoint);

      if (data && data.tag_name) {
        const remoteVer = data.tag_name.replace(/^[vV]/, '').trim();
        const newer = this.compareVersions(remoteVer, currentVer) > 0;
        const assets: any[] = data.assets || [];
        const setupAsset = assets.find((a: any) => a.name.toLowerCase().includes('setup') && a.name.endsWith('.exe')) ||
                           assets.find((a: any) => !a.name.toLowerCase().includes('portable') && a.name.endsWith('.exe')) ||
                           assets.find((a: any) => a.name.endsWith('.exe'));

        const downloadUrl = setupAsset ? setupAsset.browser_download_url : data.html_url;
        const setupName = setupAsset ? setupAsset.name : `DocuFlow_Studio_${remoteVer}_Setup.exe`;

        let notes: string[] = [];
        if (data.body) {
          notes = data.body
            .split('\n')
            .map((l: string) => l.trim().replace(/^[-*•]\s*/, ''))
            .filter((l: string) => l.length > 0 && !l.startsWith('#'))
            .slice(0, 6);
        }
        if (notes.length === 0) notes = ['Universal document fusion & vector PDF engine update'];

        const updateInfo: DocuFlowUpdateInfo = {
          version: remoteVer,
          latestVersion: remoteVer,
          currentVersion: currentVer,
          hasUpdate: newer,
          downloadUrl,
          setupName,
          sizeFormatted: setupAsset ? `${(setupAsset.size / (1024 * 1024)).toFixed(1)} MB` : undefined,
          releaseNotes: notes,
          source: 'github-api'
        };

        if (newer && mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('update:available', updateInfo);
        }
        return updateInfo;
      }
    } catch (err: any) {
      console.warn('[DocuFlow Updater] GitHub fallback check note:', err?.message || err);
    }

    return {
      version: currentVer,
      latestVersion: currentVer,
      currentVersion: currentVer,
      hasUpdate: false,
      downloadUrl: `https://github.com/${this.DEFAULT_REPO}/releases`,
      setupName: `DocuFlow_Studio_${currentVer}_Setup.exe`,
      releaseNotes: ['You are running the latest version of DocuFlow Studio Pro.'],
      source: 'github-api'
    };
  }

  private static checkAnythingEcosystem(anythingDir: string, currentVer: string): DocuFlowUpdateInfo | null {
    try {
      const catalogPath = path.join(anythingDir, 'published-apps', 'catalog.json');
      if (fs.existsSync(catalogPath)) {
        const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
        const entry = catalog.find((a: any) => a.id === 'docuflow-studio' || (a.name && a.name.toLowerCase().includes('docuflow')));
        if (entry && entry.version) {
          const remoteVer = entry.version.replace(/^[vV]/, '').trim();
          const newer = this.compareVersions(remoteVer, currentVer) > 0;
          return {
            version: remoteVer,
            latestVersion: remoteVer,
            currentVersion: currentVer,
            hasUpdate: newer,
            downloadUrl: entry.downloadUrl || (entry.releaseInfo && entry.releaseInfo.downloadUrl) || `https://github.com/${this.DEFAULT_REPO}/releases`,
            setupName: entry.setupExecutableName || `DocuFlow_Studio_${remoteVer}_Setup.exe`,
            sizeFormatted: entry.packageSize,
            releaseNotes: entry.changelog || ['Universal Document Fusion Update via Anything Hub'],
            source: 'anything-catalog'
          };
        }
      }
    } catch (e) {
      console.warn('[DocuFlow Updater] Error scanning Anything catalog:', e);
    }
    return null;
  }

  public static async downloadUpdate(
    downloadUrl: string,
    fileName: string,
    mainWindow?: BrowserWindow | null
  ): Promise<string> {
    if (this.isDownloading) throw new Error('Download already in progress');
    this.isDownloading = true;

    const tempDir = path.join(app.getPath('temp'), 'DocuFlowUpdate');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    const destPath = path.join(tempDir, fileName);

    return new Promise((resolve, reject) => {
      const sendProgress = (percent: number, speed: string) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('update:progress', { percent, speed });
        }
      };

      const startStream = (urlStr: string) => {
        const client = urlStr.startsWith('https') ? https : http;
        client.get(urlStr, { headers: { 'User-Agent': 'DocuFlow-AutoUpdater' } }, (res) => {
          if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            startStream(res.headers.location);
            return;
          }

          if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
            this.isDownloading = false;
            reject(new Error(`Server returned HTTP ${res.statusCode}`));
            return;
          }

          const totalBytes = parseInt(res.headers['content-length'] || '0', 10);
          let receivedBytes = 0;
          let lastTime = Date.now();
          let lastBytes = 0;

          const fileStream = fs.createWriteStream(destPath);
          res.on('data', (chunk) => {
            receivedBytes += chunk.length;
            fileStream.write(chunk);

            const now = Date.now();
            if (now - lastTime >= 250) {
              const deltaBytes = receivedBytes - lastBytes;
              const deltaTime = (now - lastTime) / 1000;
              const speedBps = deltaBytes / deltaTime;
              const speedMb = (speedBps / (1024 * 1024)).toFixed(1);
              const percent = totalBytes > 0 ? Math.round((receivedBytes / totalBytes) * 100) : 50;
              sendProgress(percent, `${speedMb} MB/s`);
              lastTime = now;
              lastBytes = receivedBytes;
            }
          });

          res.on('end', () => {
            fileStream.end();
            this.isDownloading = false;
            this.downloadedInstallerPath = destPath;
            sendProgress(100, '0 MB/s');
            if (mainWindow && !mainWindow.isDestroyed()) {
              mainWindow.webContents.send('update:downloaded', { filePath: destPath });
            }
            resolve(destPath);
          });

          res.on('error', (err) => {
            fileStream.end();
            this.isDownloading = false;
            reject(err);
          });
        }).on('error', (err) => {
          this.isDownloading = false;
          reject(err);
        });
      };

      startStream(downloadUrl);
    });
  }

  public static installUpdate(installerPath?: string) {
    const targetPath = installerPath || this.downloadedInstallerPath;
    if (!targetPath || !fs.existsSync(targetPath)) {
      throw new Error('No downloaded installer found to execute');
    }

    const child = spawn(targetPath, [], {
      detached: true,
      stdio: 'ignore'
    });
    child.unref();
    app.quit();
  }

  private static fetchJson(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      https.get(
        url,
        {
          headers: {
            'User-Agent': 'DocuFlow-AutoUpdater',
            Accept: 'application/vnd.github.v3+json'
          }
        },
        (res) => {
          let body = '';
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () => {
            try {
              resolve(JSON.parse(body));
            } catch (e) {
              resolve(null);
            }
          });
        }
      ).on('error', reject);
    });
  }
}
