#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const REPO_OWNER = 'BSFrameWorks5253';
const REPO_NAME = 'DocuFlow-';

// 1. Try to load token from .env file if not in process.env
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const token = process.argv[2] || process.env.GH_TOKEN || process.env.GITHUB_TOKEN;

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
const version = pkg.version || '1.0.0';
const TAG_NAME = `v${version}`;
const RELEASE_TITLE = `PDF Master Pro v${version}`;

if (!token) {
  console.log('\n⚠️  [PDF Master Auto-Release] No GitHub Token found.');
  console.log('   Add GH_TOKEN=your_token to your .env file, or pass it via:');
  console.log('   node scripts/publish-release.cjs <TOKEN>\n');
  process.exit(0); // Exit cleanly so build doesn't break if building without token
}

let releaseMeta = {
  summary: `DocuFlow Studio Pro ${TAG_NAME} release build.`,
  newFeatures: [],
  improvements: [],
  fixes: []
};

const releaseMetaPath = path.join(__dirname, '..', 'release.json');
if (fs.existsSync(releaseMetaPath)) {
  try {
    releaseMeta = JSON.parse(fs.readFileSync(releaseMetaPath, 'utf8'));
  } catch (err) {
    // fallback
  }
}

const body = `## 🚀 ${RELEASE_TITLE}

${releaseMeta.summary || 'Universal Document Fusion & PDF Engineering Workstation.'}

### ✨ Key Features:
${(releaseMeta.newFeatures || []).map(f => `- ${f}`).join('\n') || '- Complete Vector PDF Studio & Fusion Engine'}

### ⚡ Improvements:
${(releaseMeta.improvements || []).map(i => `- ${i}`).join('\n') || '- Performance optimizations & ecosystem readiness'}

### 🛠️ Fixes:
${(releaseMeta.fixes || []).map(x => `- ${x}`).join('\n') || '- Bug fixes and stability improvements'}

---
**Developer:** Burhanuddin Sounasath  
**Compatible with:** Windows 10 & 11 (64-bit)  
**Ecosystem:** Anything Workstation
`;

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let resBody = '';
      res.on('data', chunk => (resBody += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(resBody), raw: resBody });
        } catch {
          resolve({ status: res.statusCode, data: resBody, raw: resBody });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      if (Buffer.isBuffer(data) || typeof data === 'string') req.write(data);
      else req.write(JSON.stringify(data));
    }
    req.end();
  });
}

function uploadAsset(uploadUrlTemplate, filePath, fileName) {
  return new Promise((resolve, reject) => {
    const cleanUrl = uploadUrlTemplate.replace(/\{.*\}/, '');
    const urlObj = new URL(`${cleanUrl}?name=${encodeURIComponent(fileName)}`);
    const stats = fs.statSync(filePath);
    const stream = fs.createReadStream(filePath);

    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'User-Agent': 'DocuFlow-Publisher',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/octet-stream',
        'Content-Length': stats.size,
      },
    };

    const req = https.request(options, (res) => {
      let resBody = '';
      res.on('data', chunk => (resBody += chunk));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(resBody));
          } catch {
            resolve({ raw: resBody });
          }
        } else {
          reject(new Error(`Upload failed (${res.statusCode}): ${resBody}`));
        }
      });
    });
    req.on('error', reject);
    stream.pipe(req);
  });
}

