const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ANYTHING_ROOT = 'C:\\Users\\Burhanuddin\\OneDrive\\Desktop\\Anything\\Anything';
const APP_ID = 'docuflow-studio';
const APP_NAME = 'DocuFlow Studio Pro';
const APP_VERSION = 'v1.0.0';

console.log(`🚀 Deploying ${APP_NAME} as a child of Anything at:`, ANYTHING_ROOT);

if (!fs.existsSync(ANYTHING_ROOT)) {
  console.error('❌ Could not locate Anything directory at:', ANYTHING_ROOT);
  process.exit(1);
}

const RELEASES_BASE = path.join(ANYTHING_ROOT, 'releases', APP_ID);
const RELEASES_TARGET = path.join(RELEASES_BASE, APP_VERSION);
const PUBLISHED_TARGET = path.join(ANYTHING_ROOT, 'published-apps', APP_ID);

fs.mkdirSync(RELEASES_BASE, { recursive: true });
fs.mkdirSync(RELEASES_TARGET, { recursive: true });
fs.mkdirSync(PUBLISHED_TARGET, { recursive: true });

const filesToCopy = [
  'app.json',
  'release.json',
  'loader-config.json',
  'logo.png',
  'app-logo.png',
  'logo.svg',
  'app.ico',
  'icon.ico'
];

for (const file of filesToCopy) {
  const src = path.join(__dirname, '..', file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(RELEASES_BASE, file));
    fs.copyFileSync(src, path.join(RELEASES_TARGET, file));
    fs.copyFileSync(src, path.join(PUBLISHED_TARGET, file));
    console.log(`✓ Copied ${file}`);
  }
}

// Copy executables from release/ folder to base, target, and published
const distReleaseDir = path.join(__dirname, '..', 'release');
if (fs.existsSync(distReleaseDir)) {
  const exes = fs.readdirSync(distReleaseDir).filter(f => f.endsWith('.exe'));
  for (const exe of exes) {
    fs.copyFileSync(path.join(distReleaseDir, exe), path.join(RELEASES_BASE, exe));
    fs.copyFileSync(path.join(distReleaseDir, exe), path.join(RELEASES_TARGET, exe));
    fs.copyFileSync(path.join(distReleaseDir, exe), path.join(PUBLISHED_TARGET, exe));
    console.log(`✓ Copied binary: ${exe}`);
  }
}

// Register or update in app-sources.json
const sourcesPath = path.join(ANYTHING_ROOT, 'app-sources.json');
if (fs.existsSync(sourcesPath)) {
  try {
    let sources = JSON.parse(fs.readFileSync(sourcesPath, 'utf-8'));
    // Filter out old master-converter and replace with docuflow-studio
    sources = sources.filter(s => s.id !== 'master-converter' && s.name !== 'Master Document Converter Pro');
    const existingIdx = sources.findIndex(s => s.id === APP_ID || s.name === APP_NAME);
    const sourceEntry = {
      id: APP_ID,
      name: APP_NAME,
      url: 'https://github.com/BSFrameworks5253/DocuFlow-',
      category: 'Productivity & Documents',
      autoSync: true
    };
    if (existingIdx >= 0) {
      sources[existingIdx] = sourceEntry;
    } else {
      sources.push(sourceEntry);
    }
    fs.writeFileSync(sourcesPath, JSON.stringify(sources, null, 2), 'utf-8');
    console.log('✓ Registered in app-sources.json');
  } catch (e) {
    console.warn('⚠️ Could not update app-sources.json:', e.message);
  }
}

// Trigger Anything collect-releases.cjs script
try {
  console.log('🔄 Triggering Anything release collection...');
  execSync(`node "${path.join(ANYTHING_ROOT, 'scripts', 'collect-releases.cjs')}"`, { stdio: 'inherit' });
  console.log(`🎉 Successfully integrated ${APP_NAME} into Anything ecosystem!`);
} catch (e) {
  console.warn('⚠️ Note on collect-releases:', e.message);
}
