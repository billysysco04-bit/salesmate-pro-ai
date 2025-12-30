import React, { useState, useEffect, useCallback } from 'react';
import { FoodserviceInsight, CalculationResult, FlyerData } from './types';
import { FOODSERVICE_DATA as INITIAL_DATA } from './constants';
import { getDynamicAudit } from './services/geminiService';
import Calculator from './components/Calculator';
import AuditCard from './components/AuditCard';
import Login from './components/Login';
import BuddyChat from './components/BuddyChat';
import AdminPanel from './components/AdminPanel';
import FlyerPreview from './components/FlyerPreview';

declare const html2pdf: any;

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(localStorage.getItem('sm_user'));
  const [db, setDb] = useState<FoodserviceInsight[]>(() => {
    const saved = localStorage.getItem('sm_db');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeFlyer, setActiveFlyer] = useState<FlyerData | null>(null);
  const [result, setResult] = useState<FoodserviceInsight | null>(null);
  const [calcResult, setCalcResult] = useState<CalculationResult>({
    sellPrice: 15,
    cost: 4.5,
    margin: 10.5,
    marginPercent: 70
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const u = params.get('u');
    const p = params.get('p');

    if (u && p && !currentUser) {
      if ((u === 'sales_pro' && p === 'proven2025') || (u === 'manager' && p === 'mate123')) {
        handleLogin(u);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('sm_db', JSON.stringify(db));
  }, [db]);

  const handleLogin = (user: string) => {
    setCurrentUser(user);
    localStorage.setItem('sm_user', user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sm_user');
  };

  const handleAddEntry = (entry: FoodserviceInsight) => {
    setDb(prev => [entry, ...prev]);
    setResult(entry);
    setQuery(entry.id);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    const normalizedQuery = query.toLowerCase().trim();
    const localMatch = db.find(item => 
      item.id === normalizedQuery.replace(/\s+/g, '-') ||
      item.title.toLowerCase() === normalizedQuery
    );

    if (localMatch && !normalizedQuery.includes('restaurant') && !normalizedQuery.includes('joint')) {
      setResult({...localMatch, buddySuggestions: []});
      setIsSearching(false);
    } else {
      try {
        const aiResult = await getDynamicAudit(query);
        setResult({...aiResult, buddySuggestions: []});
      } catch (error) {
        console.error("AI Search Failed:", error);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleCalcUpdate = useCallback((res: CalculationResult) => {
    setCalcResult(res);
  }, []);

  const handlePushBuddySuggestion = (suggestion: string) => {
    if (result) {
      setResult({
        ...result,
        buddySuggestions: [...(result.buddySuggestions || []), suggestion]
      });
    }
  };

  const triggerPDFExport = (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    setIsGeneratingPDF(true);
    window.scrollTo(0, 0); 
    
    const opt = {
      margin: 0,
      filename: filename,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    setTimeout(() => {
      html2pdf().from(element).set(opt).save().then(() => {
        setIsGeneratingPDF(false);
      }).catch((err: any) => {
        console.error("PDF Export error", err);
        setIsGeneratingPDF(false);
      });
    }, 500);
  };

  const handleExportAudit = () => triggerPDFExport('audit-content-area', `${result?.id || 'audit'}_strategic_proposal.pdf`);
  const handleExportPlateAudit = () => triggerPDFExport('plate-audit-content-area', `${result?.id || 'plate'}_profit_analysis.pdf`);
  const handleExportFlyer = () => triggerPDFExport('flyer-capture-area', `${activeFlyer?.title.replace(/\s+/g, '_')}_flyer.pdf`);

  if (!currentUser) return <Login onLogin={handleLogin} />;

  return (
    <div className="min-h-screen pb-32 bg-[#0a0a0a] text-[#e5e5e5] overflow-x-hidden">
      {isAdminOpen && <AdminPanel onAddEntry={handleAddEntry} onClose={() => setIsAdminOpen(false)} />}
      {activeFlyer && <FlyerPreview data={activeFlyer} onExport={handleExportFlyer} onClose={() => setActiveFlyer(null)} />}

      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b-[1px] border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#ffcc00] flex items-center justify-center brutalist-border rounded-sm">
              <span className="text-black font-black text-xl italic">S</span>
            </div>
            <div>
              <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase leading-none">
                SalesMate <span className="text-[#ffcc00]">Pro AI</span>
              </h1>
              <p className="text-[9px] font-black tracking-[0.3em] text-white/40 uppercase mt-1">
                Consultant: {currentUser}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {currentUser === 'manager' && (
              <button onClick={() => setIsAdminOpen(true)} className="text-[#ffcc00] text-[10px] font-black uppercase tracking-widest hover:text-white">
                [Admin]
              </button>
            )}
            <button onClick={handleLogout} className="text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 border border-white/10 rounded-sm">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {isGeneratingPDF && (
        <div className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center text-white">
          <div className="w-20 h-20 border-[6px] border-[#ffcc00] border-t-transparent rounded-full animate-spin mb-8"></div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">Exporting Strategy...</h2>
        </div>
      )}

      <BuddyChat 
        currentContext={result} 
        onPushSuggestion={handlePushBuddySuggestion} 
        onGenerateFlyer={setActiveFlyer}
      />

      <main className="max-w-6xl mx-auto px-6 pt-12">
        <section className={`transition-all duration-700 ${result ? 'mb-12' : 'mb-24'}`}>
          <div className="bg-[#111] p-1 border-4 border-black shadow-[12px_12px_0px_#ffcc00]">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-0">
              <input 
                type="text" 
                placeholder="Target Account or Cuisine..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-black text-white p-6 font-black outline-none placeholder:text-white/20 text-2xl"
              />
              <button 
                type="submit" 
                disabled={isSearching}
                className="bg-[#ffcc00] text-black px-12 py-6 font-black uppercase tracking-widest hover:bg-white disabled:opacity-50 text-xl italic"
              >
                {isSearching ? 'ANALYZING...' : 'RUN LIVE AUDIT'}
              </button>
            </form>
          </div>
        </section>

        {result ? (
          <div className="space-y-12">
            <AuditCard insight={result} onPrint={handleExportAudit} />
            <div id="plate-audit-content-area" className="bg-white border-4 border-black pdf-export-container">
               <div className="p-8"><Calculator onCalculate={handleCalcUpdate} /></div>
               <div className="p-12 bg-black border-4 border-black m-8">
                  <div className="grid grid-cols-2 gap-16">
                    <div className="border-l-[10px] border-green-500 pl-8">
                      <span className="text-xs font-black text-white uppercase block mb-3">Plate Contribution</span>
                      <p className="font-black text-green-500 text-6xl leading-none italic">${calcResult.margin.toFixed(2)}</p>
                    </div>
                    <div className="border-l-[10px] border-blue-500 pl-8">
                      <span className="text-xs font-black text-white uppercase block mb-3">Profit Yield</span>
                      <p className="font-black text-blue-400 text-6xl leading-none italic">{calcResult.marginPercent.toFixed(1)}%</p>
                    </div>
                  </div>
               </div>
            </div>
            <button onClick={handleExportPlateAudit} className="w-full bg-[#ffcc00] text-black text-base font-black p-6 uppercase border-4 border-black shadow-[8px_8px_0px_#000] mb-20">
               Export Profit Plan (PDF)
            </button>
          </div>
        ) : (
          <div className="text-center py-32 border-4 border-dashed border-white/10 rounded-sm bg-white/5">
            <h3 className="text-5xl font-black text-white/10 uppercase italic tracking-tighter">Awaiting Input...</h3>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

