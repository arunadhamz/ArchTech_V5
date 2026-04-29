import React, { useState } from 'react';
import { Database, UploadCloud, CheckCircle2, AlertTriangle, FolderOpen, Cpu, Layout, FileText, Archive } from 'lucide-react';

const vectorBaseContents = [
  { id: 1, folder: "Hardware Specs", files: 12, lastUpdated: "2 hours ago", icon: Cpu },
  { id: 2, folder: "System Architecture", files: 5, lastUpdated: "1 day ago", icon: Layout },
  { id: 3, folder: "ICD Documents", files: 8, lastUpdated: "3 days ago", icon: FileText },
  { id: 4, folder: "Legacy Project X", files: 45, lastUpdated: "1 week ago", icon: Archive }
];

export default function KnowledgeBase() {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error'

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) return alert("Please select reference files/folders.");
    setIsUploading(true);
    setUploadStatus(null);
    
    // Create FormData mapping
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      // Mocking target RAG injection
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUploadStatus('success');
      setFiles([]);
    } catch (e) {
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center text-center">
         <div className="p-4 bg-rose-50 text-rose-600 rounded-3xl mb-6 shadow-sm"><Database size={32} /></div>
         <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">RAG Context Knowledge Base</h3>
         <p className="text-sm text-slate-500 font-medium max-w-md mt-2">
            Upload schematics, ICD documents, baseline specs, or folders. We'll index variables cleanly.
         </p>

         <div className="w-full mt-10 border-2 border-dashed border-slate-200 hover:border-rose-300 rounded-[24px] p-12 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer relative group">
            <input 
              type="file" 
              multiple 
              webkitdirectory="true" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={handleFileChange}
            />
            <div className="flex flex-col items-center">
               <UploadCloud size={40} className="text-slate-400 group-hover:text-rose-500 transition-colors mb-4" />
               <p className="text-slate-700 font-bold text-sm">Drag files or click to upload</p>
               <p className="text-[11px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Supports Folders, PDFs, TXT, DOCX</p>
            </div>
         </div>

         {files.length > 0 && (
           <div className="w-full mt-6 bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <FolderOpen className="text-slate-500" size={18} />
                 <span className="text-xs font-bold text-slate-700">{files.length} items ready for ingestion.</span>
              </div>
              <button 
                onClick={handleUpload}
                disabled={isUploading}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:bg-rose-400 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                {isUploading ? 'Indexing...' : 'Index Repository'}
              </button>
           </div>
         )}

         {uploadStatus === 'success' && (
            <div className="w-full mt-6 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 font-bold text-xs">
              <CheckCircle2 size={16} /> Documents synthesized into vector layers effectively.
            </div>
         )}
      </div>

      {/* Current Vectorbase Contents */}
      <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
         <div className="flex items-center justify-between mb-8">
            <div>
               <h4 className="text-lg font-extrabold text-slate-900 tracking-tight">Vector Base Contents</h4>
               <p className="text-xs text-slate-500 font-medium mt-1">Data currently indexed and available for RAG</p>
            </div>
            <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 text-xs font-bold text-slate-600 flex items-center gap-2">
               <Database size={14} className="text-rose-500" />
               Total: 70 Documents
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vectorBaseContents.map((item) => {
               const Icon = item.icon;
               return (
                 <div key={item.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-md transition-all group flex gap-4 items-center cursor-pointer">
                    <div className="p-3 bg-white border border-slate-100 rounded-xl group-hover:scale-110 group-hover:border-rose-200 group-hover:text-rose-500 transition-all text-slate-400">
                       <Icon size={24} />
                    </div>
                    <div className="flex-1">
                       <h5 className="text-sm font-bold text-slate-800">{item.folder}</h5>
                       <div className="flex items-center gap-3 mt-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          <span>{item.files} Files</span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                          <span>{item.lastUpdated}</span>
                       </div>
                    </div>
                 </div>
               );
            })}
         </div>
      </div>
    </div>
  );
}
