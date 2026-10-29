# ⚡ VectorForge Studio

> **Precision Vector PDF Editor, AutoCAD Blueprint Converter & Universal Document Fusion Workstation**  
> **Version:** `v1.0.0` • **Developer:** Burhanuddin Sounasath • **Platform:** Windows 10 & 11 (64-bit)  
> **Repository:** [https://github.com/BSFrameWorks5253/VectorForge](https://github.com/BSFrameWorks5253/VectorForge)

---

## 🌟 Overview

**VectorForge Studio** is an ultra-fast, 100% private, client-side document workstation and vector PDF engineering suite. Built for architects, engineers, designers, and document professionals, it combines PDFella-grade in-place vector editing, AutoCAD DWG/DXF blueprint parsing, multi-document fusion, offline OCR vision, and 1-to-1 batch office conversion into an elegant, distraction-free desktop application.

**Zero Cloud Uploads:** All PDF manipulation, CAD vector parsing, OCR, and document conversions execute strictly in your local device memory using WebAssembly and client-side runtimes.

---

## ✨ Flagship Capabilities

### 📑 1. Vector PDF Editor & Digital Signatures
- **In-Place Text Editing:** Click any text block to edit text directly with coordinate-accurate font and flow matching.
- **Live Freehand Pen:** Draw sketches, annotations, and vector line paths with customizable stroke weights and colors.
- **Digital Signatures:** Draw ink signatures, type cursive scripts, or place transparent e-signature stamps.
- **Redaction & Whiteout:** Permanently mask sensitive financial figures, private text, and account details.
- **Stamps & Annotations:** Checkmarks (`✔`), Crosses (`✖`), Stars (`⭐`), Date stamps, Rectangles, Circles, and Arrows.
- **Visual Page Rail:** Interactive left sidebar with 90° page rotation, duplication, deletion, and blank sheet insertion.

### 📐 2. AutoCAD DWG & DXF Vector Blueprint Engine
- **DWG & DXF Conversion:** Offline vector conversion of AutoCAD DWG (R14 through 2026) and ASCII DXF drawings via LibreDWG WebAssembly.
- **Architectural Themes:** Render technical drawings in *Architectural Blueprint (Classic Blue)*, *Technical Monochrome (Black & White)*, or *Layer Colors*.
- **Scales & Formats:** Export technical drawings to standard A4, A3, A2, and A1 sheet dimensions at 300 DPI vector clarity.

### 🔗 3. Universal Multi-Document Fusion & Batch Converter
- **Multi-Format Staggered Merging:** Combine Word (`.docx`), Excel (`.xlsx`), AutoCAD (`.dwg`, `.dxf`), Images (`.jpg`, `.png`, `.webp`), Text, and PDFs into one master publication in custom sequence.
- **Visual Splitter & Organizer:** Extract custom page ranges (e.g. `1-3, 5`), split each page to a ZIP archive, or reorder pages on an interactive light-table grid.
- **1-to-1 Batch Office Converter:** Bulk convert Microsoft Word and Excel spreadsheets directly into individual PDFs with folder saving or ZIP exports.

### 🛡️ 4. Security, Offline OCR & Optimization
- **Offline OCR Vision:** Local optical character recognition via Tesseract to extract selectable text from physical scans without internet.
- **Watermark & Page Numbering:** Diagonal copyright stamps, logo stamps, and dynamic header/footer page numbering.
- **Smart Compression & Passwords:** Reduce file size while preserving high typographic sharpness; protect with user passwords and AES encryption.

---

## 🚀 Quick Start

### Installation & Run from Source

```bash
# Clone the repository
git clone https://github.com/BSFrameWorks5253/VectorForge.git
cd VectorForge

# Install dependencies
npm install

# Start in development mode
npm run dev

# Build production binaries
npm run build
npm run dist
```

---

## 🛠️ Architecture & Tech Stack

- **Desktop Framework:** Electron 34 with GPU-accelerated 2D Canvas Rasterization
- **Frontend UI:** React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Bundler & Tooling:** Vite 6
- **PDF Engine:** `pdf-lib`, Mozilla `pdfjs-dist`
- **CAD Parsing:** `dwg2dxf-converter` (LibreDWG WebAssembly), `dxf-parser`
- **Office & Imaging:** `mammoth`, `xlsx`, `tesseract.js`, `jszip`

---

## 📦 Downloads & Releases

Pre-compiled standalone installers and portable executables are available on the [Releases Page](https://github.com/BSFrameWorks5253/VectorForge/releases).

* **Setup Installer:** `VectorForge_Studio_1.0.0_Setup.exe`
* **Portable Executable:** `VectorForge_Studio_1.0.0.exe`

---

## 📄 License & Credits

Developed by **Burhanuddin Sounasath**.  
Designed for the **Anything** workstation ecosystem.
