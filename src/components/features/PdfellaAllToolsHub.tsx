import React, { useState } from 'react';
import {
  PenTool,
  Type,
  Layers,
  Scissors,
  Minimize2,
  Stamp,
  FileDigit,
  Lock,
  Unlock,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  ScanText,
  Image as ImageIcon,
  Compass,
  Sparkles,
  Search,
  Wrench,
  ShieldCheck,
  RotateCw,
  FileCheck
} from 'lucide-react';
import { NavigationTab } from '../../types';

interface PdfellaAllToolsHubProps {
  onSelectTool: (tab: NavigationTab) => void;
}

interface ToolCard {
  id: string;
  name: string;
  description: string;
  category: 'edit' | 'organise' | 'convert' | 'optimise' | 'security';
  icon: any;
  targetTab: NavigationTab;
  iconBg: string;
  iconColor: string;
}

export const PdfellaAllToolsHub: React.FC<PdfellaAllToolsHubProps> = ({
  onSelectTool
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'edit' | 'organise' | 'convert' | 'optimise' | 'security'>('all');

  const allTools: ToolCard[] = [
    // EDIT & SIGN
    {
      id: 'edit-pdf',
      name: 'Edit PDF',
      description: 'Add text blocks, shapes, whiteouts, and image stamps directly onto PDF pages.',
      category: 'edit',
      icon: Type,
      targetTab: 'pdf-editor',
      iconBg: 'bg-sky-50',
      iconColor: 'text-sky-600'
    },
    {
      id: 'sign-pdf',
      name: 'Sign PDF',
      description: 'Draw digital signatures, type cursive scripts, or upload transparent e-signature stamps.',
      category: 'edit',
      icon: PenTool,
      targetTab: 'pdf-editor',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      id: 'whiteout-pdf',
      name: 'Whiteout & Redact',
      description: 'Permanently mask or redact sensitive figures, confidential text, and account details.',
      category: 'edit',
      icon: Sparkles,
      targetTab: 'pdf-editor',
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-600'
    },
    {
      id: 'flatten-pdf',
      name: 'Flatten PDF',
      description: 'Burn interactive form fields, checkboxes, and signatures into static uneditable graphics.',
      category: 'edit',
      icon: Layers,
      targetTab: 'pdf-security',
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600'
    },

    // ORGANISE
    {
      id: 'merge-pdf',
      name: 'Merge PDF',
      description: 'Combine multiple PDF documents into a single unified file in custom sequence.',
      category: 'organise',
      icon: Layers,
      targetTab: 'pdf-merge',
      iconBg: 'bg-sky-50',
      iconColor: 'text-sky-600'
    },
    {
      id: 'split-pdf',
      name: 'Split PDF',
      description: 'Extract specific page ranges, split each page to individual files, or divide into chunks.',
      category: 'organise',
      icon: Scissors,
      targetTab: 'pdf-split',
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-600'
    },
    {
      id: 'organize-pages',
      name: 'Organize Pages',
      description: 'Visual light table to reorder, delete, and rotate individual pages.',
      category: 'organise',
      icon: RotateCw,
      targetTab: 'pdf-organizer',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      id: 'page-numbers',
      name: 'Page Numbers',
      description: 'Stamp dynamic header and footer page numbering with customizable positions and formats.',
      category: 'organise',
      icon: FileDigit,
      targetTab: 'pdf-security',
      iconBg: 'bg-teal-50',
      iconColor: 'text-teal-600'
    },

    // CONVERT
    {
      id: 'pdf-to-jpg',
      name: 'PDF to JPG & PNG',
      description: 'Render PDF pages at 300 DPI high resolution with automatic single or folder exports.',
      category: 'convert',
      icon: ImageIcon,
      targetTab: 'reverse-suite',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      id: 'images-to-pdf',
      name: 'Photos to PDF Album',
      description: 'Sequence JPG and PNG images in exact selection order with multi-up layout and scan filters.',
      category: 'convert',
      icon: ImageIcon,
      targetTab: 'image-gallery',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      id: 'pdf-to-docx',
      name: 'PDF to Word (.docx)',
      description: 'Extract text and layout flow into clean, editable Microsoft Word documents.',
      category: 'convert',
      icon: FileText,
      targetTab: 'reverse-suite',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      id: 'pdf-to-excel',
      name: 'PDF to Excel (.xlsx)',
      description: 'Detect tabular grids and convert tabular data into native Excel spreadsheets.',
      category: 'convert',
      icon: FileSpreadsheet,
      targetTab: 'reverse-suite',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      id: 'office-to-pdf',
      name: 'Office to PDF',
      description: 'Convert Microsoft Word (.docx) and Excel (.xlsx) files into PDF documents.',
      category: 'convert',
      icon: FileSpreadsheet,
      targetTab: 'office-suite',
      iconBg: 'bg-teal-50',
      iconColor: 'text-teal-600'
    },
    {
      id: 'cad-to-pdf',
      name: 'CAD to Blueprint PDF',
      description: 'Convert AutoCAD DWG & DXF architectural drawings into vector PDF blueprints.',
      category: 'convert',
      icon: Compass,
      targetTab: 'cad-studio',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600'
    },

    // OPTIMISE
    {
      id: 'compress-pdf',
      name: 'Compress PDF',
      description: 'Reduce file size while preserving high visual clarity and readable typography.',
      category: 'optimise',
      icon: Minimize2,
      targetTab: 'pdf-security',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      id: 'ocr-pdf',
      name: 'OCR Scanned PDF',
      description: 'Optical character recognition to extract searchable text from scanned physical pages.',
      category: 'optimise',
      icon: ScanText,
      targetTab: 'reverse-suite',
      iconBg: 'bg-cyan-50',
      iconColor: 'text-cyan-600'
    },
    {
      id: 'repair-pdf',
      name: 'Repair PDF',
      description: 'Rebuild damaged cross-reference tables and recover corrupted document streams.',
      category: 'optimise',
      icon: Wrench,
      targetTab: 'pdf-security',
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-600'
    },

    // SECURITY
    {
      id: 'watermark-pdf',
      name: 'Watermark PDF',
      description: 'Apply diagonal text or company logo watermarks with custom rotation and opacity.',
      category: 'security',
      icon: Stamp,
      targetTab: 'pdf-security',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600'
    },
    {
      id: 'protect-pdf',
      name: 'Protect PDF',
      description: 'Encrypt documents with user password protection and security markers.',
      category: 'security',
      icon: Lock,
      targetTab: 'pdf-security',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      id: 'unlock-pdf',
      name: 'Unlock PDF',
      description: 'Remove password restrictions, printing limits, and permission constraints.',
      category: 'security',
      icon: Unlock,
      targetTab: 'pdf-security',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-700'
    },
    {
      id: 'edit-metadata',
      name: 'Edit PDF Metadata',
      description: 'Inspect and update document title, author, subject, keywords, and creator info.',
      category: 'security',
      icon: FileCheck,
      targetTab: 'pdf-security',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    }
  ];

  const filteredTools = allTools.filter((t) => {
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC] text-slate-800 select-none overflow-y-auto custom-scrollbar font-sans p-6 md:p-10">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        
        {/* BRAND BADGE & HERO */}
        <div className="text-center space-y-3 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200/90 shadow-2xs text-xs font-semibold text-slate-700">
            <span className="size-2 rounded-full bg-sky-500"></span>
            <span className="font-bold text-slate-900">DocuFlow Studio Pro</span>
            <span className="text-slate-300">•</span>
            <span className="font-mono text-slate-500 text-[11px]">v26.10.30</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-medium">Burhanuddin Sounasath</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Precision Document Studio
          </h1>
          <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            Select any tool below to begin, or drop your files to auto-detect the optimal workflow.
          </p>
        </div>

        {/* SEARCH & CATEGORY FILTER BAR */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools (e.g. sign, merge, docx)..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto custom-scrollbar pb-1 sm:pb-0">
            {[
              { id: 'all' as const, label: 'All Tools' },
              { id: 'edit' as const, label: 'Edit & Sign' },
              { id: 'organise' as const, label: 'Organise' },
              { id: 'convert' as const, label: 'Convert' },
              { id: 'optimise' as const, label: 'Optimise' },
              { id: 'security' as const, label: 'Security' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* CLEAN, SPACIOUS TOOL CARDS (3 COLUMNS WITH PROPER PADDING AND GAPS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={() => onSelectTool(tool.targetTab)}
                className="bg-white border border-slate-200/90 rounded-3xl p-7 shadow-xs hover:shadow-lg hover:border-slate-300 transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div className={`size-13 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105 ${tool.iconBg} ${tool.iconColor}`}>
                    <Icon className="size-6" />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition mb-2">
                    {tool.name}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
            <Search className="size-8 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No matching tools found</h4>
            <p className="text-xs text-slate-400 mt-1">Try searching for keywords like "sign", "merge", or "compress".</p>
          </div>
        )}
      </div>
    </div>
  );
};
