import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Maximize2, Minimize2, Edit3, TerminalSquare, Save, X, RefreshCw, Trash2 } from 'lucide-react';

export default function InteractiveDocumentRenderer({ 
  markdown, 
  onChange,
  onRephrase 
}) {
  const [viewMode, setViewMode] = useState('preview'); // 'preview' | 'raw'
  const [editModal, setEditModal] = useState(null); // { type: 'table' | 'mermaid', rawText: '', startOffset, endOffset }

  // Fallback slugify for ToC ids
  const slugify = (text) => {
    if (typeof text !== 'string') return '';
    return text.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w-]/g, '');
  };

  const HoverWrapper = ({ node, Component = 'div', className = '', children, ...props }) => {
    return (
       <Component className={`relative group hover:bg-slate-800/30 transition-colors -mx-4 px-4 py-1 rounded-lg ${className}`} {...props}>
          <div className="absolute top-1/2 -translate-y-1/2 right-2 z-10 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 p-1.5 rounded-lg border border-slate-700 shadow-xl">
              <button 
                onClick={(e) => {
                   e.preventDefault();
                   const raw = getRawFromPosition(node);
                   if (raw) {
                       setEditModal({ 
                          type: 'text', 
                          title: 'Edit Content',
                          rawText: raw, 
                          originalText: raw,
                          startOffset: node.position?.start?.offset,
                          endOffset: node.position?.end?.offset
                       });
                   } else {
                       alert("Could not locate exact source in raw markdown. Switch to Raw Edit mode.");
                   }
                }}
                title="Edit"
                className="p-1.5 hover:bg-blue-600 text-slate-300 hover:text-white rounded transition-colors"
              >
                <Edit3 size={14} />
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  onRephrase && onRephrase(getRawFromPosition(node) || '')
                }}
                title="Rephrase"
                className="p-1.5 hover:bg-purple-600 text-slate-300 hover:text-white rounded transition-colors"
              >
                <RefreshCw size={14} />
              </button>
              <button 
                onClick={(e) => {
                   e.preventDefault();
                   const raw = getRawFromPosition(node);
                   if (raw) {
                      let newMarkdown = markdown;
                      if (node.position?.start?.offset !== undefined && node.position?.end?.offset !== undefined) {
                         newMarkdown = markdown.substring(0, node.position.start.offset) + markdown.substring(node.position.end.offset);
                      } else {
                         newMarkdown = markdown.replace(raw, '');
                      }
                      onChange(newMarkdown);
                   }
                }}
                title="Delete"
                className="p-1.5 hover:bg-red-600 text-slate-300 hover:text-white rounded transition-colors"
              >
                <Trash2 size={14} />
              </button>
          </div>
          {children}
       </Component>
    );
  };

  const HeadingRenderer = ({ level, node, children, ...props }) => {
    // Extract text content from children
    const getText = (child) => {
      if (typeof child === 'string') return child;
      if (Array.isArray(child)) return child.map(getText).join('');
      if (child && child.props && child.props.children) return getText(child.props.children);
      return '';
    };
    
    const text = getText(children);
    const id = slugify(text);
    const Tag = `h${level}`;

    return (
      <HoverWrapper Component={Tag} node={node} id={id} className="scroll-mt-24 cursor-text" {...props}>
        {children}
      </HoverWrapper>
    );
  };

  const TextRenderer = ({ node, children, ...props }) => (
    <HoverWrapper Component="p" node={node} className="mb-4 text-slate-300 leading-relaxed" {...props}>
      {children}
    </HoverWrapper>
  );

  const ListRenderer = ({ node, children, ordered, ...props }) => {
    const Tag = ordered ? 'ol' : 'ul';
    return (
      <HoverWrapper Component={Tag} node={node} className={`${ordered ? 'list-decimal' : 'list-disc'} pl-6 mb-4 text-slate-300 space-y-2`} {...props}>
        {children}
      </HoverWrapper>
    );
  };

  // Helper to extract raw text from AST position if available, else fallback
  const getRawFromPosition = (node) => {
    if (node && node.position && node.position.start && node.position.end) {
        // Attempting to slice from original markdown based on line/column
        // remark positions provide line/column and sometimes offset
        if (node.position.start.offset !== undefined && node.position.end.offset !== undefined) {
             return markdown.slice(node.position.start.offset, node.position.end.offset);
        }
        
        // Fallback to line-based slicing if offsets aren't available
        const lines = markdown.split('\n');
        const startLine = node.position.start.line - 1;
        const endLine = node.position.end.line - 1;
        
        if (startLine === endLine) {
            return lines[startLine].substring(node.position.start.column - 1, node.position.end.column - 1);
        }
        
        let extracted = lines[startLine].substring(node.position.start.column - 1) + '\n';
        for (let i = startLine + 1; i < endLine; i++) {
            extracted += lines[i] + '\n';
        }
        extracted += lines[endLine].substring(0, node.position.end.column - 1);
        return extracted;
    }
    return null;
  };

  const handleSaveModal = () => {
    if (!editModal) return;
    
    let newMarkdown = markdown;
    
    if (editModal.startOffset !== undefined && editModal.endOffset !== undefined) {
       // Replace exact bytes
       newMarkdown = markdown.substring(0, editModal.startOffset) + editModal.rawText + markdown.substring(editModal.endOffset);
    } else if (editModal.originalText) {
       // Replace first exact match
       newMarkdown = markdown.replace(editModal.originalText, editModal.rawText);
    }
    
    onChange(newMarkdown);
    setEditModal(null);
  };

  const TableRenderer = ({ node, ...props }) => {
    return (
      <div className="relative group overflow-x-auto border border-slate-700 rounded-lg bg-slate-900/50">
         <div className="absolute top-0 right-0 z-10 flex gap-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 rounded-bl-lg">
            <button 
              onClick={() => {
                 const raw = getRawFromPosition(node);
                 if (raw) {
                     setEditModal({ 
                        type: 'table', 
                        title: 'Edit Table Markdown',
                        rawText: raw, 
                        originalText: raw,
                        startOffset: node.position?.start?.offset,
                        endOffset: node.position?.end?.offset
                     });
                 } else {
                     alert("Could not locate exact table source in raw markdown. Switch to Raw Edit mode.");
                 }
              }}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded flex items-center gap-1"
            >
              <Edit3 size={12} /> Edit Table
            </button>
         </div>
         <table className="w-full text-sm text-left text-slate-300 m-0" {...props} />
      </div>
    );
  };

  const CodeRenderer = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const isMermaid = match && match[1] === 'mermaid';
    const rawCode = String(children).replace(/\n$/, '');

    if (!inline && isMermaid) {
      return (
        <div className="relative group my-6 border border-slate-700 rounded-lg bg-[#0b1329] p-4">
           <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => {
                   setEditModal({ 
                      type: 'mermaid', 
                      title: 'Edit Mermaid Diagram',
                      rawText: rawCode, 
                      originalText: rawCode,
                      // Note: Replacing mermaid code directly might need careful matching because of the backticks wrapper
                      isCodeBlock: true
                   });
                }}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded flex items-center gap-1"
              >
                <Edit3 size={12} /> Edit Diagram
              </button>
           </div>
           <div className="text-emerald-400 font-mono text-xs whitespace-pre overflow-x-auto">
             {/* Simple raw display of mermaid for now, could integrate a mermaid-react renderer here later */}
             {rawCode}
           </div>
        </div>
      );
    }

    return !inline ? (
      <pre className="bg-[#0b1329] p-4 rounded-lg overflow-x-auto text-sm border border-white/5 my-4">
        <code className={className} {...props}>{children}</code>
      </pre>
    ) : (
      <code className="bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
        {children}
      </code>
    );
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Internal Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-[#0b1329] border-b border-white/5">
        <button
          onClick={() => setViewMode('preview')}
          className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${viewMode === 'preview' ? 'bg-blue-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
        >
          Preview
        </button>
        <button
          onClick={() => setViewMode('raw')}
          className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${viewMode === 'raw' ? 'bg-blue-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
        >
          Raw Edit
        </button>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-hidden relative bg-[#0f172a]">
        {viewMode === 'raw' ? (
          <textarea
            className="w-full h-full bg-slate-900 text-slate-300 border-none outline-none resize-none font-mono text-sm p-6 leading-relaxed focus:ring-0 selection:bg-blue-500/30"
            value={markdown}
            onChange={(e) => onChange(e.target.value)}
            spellCheck="false"
          />
        ) : (
          <div className="w-full h-full overflow-y-auto p-8 px-12">
            <div className="prose prose-invert prose-slate max-w-none prose-headings:scroll-mt-24 prose-th:bg-slate-800 prose-th:p-3 prose-td:p-3 prose-td:border-b prose-td:border-slate-800 prose-table:border-collapse prose-table:m-0">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: TextRenderer,
                  ul: ListRenderer,
                  ol: ListRenderer,
                  h1: (props) => <HeadingRenderer level={1} {...props} />,
                  h2: (props) => <HeadingRenderer level={2} {...props} />,
                  h3: (props) => <HeadingRenderer level={3} {...props} />,
                  h4: (props) => <HeadingRenderer level={4} {...props} />,
                  h5: (props) => <HeadingRenderer level={5} {...props} />,
                  h6: (props) => <HeadingRenderer level={6} {...props} />,
                  table: TableRenderer,
                  code: CodeRenderer,
                }}
              >
                {markdown}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Custom Editor Modal (Table / Diagram) */}
      {editModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-8">
           <div className="bg-slate-900 border border-slate-700 rounded-[24px] shadow-2xl w-full max-w-4xl flex flex-col h-[80vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 bg-[#0b1329] border-b border-slate-800">
                 <h3 className="text-white font-bold text-lg flex items-center gap-2">
                   <TerminalSquare className="text-blue-500" size={20} />
                   {editModal.title}
                 </h3>
                 <button onClick={() => setEditModal(null)} className="text-slate-400 hover:text-white p-2 bg-slate-800 rounded-full">
                    <X size={16} />
                 </button>
              </div>
              <div className="flex-1 p-6 flex flex-col gap-4 overflow-hidden">
                 <div className="text-xs text-slate-400 font-mono">
                    Edit the raw Markdown directly. Save when finished.
                 </div>
                 <textarea 
                    className="flex-1 bg-[#0b1329] text-emerald-400 font-mono text-sm p-4 rounded-xl border border-slate-700 outline-none focus:border-blue-500 transition-colors resize-none"
                    value={editModal.rawText}
                    onChange={(e) => setEditModal({...editModal, rawText: e.target.value})}
                    spellCheck="false"
                 />
              </div>
              <div className="p-6 bg-[#0b1329] border-t border-slate-800 flex justify-end gap-3">
                 <button 
                   onClick={() => setEditModal(null)}
                   className="px-6 py-2 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-800 transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={handleSaveModal}
                   className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 flex items-center gap-2 transition-all shadow-lg"
                 >
                   <Save size={16} /> Save Changes
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
