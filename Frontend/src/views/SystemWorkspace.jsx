import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  FolderTree, 
  Terminal as TerminalIcon, 
  Download, 
  Zap, 
  Activity,
  FileText,
  Maximize2,
  Minimize2,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import InteractiveDocumentRenderer from '../components/workspace/InteractiveDocumentRenderer';

export default function SystemWorkspace({ project: activeProject }) {
  const { syrsDoc, setSyrsDoc, archDoc, setArchDoc, isGenerating, setIsGenerating } = useOutletContext();
  const [activeTab, setActiveTab] = useState('syrs'); // 'syrs', 'architecture'
  const [exportFormat, setExportFormat] = useState('md');
  const [terminalOutput, setTerminalOutput] = useState([
    '$ archtech-sys --v3-engine',
    'Ready for system engineering mapping.'
  ]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);

  const handleGenerateDoc = async (type) => {
    setIsGenerating(prev => ({ ...prev, syrs: type === 'SYRS', arch: type !== 'SYRS' }));
    if (type === 'SYRS') setSyrsDoc('');
    else setArchDoc('');

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
              if (data.delta) {
                setTerminalOutput(prev => {
                  const last = prev[prev.length - 1];
                  if (last && !last.startsWith('[')) {
                    return [...prev.slice(0, -1), last + data.delta];
                  } else {
                    return [...prev, data.delta];
                  }
                });
              }
              if (data.content) {
                if (type === 'SYRS') setSyrsDoc(prev => prev ? prev + '\n\n' + data.content : data.content);
                else setArchDoc(prev => prev ? prev + '\n\n' + data.content : data.content);
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
      setIsGenerating(prev => ({ ...prev, syrs: false, arch: false }));
    }
  };

  const handleExport = () => {
    const content = activeTab === 'syrs' ? syrsDoc : archDoc;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export_${activeTab}.${exportFormat}`;
    a.click();
  };

  return (
    <div className="grid grid-cols-12 gap-8 h-full overflow-hidden">
      
      {/* Editor & Console Area */}
      <div className="col-span-12 flex flex-col h-full gap-8 overflow-hidden">
        
        {/* Workspace Operations Topbar */}
        <div className="flex items-center justify-between p-4 bg-white rounded-[24px] border border-slate-100 shadow-sm">
          <div className="flex bg-slate-100 p-1 rounded-xl">
             {['syrs', 'architecture'].map((tab) => (
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
                Workspace / {`${activeTab.toUpperCase()}_Document.md`}
                <button onClick={() => setIsFullscreen(!isFullscreen)} className="text-slate-500 hover:text-white transition-colors" title="Toggle Fullscreen">
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
              </span>

              <button 
                onClick={() => handleGenerateDoc(activeTab.toUpperCase())}
                disabled={activeTab === 'syrs' ? isGenerating.syrs : isGenerating.arch}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2"
              >
                <Zap size={12} /> {(activeTab === 'syrs' ? isGenerating.syrs : isGenerating.arch) ? 'Generating...' : `Generate ${activeTab.toUpperCase()}`}
              </button>
           </div>

           <div className="flex-1 flex overflow-hidden">
             <div className="flex-1 font-mono text-sm leading-relaxed overflow-hidden border-r border-white/5">
               {activeTab === 'syrs' ? (
                 <InteractiveDocumentRenderer 
                   markdown={syrsDoc} 
                   onChange={setSyrsDoc}
                 />
               ) : (
                 <InteractiveDocumentRenderer 
                   markdown={archDoc} 
                   onChange={setArchDoc}
                 />
               )}
             </div>

             <div className="w-64 bg-[#0b1329] p-6 font-mono text-xs overflow-y-auto hidden md:block">
                <div className="text-slate-500 uppercase font-black tracking-[0.2em] text-[10px] mb-4">Table of Contents</div>
                <div className="space-y-2">
                   {(activeTab === 'syrs' ? syrsDoc : archDoc).split('\n').filter(line => line.startsWith('#')).map((line, idx) => {
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
                {isTerminalOpen ? <ChevronDown size={14}/> : <ChevronUp size={14}/>}
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
