import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Rocket, 
  FileUp, 
  Shield, 
  Cpu, 
  Code, 
  ArrowRight,
  PlusCircle,
  Archive,
  Layers
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Landing({ onProjectCreate }) {
  const [formData, setFormData] = useState({ name: '', id: '', docType: 'TechSpec', doc: null });
  const navigate = useNavigate();

  const [isUploading, setIsUploading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.doc) return alert(`Please upload a ${formData.docType} file.`);
    
    setIsUploading(true);
    setLoadingStage('Purging legacy data folders...');
    
    const stages = [
      'Purging legacy data folders...',
      'Scanning files for requirements...',
      'Running heuristic content extraction...',
      'Generating sentence embeddings...',
      'Rebuilding ChromaDB vectors...'
    ];
    
    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < stages.length - 1) {
        currentStage++;
        setLoadingStage(stages[currentStage]);
      }
    }, 1500);

    try {
      const data = new FormData();
      data.append('files', formData.doc);
      
      const response = await fetch(`/api/upload-requirements`, {
        method: 'POST',
        body: data,
      });

      if (!response.ok) throw new Error('Upload failed');
      const result = await response.json();
      
      clearInterval(interval);
      setLoadingStage('Finalizing project linkages...');
      
      setTimeout(() => {
        onProjectCreate({ 
          id: formData.id, 
          name: formData.name, 
          docType: formData.docType, 
          reqIds: result.ids || [] 
        });

        navigate(`/workspace/requirements`);
      }, 800);
    } catch (err) {
      clearInterval(interval);
      console.error(err);
      alert('Failed to initialize project on backend.');
      setIsUploading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#f8fafc] flex items-center justify-center p-4">
      {/* Mesh Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-100 rounded-full blur-[100px] opacity-30"></div>
      </div>

      <div className="max-w-5xl w-full flex flex-col md:flex-row bg-white rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden relative z-10 transition-all">
        
        {/* Left Side: App Context */}
        <div className="w-full md:w-[45%] bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
           <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
           
           <div>
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-900 font-extrabold text-2xl">A</div>
                <span className="text-xl font-extrabold tracking-tighter uppercase whitespace-nowrap">ArchTech AI</span>
              </div>

              <h1 className="text-4xl font-extrabold leading-tight mb-6">
                The Engineering <br/>
                <span className="text-blue-400">Command Hub</span>
              </h1>
              
              <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/10 rounded-lg text-blue-400"><Layers size={20} /></div>
                    <span className="text-sm font-bold text-slate-300">System Traceability</span>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/10 rounded-lg text-indigo-400"><Cpu size={20} /></div>
                    <span className="text-sm font-bold text-slate-300">Hardware HRS Synthesis</span>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/10 rounded-lg text-violet-400"><Code size={20} /></div>
                    <span className="text-sm font-bold text-slate-300">Software SRS/SDD Automation</span>
                 </div>
              </div>
           </div>

           <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-[24px]">
              <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2">System Status</div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                 <span className="text-xs font-bold text-slate-300">Core Engine v3.0 Online</span>
              </div>
           </div>
        </div>

        {/* Right Side: Action Area */}
        <div className="flex-1 p-12 bg-white flex flex-col justify-center">
           <div className="max-w-md mx-auto w-full">
              <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Project Creation</div>
              <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Initialize Workspace</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-400 uppercase ml-1 tracking-widest">Project Identification</label>
                  <input 
                    type="text" 
                    className="premium-input bg-slate-50" 
                    placeholder="Project Name (e.g. Starlink X1)"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                  />
                  <input 
                    type="text" 
                    className="premium-input bg-slate-50 mt-2" 
                    placeholder="Project ID (e.g. ARCH-2026)"
                    value={formData.id}
                    onChange={e => setFormData({...formData, id: e.target.value})}
                    required
                  />
                  <div className="space-y-1.5 mt-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase ml-1 tracking-widest">Document Type</label>
                    <select 
                      className="premium-input bg-slate-50 w-full rounded-xl py-3 px-4 border border-slate-100 font-medium text-slate-700"
                      value={formData.docType}
                      onChange={e => setFormData({...formData, docType: e.target.value})}
                    >
                      <option value="TechSpec">Technical Specification (Full Chain)</option>
                      <option value="SyRS">System Requirements (SyRS)</option>
                      <option value="HRS">Hardware Requirements (HRS)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[11px] font-black text-slate-400 uppercase ml-1 tracking-widest">Source Technical Specification</label>
                   <div className="relative group">
                      <input 
                        type="file" 
                        className="hidden" 
                        id="doc-upload"
                        onChange={e => setFormData({...formData, doc: e.target.files[0]})}
                      />
                      <label 
                        htmlFor="doc-upload" 
                        className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-slate-100 bg-slate-50/50 rounded-2xl cursor-pointer hover:border-blue-300 hover:bg-white transition-all"
                      >
                        <div className="w-14 h-14 bg-white shadow-sm rounded-full flex items-center justify-center mb-3 text-blue-600 transition-transform group-hover:scale-110">
                          <FileUp size={24} />
                        </div>
                        <span className="text-sm font-bold text-slate-700">
                          {formData.doc ? formData.doc.name : `Click to Upload ${formData.docType}`}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1 font-bold">PDF, Markdown or DOCX</span>
                      </label>
                   </div>
                </div>

                {isUploading ? (
                  <div className="mt-4 p-6 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center text-center gap-2 animate-fade-in shadow-inner">
                    <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Backend Ingestion</span>
                    <span className="text-xs font-bold text-slate-700">{loadingStage}</span>
                  </div>
                ) : (
                  <button type="submit" className="btn-launch mt-4 py-4">
                    Launch Enterprise Hub
                    <ArrowRight size={20} />
                  </button>
                )}
              </form>
           </div>
        </div>

      </div>
    </div>
  );
}
