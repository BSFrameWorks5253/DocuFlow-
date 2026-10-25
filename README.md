# DocuFlow Studio Pro

> **Universal Document Fusion & PDF Engineering Workstation**  
> **Version:** v1.0.0  
> **Author:** Burhanuddin Sounasath  

---

## 🌟 Overview

**DocuFlow Studio Pro** is an ultra-fast, local-first client-side document processing workstation and PDF editor built for privacy, performance, and precision. It combines professional-grade PDF manipulation, in-place vector editing, multi-format document merging, and AutoCAD drawing conversion into an elegant, distraction-free desktop environment.

---

## 🚀 Key Features

### 📑 1. PDFella-Grade PDF Editor Studio
- **In-Place Text Editing:** Click on existing PDF text blocks to edit them directly in-place with coordinate-accurate layout matching.
- **Freehand Pen & Sketching:** Live vector drawing canvas with customizable stroke widths and colors.
- **Digital Signatures:** Draw ink signatures, type with cursive script typography, or upload transparent PNG seals.
- **Redaction & Whiteout:** Permanent content redaction with interactive drag and resize handles.
- **Stamps & Shapes:** Checkmarks (`✔`), Crosses (`✖`), Stars (`⭐`), Date stamps, Rectangles, Circles, Lines, and Arrows.
- **Sidebar Page Manager:** Visual thumbnail rail with 90° page rotation, duplication, page deletion, and blank page insertion.

### 📐 2. AutoCAD Vector Blueprint Engine
- **DWG & DXF Support:** Native offline conversion of AutoCAD DWG (R14 through 2026) and ASCII DXF drawings via LibreDWG WebAssembly.
- **Architectural Themes:** Render technical drawings in *Architectural Blueprint*, *Technical Monochrome*, or *Layer Colors*.
- **Scales & Formats:** Export to standard A4, A3, A2, and A1 paper sizes at 300 DPI vector clarity.

### 🔄 3. Universal Multi-Document Fusion & Converter
- **Multi-Format Staggered Merging:** Merge Word (`.docx`), Excel (`.xlsx`, `.xls`), AutoCAD (`.dwg`, `.dxf`), Images (`.jpg`, `.png`, `.webp`, `.bmp`), Text (`.txt`), and PDFs in exact user-defined sequence.
- **Zero Cloud Uploads:** 100% local, client-side processing ensuring privacy and zero data leakage.

### ⚡ 4. High-Performance Native Architecture
- **GPU Canvas Acceleration:** Accelerated 2D canvas rasterization via Chromium & Electron.
- **Sub-Second Boot Time:** Instant startup with optimized asset pre-bundling.

---

## 🛠️ Tech Stack

- **Desktop Framework:** Electron 34
- **Frontend UI:** React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Build System:** Vite 6
- **PDF Engine:** `pdf-lib`, `pdfjs-dist`, `jspdf`
- **CAD Engine:** `dwg2dxf-converter` (LibreDWG WebAssembly), `dxf-parser`
- **Office & Imaging:** `mammoth`, `xlsx`, `jszip`, `tesseract.js`

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
```bash
git clone https://github.com/BSFrameworks5253/DocuFlow-.git
cd DocuFlow-
npm install
```

### Development
Launch both Vite dev server and Electron workstation:
```bash
npm run dev
```

### Build Executables
Build production binaries (Portable `.exe` and NSIS Installer):
```bash
npm run dist
```

---

## 👤 Developer
**Burhanuddin Sounasath**  
DocuFlow Studio Pro — v1.0.0
