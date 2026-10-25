#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const https = require('https');

const REPO_OWNER = 'BSFrameworks5253';
const REPO_NAME = 'DocuFlow-';
const TAG_NAME = 'v1.0.0';
const RELEASE_TITLE = 'DocuFlow Studio Pro v1.0.0';

const token = process.argv[2] || process.env.GH_TOKEN || process.env.GITHUB_TOKEN;

if (!token) {
  console.log('Usage: node scripts/publish-release.cjs <YOUR_GITHUB_TOKEN>');
  console.log('Or set $env:GH_TOKEN="ghp_xxx"');
  process.exit(1);
}

const releaseMeta = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'release.json'), 'utf8'));

const body = `## 🚀 ${RELEASE_TITLE}

${releaseMeta.summary}

### ✨ What's New in v1.0.0:
${releaseMeta.newFeatures.map(f => `- ${f}`).join('\n')}

### ⚡ Performance & Polish:
${releaseMeta.improvements.map(i => `- ${i}`).join('\n')}

### 🛠️ Fixes:
${releaseMeta.fixes.map(x => `- ${x}`).join('\n')}

---
**Developer:** Burhanuddin Sounasath  
**Compatible with:** Windows 10 & 11 (64-bit)  
**Ecosystem:** Anything Workstation
`;

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body), raw: body });
        } catch {
          resolve({ status: res.statusCode, data: body, raw: body });
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
      let body = '';
      res.on('data', chunk => (body += chunk));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`Upload failed (${res.statusCode}): ${body}`));
        }
      });
    });
    req.on('error', reject);
    stream.pipe(req);
  });
}

async function main() {
  console.log(`\n===================================================`);
  console.log(`🚀 Creating GitHub Release: ${REPO_OWNER}/${REPO_NAME} [${TAG_NAME}]`);
  console.log(`===================================================\n`);

  // 1. Create or get existing release
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
    console.log(`ℹ️ Existing release found (ID: ${existingRes.data.id}). Updating...`);
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

  // 2. Upload assets
  const releaseDir = path.join(__dirname, '..', 'release');
  const filesToUpload = [
    'DocuFlow_Studio_1.0.0_Setup.exe',
    'DocuFlow_Studio_1.0.0.exe'
  ];

  for (const f of filesToUpload) {
    const fullPath = path.join(releaseDir, f);
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️ File not found: ${f}`);
      continue;
    }

    console.log(`⬆️ Uploading ${f} (${(fs.statSync(fullPath).size / (1024 * 1024)).toFixed(1)} MB)...`);
    const upRes = await uploadAsset(release.upload_url, fullPath, f);
    console.log(`✓ Uploaded: ${upRes.browser_download_url}`);
  }

  console.log(`\n🎉 Release published successfully!`);
  console.log(`🔗 Release URL: ${release.html_url}`);
}

main().catch(err => {
  console.error(`❌ Error:`, err.message);
  process.exit(1);
});
