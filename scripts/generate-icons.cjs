const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

app.disableHardwareAcceleration();

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 512,
    height: 512,
    show: false,
    frame: false,
    transparent: true,
    webPreferences: {
      offscreen: true,
    },
  });

  // Adobe Creative Cloud Style Monogram Logo for "DocuFlow Studio" (Df)
  const svgContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body, html {
          margin: 0;
          padding: 0;
          width: 512px;
          height: 512px;
          background: transparent;
          overflow: hidden;
        }
      </style>
    </head>
    <body>
      <svg width="512" height="512" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Deep Obsidian Tile Gradient -->
          <linearGradient id="tileBg" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stop-color="#0a0f1d" />
            <stop offset="50%" stop-color="#060912" />
            <stop offset="100%" stop-color="#020408" />
          </linearGradient>
          
          <!-- Adobe Vibrant Accent Border -->
          <linearGradient id="borderGrad" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stop-color="#38bdf8" />
            <stop offset="40%" stop-color="#0284c7" />
            <stop offset="100%" stop-color="#0369a1" />
          </linearGradient>

          <!-- Adobe Monogram Gradient -->
          <linearGradient id="textGrad" x1="0" y1="0" x2="0" y2="100">
            <stop offset="0%" stop-color="#7dd3fc" />
            <stop offset="60%" stop-color="#38bdf8" />
            <stop offset="100%" stop-color="#0284c7" />
          </linearGradient>

          <!-- Drop Shadow for Windows Desktop -->
          <filter id="adobeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3.5" stdDeviation="4" flood-color="rgba(0,0,0,0.55)" />
          </filter>
        </defs>

        <!-- Base Squircle -->
        <rect x="7" y="7" width="86" height="86" rx="20" fill="url(#tileBg)" filter="url(#adobeShadow)" />

        <!-- Adobe Signature Outer Border Rim (3.2px) -->
        <rect x="8.6" y="8.6" width="82.8" height="82.8" rx="18.4" stroke="url(#borderGrad)" stroke-width="3.2" />

        <!-- Inner Bevel Glass Highlight -->
        <rect x="11.5" y="11.5" width="77" height="77" rx="15.5" stroke="rgba(255,255,255,0.12)" stroke-width="1" />

        <!-- Diagonal Specular Sheen (Apple Liquid Glass) -->
        <path d="M9.5 30C22 26 38 31 52 25C66 19 80 23 90.5 19V9.5H16C12 9.5 9.5 12 9.5 16V30Z" fill="white" opacity="0.12" />

        <!-- Adobe 2-Letter Monogram "Df" (DocuFlow) -->
        <text 
          x="50" 
          y="66.5" 
          text-anchor="middle" 
          fill="url(#textGrad)" 
          font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Plus Jakarta Sans', 'Inter', 'Segoe UI', Arial, sans-serif" 
          font-weight="900" 
          font-size="47" 
          letter-spacing="-2"
        >Df</text>
      </svg>
    </body>
    </html>
  `;

  await win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(svgContent));
  await new Promise(r => setTimeout(r, 600));

  const image = await win.capturePage();
  const png512 = image.toPNG();

  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  // Save 512x512 logo files
  fs.writeFileSync(path.join(publicDir, 'app-logo.png'), png512);
  fs.writeFileSync(path.join(publicDir, 'logo.png'), png512);
  fs.writeFileSync(path.join(__dirname, '..', 'app-logo.png'), png512);
  fs.writeFileSync(path.join(__dirname, '..', 'logo.png'), png512);
  console.log('✓ Saved 512x512 Adobe-style app-logo.png and logo.png');

  // Build multi-res Windows .ico icon file
  const sizes = [16, 24, 32, 48, 64, 128, 256];
  const pngBuffers = sizes.map(sz => {
    return {
      size: sz,
      buffer: image.resize({ width: sz, height: sz, quality: 'best' }).toPNG()
    };
  });

  const count = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let dataOffset = headerSize + (count * dirEntrySize);

  const entries = [];
  for (const item of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.size === 256 ? 0 : item.size, 0);
    entry.writeUInt8(item.size === 256 ? 0 : item.size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(item.buffer.length, 8);
    entry.writeUInt32LE(dataOffset, 12);
    entries.push(entry);
    dataOffset += item.buffer.length;
  }

  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0);
  icoHeader.writeUInt16LE(1, 2);
  icoHeader.writeUInt16LE(count, 4);

  const icoBuffer = Buffer.concat([
    icoHeader,
    ...entries,
    ...pngBuffers.map(p => p.buffer)
  ]);

  fs.writeFileSync(path.join(publicDir, 'icon.ico'), icoBuffer);
  fs.writeFileSync(path.join(publicDir, 'app.ico'), icoBuffer);
  fs.writeFileSync(path.join(__dirname, '..', 'app.ico'), icoBuffer);
  console.log('✓ Saved multi-resolution app.ico and icon.ico');

  // Also save a vector SVG for Anything store cards
  const cleanSvg = `
<svg width="512" height="512" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="tileBg" x1="0" y1="0" x2="100" y2="100">
      <stop offset="0%" stop-color="#0a0f1d" />
      <stop offset="50%" stop-color="#060912" />
      <stop offset="100%" stop-color="#020408" />
    </linearGradient>
    <linearGradient id="borderGrad" x1="0" y1="0" x2="100" y2="100">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="40%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#0369a1" />
    </linearGradient>
    <linearGradient id="textGrad" x1="0" y1="0" x2="0" y2="100">
      <stop offset="0%" stop-color="#7dd3fc" />
      <stop offset="60%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
  </defs>
  <rect x="7" y="7" width="86" height="86" rx="20" fill="url(#tileBg)" />
  <rect x="8.6" y="8.6" width="82.8" height="82.8" rx="18.4" stroke="url(#borderGrad)" stroke-width="3.2" />
  <rect x="11.5" y="11.5" width="77" height="77" rx="15.5" stroke="rgba(255,255,255,0.12)" stroke-width="1" />
  <path d="M9.5 30C22 26 38 31 52 25C66 19 80 23 90.5 19V9.5H16C12 9.5 9.5 12 9.5 16V30Z" fill="white" opacity="0.12" />
  <text x="50" y="66.5" text-anchor="middle" fill="url(#textGrad)" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="900" font-size="47" letter-spacing="-2">Df</text>
</svg>
`.trim();

  fs.writeFileSync(path.join(publicDir, 'logo.svg'), cleanSvg);
  fs.writeFileSync(path.join(__dirname, '..', 'logo.svg'), cleanSvg);
  console.log('✓ Saved vector logo.svg');

  app.quit();
});
