import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import {
  FolderTree,
  FileCode,
  Play,
  Terminal as TerminalIcon,
  ChevronRight,
  ChevronDown,
  Download,
  CheckCircle2,
  AlertCircle,
  Hash,
  Database,
  Cpu,
  Zap,
  Activity,
  FileText,
  Maximize2,
  Minimize2,
  ChevronUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import InteractiveDocumentRenderer from '../components/workspace/InteractiveDocumentRenderer';

export default function SoftwareWorkspace({ project: activeProject }) {
  const { srsDoc, setSrsDoc, sddDoc, setSddDoc, isGenerating, setIsGenerating } = useOutletContext();
  const [activeTab, setActiveTab] = useState('srs'); // 'srs', 'sdd', 'code'
  const [isCompiling, setIsCompiling] = useState(false);
  const [exportFormat, setExportFormat] = useState('md');

  const [codeFiles, setCodeFiles] = useState({
    'driver/uart/src/uart.c': `/* MISRA C 2012 Compliant UART Driver */\n#include "uart.h"\n\nvoid uart_init(void) {\n    /* Hardware initialization */\n}\n\nvoid uart_transmit(const uint8_t* data, uint16_t len) {\n    /* Transmit implementation */\n}`,
    'driver/uart/include/uart.h': `/* UART Interface */\n#ifndef UART_H\n#define UART_H\n\n#include <stdint.h>\n\nvoid uart_init(void);\nvoid uart_transmit(const uint8_t* data, uint16_t len);\n\n#endif`,
    'driver/uart/Makefile': `CC=gcc\nCFLAGS=-Wall -Wextra\n\nall: uart.o\n\nuart.o: src/uart.c\n\t$(CC) $(CFLAGS) -Iinclude -c src/uart.c -o build/uart.o`,
    'driver/README.md': `# Hardware Drivers\n\nContains all low-level hardware abstraction layers compliant with MISRA C.`,

    'library/math_lib/src/math_lib.c': `/* MISRA C Compliant Math Library */\n#include "math_lib.h"\n\nuint16_t calculate_checksum(const uint8_t* data, uint16_t len) {\n    uint16_t sum = 0U;\n    for(uint16_t i=0U; i<len; i++) {\n        sum += data[i];\n    }\n    return sum;\n}`,
    'library/math_lib/include/math_lib.h': `/* Math Library Headers */\n#ifndef MATH_LIB_H\n#define MATH_LIB_H\n\n#include <stdint.h>\n\nuint16_t calculate_checksum(const uint8_t* data, uint16_t len);\n\n#endif`,
    'library/math_lib/Makefile': `CC=gcc\nCFLAGS=-Wall -Wextra\n\nall: math_lib.o\n\nmath_lib.o: src/math_lib.c\n\t$(CC) $(CFLAGS) -Iinclude -c src/math_lib.c -o build/math_lib.o`,
    'library/README.md': `# Software Libraries\n\nReusable algorithmic components and processing libraries.`,

    'atp/src/main.c': `/* Application Test Program (ATP) */\n#include "app_headers.h"\n#include "uart.h"\n#include "math_lib.h"\n\nint main(void) {\n    uint8_t payload[4] = {0x01U, 0x02U, 0x03U, 0x04U};\n    \n    uart_init();\n    uint16_t crc = calculate_checksum(payload, 4U);\n    \n    if (crc == 0x000AU) {\n        uart_transmit(payload, 4U);\n    }\n    return 0;\n}`,
    'atp/include/app_headers.h': `/* ATP Headers */\n#ifndef APP_HEADERS_H\n#define APP_HEADERS_H\n\n#include <stdint.h>\n#include <stdbool.h>\n\n/* Application specific definitions */\n#define MAX_PAYLOAD_SIZE 1024U\n\n#endif`,
    'atp/Makefile': `CC=gcc\nCFLAGS=-Wall -Wextra -Iinclude -I../driver/uart/include -I../library/math_lib/include\n\nall: main\n\nmain: src/main.c\n\t$(CC) $(CFLAGS) src/main.c -o bin/atp_exec`,

  });

  const [activeFile, setActiveFile] = useState('atp/src/main.c');
  const [terminalOutput, setTerminalOutput] = useState([
    '$ archtech-sys --v3-engine',
    'Ready for build configurations.'
  ]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);
  const [generationProgress, setGenerationProgress] = useState({ current: 0, total: 1 });

  const buildFileTree = () => {
    const root = { name: 'ArchTech_Project', type: 'dir', children: [] };
    Object.keys(codeFiles).forEach(path => {
      const parts = path.split('/');
      let current = root;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isFile = i === parts.length - 1;
        let existing = current.children.find(c => c.name === part);
        if (!existing) {
          existing = { name: part, type: isFile ? 'file' : 'dir', children: [], path: isFile ? path : '' };
          current.children.push(existing);
        }
        current = existing;
      }
    });
    return root;
  };

  const fileTree = buildFileTree();

  const handleGenerateDoc = async (type) => {
    setIsGenerating(prev => ({ ...prev, srs: type === 'SRS', sdd: type !== 'SRS' }));
    if (type === 'SRS') setSrsDoc('');
    else setSddDoc('');

    try {
      setTerminalOutput(prev => [...prev, `$ Generating ${type} Section...`]);
      const res = await fetch('/api/generate-document-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requirement_ids: activeProject?.reqIds || [],
          template_type: type
        })
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.heading) {
                setTerminalOutput(prev => [...prev, `[PROCESS] Building section: ${data.heading}`]);
              }
              if (data.section_num && data.total) {
                setGenerationProgress({ current: data.section_num, total: data.total });
              }
              if (data.content) {
                if (type === 'SRS') setSrsDoc(prev => prev ? prev + '\n\n' + data.content : data.content);
                else setSddDoc(prev => prev ? prev + '\n\n' + data.content : data.content);
              }
              if (data.message) {
                setTerminalOutput(prev => [...prev, `[INFO] ${data.message}`]);
              }
            } catch (e) {
              console.error('Failed to parse SSE event', e);
            }
          }
        }
      }
      setTerminalOutput(prev => [...prev, `${type} Generated Successfully.`]);
    } catch (e) {
      setTerminalOutput(prev => [...prev, `[ERROR] Failed to compile ${type}`]);
    } finally {
      setIsGenerating(prev => ({ ...prev, srs: false, sdd: false }));
    }
  };

  const handleCompileCode = () => {
    setIsCompiling(true);
    setTerminalOutput(prev => [...prev, `$ gcc -Wall ${activeFile} -o firmware.bin`]);
    setTimeout(() => {
      setTerminalOutput(prev => [...prev, 'firmware.bin compiled successfully. zero errors.']);
      setIsCompiling(false);
    }, 1200);
  };

  const handleExport = async () => {
    const content = activeTab === 'srs' ? srsDoc : activeTab === 'sdd' ? sddDoc : codeFiles[activeFile];

    if (exportFormat === 'odt') {
      try {
        setTerminalOutput(prev => [...prev, `[PROCESS] Generating ${activeTab.toUpperCase()} ODT via Pandoc...`]);
        const response = await fetch('/api/export-document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: content,
            doc_type: activeTab.toUpperCase()
          })
        });

        if (!response.ok) throw new Error('Export failed');

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `export_${activeTab.toUpperCase()}.odt`;
        a.click();
        setTerminalOutput(prev => [...prev, `[INFO] ${activeTab.toUpperCase()} ODT exported successfully.`]);
      } catch (e) {
        setTerminalOutput(prev => [...prev, `[ERROR] Failed to export ODT: ${e.message}`]);
      }
    } else {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export_${activeTab}.${exportFormat}`;
      a.click();
    }
  };

  return (
    <div className="grid grid-cols-12 gap-8 h-full overflow-hidden">

      {/* Sidebar Navigation for Code */}
      {activeTab === 'code' && (
        <div className="col-span-12 xl:col-span-3 flex flex-col bg-slate-50 border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-3 font-extrabold text-slate-800 text-sm tracking-tight">
              <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg"><FolderTree size={16} /></div>
              File Manager
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <FileNode node={fileTree} activeFile={activeFile} onSelect={setActiveFile} />
          </div>
        </div>
      )}

      {/* Editor & Console Area */}
      <div className={`${activeTab === 'code' ? 'col-span-12 xl:col-span-9' : 'col-span-12'} flex flex-col h-full gap-8 overflow-hidden`}>

        {/* Workspace Operations Topbar */}
        <div className="flex items-center justify-between p-4 bg-white rounded-[24px] border border-slate-100 shadow-sm">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {['srs', 'sdd', 'code'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-slate-800 text-white shadow' : 'text-slate-500 hover:text-slate-900'}`}
              >
                {tab.toUpperCase()} Section
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="bg-slate-100 text-slate-700 text-xs font-bold rounded-xl px-3 py-2 border border-slate-200 outline-none cursor-pointer"
            >
              <option value="md">Export .MD</option>
              <option value="odt">Export .ODT</option>
              <option value="pdf">Export .PDF</option>
              <option value="txt">Export .TXT</option>
            </select>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2"
            >
              <Download size={14} /> Download
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className={`bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl flex flex-col border border-white/5 ${isFullscreen ? 'fixed inset-4 z-50' : 'flex-1 min-h-0'}`}>
          <div className="px-8 py-4 bg-[#0f172a]/80 flex items-center justify-between border-b border-white/5">
            <span className="text-slate-400 font-mono text-xs font-bold flex items-center gap-4">
              Workspace / {activeTab === 'code' ? activeFile : `${activeTab.toUpperCase()}_Document.md`}
              {activeTab !== 'code' && (
                <button onClick={() => setIsFullscreen(!isFullscreen)} className="text-slate-500 hover:text-white transition-colors" title="Toggle Fullscreen">
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
              )}
            </span>

            {activeTab === 'code' ? (
              <button
                onClick={handleCompileCode}
                disabled={isCompiling}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2"
              >
                <Play size={12} /> {isCompiling ? 'Compiling...' : 'Run & Compile'}
              </button>
            ) : (
              <button
                onClick={() => handleGenerateDoc(activeTab.toUpperCase())}
                disabled={activeTab === 'srs' ? isGenerating.srs : isGenerating.sdd}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2"
              >
                <Zap size={12} /> {(activeTab === 'srs' ? isGenerating.srs : isGenerating.sdd) ? 'Generating...' : `Generate ${activeTab.toUpperCase()}`}
              </button>
            )}
          </div>

          {/* Progress Bar */}
          {((activeTab === 'srs' && isGenerating.srs) || (activeTab === 'sdd' && isGenerating.sdd)) && (
            <div className="h-1 w-full bg-[#0b1329] overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                style={{ width: `${(generationProgress.current / generationProgress.total) * 100}%` }}
              />
            </div>
          )}

          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 font-mono text-sm leading-relaxed overflow-hidden border-r border-white/5">
              {activeTab === 'code' ? (
                <Editor
                  height="100%"
                  theme="vs-dark"
                  path={activeFile}
                  defaultLanguage={activeFile.endsWith('.py') ? 'python' : activeFile.endsWith('.c') || activeFile.endsWith('.h') ? 'c' : 'plaintext'}
                  value={codeFiles[activeFile]}
                  onChange={(value) => setCodeFiles({ ...codeFiles, [activeFile]: value || '' })}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    padding: { top: 24, bottom: 24 },
                    scrollBeyondLastLine: false,
                    smoothScrolling: true,
                    cursorBlinking: "smooth",
                    cursorSmoothCaretAnimation: "on"
                  }}
                />
              ) : activeTab === 'srs' ? (
                <InteractiveDocumentRenderer
                  markdown={srsDoc}
                  onChange={setSrsDoc}
                />
              ) : (
                <InteractiveDocumentRenderer
                  markdown={sddDoc}
                  onChange={setSddDoc}
                />
              )}
            </div>

            {activeTab !== 'code' && (
              <div className="w-64 bg-[#0b1329] p-6 font-mono text-xs overflow-y-auto hidden md:block">
                <div className="text-slate-500 uppercase font-black tracking-[0.2em] text-[10px] mb-4">Table of Contents</div>
                <div className="space-y-2">
                  {(activeTab === 'srs' ? srsDoc : sddDoc).split('\n').filter(line => line.startsWith('#')).map((line, idx) => {
                    const level = line.match(/^#+/)[0].length;
                    const title = line.replace(/^#+\s*/, '').trim();
                    const slugify = (text) => text.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w-]/g, '');
                    const id = slugify(title);
                    return (
                      <div
                        key={idx}
                        style={{ paddingLeft: `${(level - 1) * 12}px` }}
                        onClick={() => {
                          const el = document.getElementById(id);
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="hover:text-blue-400 text-slate-400 cursor-pointer transition-colors truncate"
                      >
                        {title}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Console logs */}
        <div className={`bg-slate-950 rounded-[32px] font-mono text-xs text-slate-400 shadow-xl border border-white/5 transition-all flex flex-col shrink-0 ${isTerminalOpen ? 'h-48' : 'h-14'}`}>
          <div
            className="flex items-center justify-between p-4 px-6 cursor-pointer hover:bg-white/5 transition-colors"
            onClick={() => setIsTerminalOpen(!isTerminalOpen)}
          >
            <div className="flex items-center gap-2 text-slate-500 uppercase font-black tracking-[0.2em] text-[10px]">
              <TerminalIcon size={12} className={isTerminalOpen ? "text-blue-500" : "text-slate-500"} /> Output logs
            </div>
            <button className="text-slate-500 hover:text-white">
              {isTerminalOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          </div>
          {isTerminalOpen && (
            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-1">
              {terminalOutput.map((line, i) => (
                <div key={i} className="text-slate-300">{line}</div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function FileNode({ node, activeFile, onSelect, depth = 0 }) {
  const [isOpen, setIsOpen] = useState(true);
  const isDir = node.type === 'dir';
  const isActive = !isDir && activeFile === node.path;

  return (
    <div style={{ paddingLeft: depth * 12 }}>
      <div
        className={`flex items-center gap-2 py-2 px-3 rounded-xl cursor-pointer transition-all mb-1
          ${isActive ? 'bg-white shadow-md text-blue-600 scale-[1.02]' : 'hover:bg-white/50 text-slate-600 hover:text-slate-900'}
        `}
        onClick={() => isDir ? setIsOpen(!isOpen) : onSelect(node.path)}
      >
        {isDir ? (isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : <FileCode size={12} className={isActive ? 'text-blue-600' : 'text-slate-400'} />}
        <span className={`text-[13px] ${isActive ? 'font-black' : 'font-semibold'}`}>{node.name}</span>
      </div>
      {isDir && isOpen && node.children && (
        <div className="border-l border-slate-200 ml-4 py-1">
          {node.children.map((child, i) => (
            <FileNode key={i} node={child} activeFile={activeFile} onSelect={onSelect} depth={depth + 0.5} />
          ))}
        </div>
      )}
    </div>
  );
}
