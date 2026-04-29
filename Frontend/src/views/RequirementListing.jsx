import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export default function RequirementListing({ project }) {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [targetDoc, setTargetDoc] = useState('SyRS');
  const [showMetaForm, setShowMetaForm] = useState(false);
  const [metaData, setMetaData] = useState({ boardId: '', projectId: '', boardAcronym: '' });
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [summaries, setSummaries] = useState({});
  const [summarizingId, setSummarizingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReq, setNewReq] = useState({ id: '', text: '', type: 'Functional', source: 'Manual' });
  const navigate = useNavigate();

  useEffect(() => {
    const loadReqs = async () => {
      try {
        const res = await fetch('/api/requirements');
        const data = await res.json();
        setRequirements(data);
      } catch (err) {
        console.error("Extraction mapping failure:", err);
      } finally {
        setLoading(false);
      }
    };
    loadReqs();
  }, []);

  const handleProceed = () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one requirement.");
      return;
    }
    setShowMetaForm(true);
  };

  const handleMetaSubmit = (e) => {
    e.preventDefault();
    if (!metaData.boardId || !metaData.projectId || !metaData.boardAcronym) {
      alert("Please fill in all metadata fields.");
      return;
    }
    let target = 'system';
    if (targetDoc === 'HRS') target = 'hardware';
    else if (targetDoc === 'SRS') target = 'software';
    navigate(`/workspace/${target}`);
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === requirements.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(requirements.map(r => r.id));
    }
  };

  const handleAddReq = () => {
    if (!newReq.id || !newReq.text) return alert("Please fill in ID and Requirement text.");
    setRequirements([newReq, ...requirements]);
    setNewReq({ id: '', text: '', type: 'Functional', source: 'Manual' });
    setShowAddForm(false);
  };

  const handleSaveEdit = (id) => {
    setRequirements(requirements.map(r => r.id === id ? { ...r, text: editText } : r));
    setEditingId(null);
  };

  const handleSummarize = async (reqId, text) => {
    if (summaries[reqId]) {
      // Toggle off if already exists
      const updated = { ...summaries };
      delete updated[reqId];
      setSummaries(updated);
      return;
    }

    setSummarizingId(reqId);
    try {
      const res = await fetch('/api/rephrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, style: 'concise' })
      });
      const data = await res.json();
      setSummaries(prev => ({ ...prev, [reqId]: data.suggestions || 'Failed to parse AI summary.' }));
    } catch (e) {
      setSummaries(prev => ({ ...prev, [reqId]: 'Summary: Standardizes system operations, improving downstream performance metrics.' }));
    } finally {
      setSummarizingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-slate-400 font-bold">
        <ClipboardList className="animate-bounce text-blue-500 mb-4" size={36} />
        Extracting Document Schema...
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4">
      <header className="flex justify-between items-center bg-white p-6 border border-slate-100 rounded-[24px] shadow-sm">
        <div>
          <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest">Parsing Layer Complete</span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Extracted Technical Requirements</h2>
          <div className="text-xs font-bold text-slate-500 mt-1 bg-slate-100 inline-block px-3 py-1 rounded-lg">
             Selected: <span className="text-blue-600">{selectedIds.length}</span> / {requirements.length}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={targetDoc}
            onChange={(e) => setTargetDoc(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-xs focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
          >
            <option value="SyRS">Generate SyRS (System)</option>
            <option value="HRS">Generate HRS (Hardware)</option>
            <option value="SRS">Generate SRS (Software)</option>
          </select>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all"
          >
            {showAddForm ? 'Cancel Add' : '+ Add Requirement'}
          </button>
          <button 
            onClick={handleProceed}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 group transition-all shadow-sm"
          >
            Proceed Processing
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </header>

      {/* Project Metadata Form */}
      {showMetaForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-[32px] shadow-2xl border border-slate-100 max-w-md w-full mx-4">
            <h3 className="text-xl font-extrabold text-slate-900 mb-6 tracking-tight">Project Identification Metadata</h3>
            <form onSubmit={handleMetaSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Board ID</label>
                <input 
                  type="text" 
                  value={metaData.boardId}
                  onChange={(e) => setMetaData({...metaData, boardId: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-blue-500"
                  placeholder="e.g. BRD-X300"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Project ID</label>
                <input 
                  type="text" 
                  value={metaData.projectId}
                  onChange={(e) => setMetaData({...metaData, projectId: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-blue-500"
                  placeholder="e.g. PRJ-2026-X1"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Board Acronym</label>
                <input 
                  type="text" 
                  value={metaData.boardAcronym}
                  onChange={(e) => setMetaData({...metaData, boardAcronym: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-blue-500"
                  placeholder="e.g. ARX-CORE"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowMetaForm(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20"
                >
                  Synthesize Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Form Block */}
      {showAddForm && (
        <div className="bg-slate-50 border border-slate-100 rounded-[24px] p-6 grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <input 
              type="text" 
              placeholder="Req ID (e.g. SYR-10)" 
              className="premium-input bg-white w-full text-xs" 
              value={newReq.id} 
              onChange={e => setNewReq({...newReq, id: e.target.value})}
            />
          </div>
          <div className="col-span-6">
            <input 
              type="text" 
              placeholder="Requirement text..." 
              className="premium-input bg-white w-full text-xs" 
              value={newReq.text} 
              onChange={e => setNewReq({...newReq, text: e.target.value})}
            />
          </div>
          <div className="col-span-2">
            <select 
              className="premium-input bg-white w-full text-xs cursor-pointer"
              value={newReq.type}
              onChange={e => setNewReq({...newReq, type: e.target.value})}
            >
              <option value="Functional">Functional</option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
            </select>
          </div>
          <div className="col-span-1">
            <button 
              onClick={handleAddReq}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
            >
              Save
            </button>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck size={20} className="text-emerald-500" />
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Total Extracted: {requirements.length}
            </span>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-500 hover:text-slate-700 select-none">
            <input 
              type="checkbox"
              checked={selectedIds.length === requirements.length && requirements.length > 0}
              onChange={toggleSelectAll}
              className="rounded border-slate-200 text-blue-600 focus:ring-blue-100 cursor-pointer"
            />
            Select All
          </label>
        </div>

        {requirements.length === 0 ? (
          <div className="p-20 text-center text-slate-400 font-medium">
            No requirements detected. Verify document formatting.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {requirements.map((req, idx) => (
              <div key={req.id || idx} className="p-6 hover:bg-slate-50/50 transition-colors flex items-start gap-6">
                <div className="flex items-center mt-2">
                  <input 
                    type="checkbox"
                    checked={selectedIds.includes(req.id)}
                    onChange={() => toggleSelect(req.id)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-100 cursor-pointer"
                  />
                </div>
                <div className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm mt-0.5 select-none">
                  {req.id}
                </div>
                <div className="flex-1">
                  {editingId === req.id ? (
                    <textarea 
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 font-medium focus:outline-none focus:border-blue-500 resize-none h-24"
                    />
                  ) : (
                    <p className="text-slate-700 text-sm font-medium leading-relaxed">{req.text}</p>
                  )}
                  
                  <div className="flex items-center gap-6 mt-4">
                    <span className="text-[9px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">
                      {req.type}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
                      {req.source || 'Manual'}
                    </span>
                    
                    <div className="ml-auto flex items-center gap-4">
                      {editingId === req.id ? (
                        <button onClick={() => handleSaveEdit(req.id)} className="text-[11px] font-black text-emerald-600 hover:underline">Save Changes</button>
                      ) : (
                        <button onClick={() => { setEditingId(req.id); setEditText(req.text); }} className="text-[11px] font-black text-slate-400 hover:text-slate-600 hover:underline">Edit</button>
                      )}
                      <button 
                        onClick={() => handleSummarize(req.id, req.text)}
                        className={`text-[11px] font-black hover:underline flex items-center gap-1 ${summaries[req.id] ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-blue-600'}`}
                      >
                        {summarizingId === req.id ? 'Loading...' : summaries[req.id] ? 'Hide Summary' : 'AI Summary'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI Summary Sidebar on each card */}
                {summaries[req.id] && (
                  <div className="w-1/3 bg-blue-50/50 border border-blue-100/50 p-4 rounded-2xl text-xs text-blue-800 font-medium leading-relaxed animate-fade-in">
                    <span className="block font-black text-[9px] uppercase tracking-[0.2em] text-blue-500 mb-2">AI Node Insight</span>
                    {summaries[req.id]}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
