const { app, nativeImage } = require('electron');
const fs = require('fs');
const path = require('path');

app.disableHardwareAcceleration();

app.whenReady().then(() => {
  const imgPath = path.join(__dirname, '..', 'public', 'logo.png');
  const image = nativeImage.createFromPath(imgPath);
  const sizes = [16, 24, 32, 48, 64, 128, 256];
  const pngBuffers = sizes.map(sz => ({
    size: sz,
    buffer: image.resize({ width: sz, height: sz, quality: 'best' }).toPNG()
  }));

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

  const baseDir = path.join(__dirname, '..');
  fs.writeFileSync(path.join(baseDir, 'public', 'icon.ico'), icoBuffer);
  fs.writeFileSync(path.join(baseDir, 'public', 'app.ico'), icoBuffer);
  fs.writeFileSync(path.join(baseDir, 'app.ico'), icoBuffer);
  console.log('✅ Successfully generated multi-res .ico for ' + baseDir);
  app.quit();
});