async function main() {
  console.log(`\n===================================================`);
  console.log(`🚀 Automated GitHub Release: ${REPO_OWNER}/${REPO_NAME} [${TAG_NAME}]`);
  console.log(`===================================================`);

  // Ensure git tag exists & is pushed
  try {
    const existingTags = execSync('git tag -l', { encoding: 'utf8' });
    if (!existingTags.includes(TAG_NAME)) {
      console.log(`📌 Tag ${TAG_NAME} not found locally. Creating...`);
      execSync(`git tag -a ${TAG_NAME} -m "Release ${TAG_NAME}"`);
    }
    console.log(`📤 Pushing ${TAG_NAME} to GitHub...`);
    execSync(`git push https://${token}@github.com/${REPO_OWNER}/${REPO_NAME}.git ${TAG_NAME} --force`, { stdio: 'pipe' });
    console.log(`✓ Git tag pushed.`);
  } catch (err) {
    console.warn(`⚠️ Git tag push warning:`, err.message);
  }

  // 1. Check or create release on GitHub
  let release;
  const existingRes = await request({
    hostname: 'api.github.com',
    path: `/repos/${REPO_OWNER}/${REPO_NAME}/releases/tags/${TAG_NAME}`,
    method: 'GET',
    headers: {
      'User-Agent': 'DocuFlow-Publisher',
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  if (existingRes.status === 200 && existingRes.data?.id) {
    console.log(`ℹ️ Existing release found (ID: ${existingRes.data.id}). Updating assets...`);
    release = existingRes.data;
  } else {
    console.log(`✨ Creating release ${TAG_NAME}...`);
    const createRes = await request(
      {
        hostname: 'api.github.com',
        path: `/repos/${REPO_OWNER}/${REPO_NAME}/releases`,
        method: 'POST',
        headers: {
          'User-Agent': 'DocuFlow-Publisher',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        }
      },
      {
        tag_name: TAG_NAME,
        name: RELEASE_TITLE,
        body: body,
        draft: false,
        prerelease: false
      }
    );

    if (createRes.status !== 201 && createRes.status !== 200) {
      console.error(`❌ Failed to create release:`, createRes.raw);
      process.exit(1);
    }
    release = createRes.data;
  }

  // 2. Fetch fresh release object to get latest asset list
  const freshRes = await request({
    hostname: 'api.github.com',
    path: `/repos/${REPO_OWNER}/${REPO_NAME}/releases/${release.id}`,
    method: 'GET',
    headers: {
      'User-Agent': 'DocuFlow-Publisher',
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  if (freshRes.status === 200 && freshRes.data?.assets) {
    release.assets = freshRes.data.assets;
  }

  // 3. Find files to upload
  const releaseDir = path.join(__dirname, '..', 'release');
  let filesToUpload = [];
  if (fs.existsSync(releaseDir)) {
    filesToUpload = fs.readdirSync(releaseDir).filter(f => f.endsWith('.exe') && !f.includes('unpacked'));
  }
  if (filesToUpload.length === 0) {
    filesToUpload = [
      `PDF_Master_Pro_${version}_Setup.exe`,
      `PDF_Master_Pro_${version}.exe`
    ];
  }

  let uploadedCount = 0;
  for (const f of filesToUpload) {
    const fullPath = path.join(releaseDir, f);
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️ File not found in release directory: ${f}`);
      continue;
    }

    // Check if asset already exists on this release
    if (release.assets && release.assets.length > 0) {
      const existingAsset = release.assets.find(a => a.name === f);
      if (existingAsset) {
        console.log(`🗑️ Deleting older copy of ${f} (Asset ID: ${existingAsset.id})...`);
        await request({
          hostname: 'api.github.com',
          path: `/repos/${REPO_OWNER}/${REPO_NAME}/releases/assets/${existingAsset.id}`,
          method: 'DELETE',
          headers: {
            'User-Agent': 'DocuFlow-Publisher',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });
      }
    }

    const sizeMb = (fs.statSync(fullPath).size / (1024 * 1024)).toFixed(1);
    console.log(`⬆️ Uploading ${f} (${sizeMb} MB) to GitHub Release...`);
    const upRes = await uploadAsset(release.upload_url, fullPath, f);
    console.log(`✓ Uploaded: ${upRes.browser_download_url || f}`);
    uploadedCount++;
  }

  console.log(`\n🎉 ${uploadedCount} executable(s) published to GitHub Release!`);
  console.log(`🔗 Release URL: https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/tag/${TAG_NAME}`);

  // 4. Update Anything ecosystem
  try {
    const deployScript = path.join(__dirname, 'deploy-to-anything.cjs');
    if (fs.existsSync(deployScript)) {
      console.log(`\n🔄 Updating Anything Ecosystem catalog...`);
      execSync(`node "${deployScript}"`, { stdio: 'inherit' });
    }
  } catch (err) {
    console.warn(`⚠️ Failed to sync with Anything:`, err.message);
  }
}

main().catch(err => {
  console.error(`❌ Error in release publisher:`, err.message);
  process.exit(1);
});
