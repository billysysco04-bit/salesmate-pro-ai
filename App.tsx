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

  // Magic Link Detection
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const u = params.get('u');
    const p = params.get('p');

    if (u && p && !currentUser) {
      if ((u === 'sales_pro' && p === 'proven2025') || (u === 'manager' && p === 'mate123')) {
        handleLogin(u);
        // Clean up URL without refreshing
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
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        letterRendering: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        width: 1000,
        windowWidth: 1000
      },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] } 
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

  const handleExportAudit = () => {
    triggerPDFExport('audit-content-area', `${result?.id || 'audit'}_strategic_proposal.pdf`);
  };

  const handleExportPlateAudit = () => {
    triggerPDFExport('plate-audit-content-area', `${result?.id || 'plate'}_profit_analysis.pdf`);
  };

  const handleExportFlyer = () => {
    triggerPDFExport('flyer-capture-area', `${activeFlyer?.title.replace(/\s+/g, '_')}_flyer.pdf`);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen pb-32 bg-[#0a0a0a] text-[#e5e5e5] overflow-x-hidden selection:bg-[#ffcc00] selection:text-black">
      {isAdminOpen && <AdminPanel onAddEntry={handleAddEntry} onClose={() => setIsAdminOpen(false)} />}

      {activeFlyer && (
        <FlyerPreview 
          data={activeFlyer} 
          onExport={handleExportFlyer} 
          onClose={() => setActiveFlyer(null)} 
        />
      )}

      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b-[1px] border-white/10 px-6 py-4 print:hidden">
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
                Consultant: {currentUser} | 2025 Field Suite
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {currentUser === 'manager' && (
              <button onClick={() => setIsAdminOpen(true)} className="text-[#ffcc00] text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
                [Admin]
              </button>
            )}
            <button onClick={handleLogout} className="bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 border border-white/10 rounded-sm transition-all">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {isGeneratingPDF && (
        <div className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center text-white print:hidden">
          <div className="w-20 h-20 border-[6px] border-[#ffcc00] border-t-transparent rounded-full animate-spin mb-8"></div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">Exporting Professional Intelligence...</h2>
          <p className="text-[#ffcc00] font-bold mt-2 animate-pulse uppercase tracking-[0.4em] text-sm">Generating High-Fidelity Asset</p>
        </div>
      )}

      <BuddyChat 
        currentContext={result} 
        onPushSuggestion={handlePushBuddySuggestion} 
        onGenerateFlyer={setActiveFlyer}
      />

      <main className="max-w-6xl mx-auto px-6 pt-12">
        {!result && !isSearching && (
          <div className="mb-20 animate-in fade-in slide-in-from-top-12 duration-1000">
            <div className="relative mb-12">
              <div className="absolute -left-12 -top-12 w-64 h-64 bg-[#ffcc00]/10 rounded-full blur-[120px]"></div>
              <h2 className="text-7xl sm:text-8xl font-black uppercase italic tracking-tighter text-white leading-[0.85] mb-6">
                Dominate the <br/>
                <span className="text-[#ffcc00] relative">
                  Plate.
                  <span className="absolute bottom-4 left-0 w-full h-4 bg-[#ffcc00]/20 -z-10"></span>
                </span>
              </h2>
              <p className="text-xl font-medium text-white/60 max-w-2xl leading-relaxed">
                Unlock deep-field intelligence for any foodservice account. 
                Our AI-engine audits operational labor, plate-cost yields, and 
                strategic marketing in real-time.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
              {[
                { label: 'Avg. Profit Increase', value: '+14.2%', color: 'text-green-500' },
                { label: 'Labor Hours Saved', value: '2.4 hrs', color: 'text-blue-400' },
                { label: 'Active Strategy Models', value: '256+', color: 'text-[#ffcc00]' }
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-sm">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] block mb-2">{stat.label}</span>
                  <span className={`text-4xl font-black ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <section className={`transition-all duration-700 ${result ? 'mb-12' : 'mb-24'}`}>
          <div className="bg-[#111] p-1 border-4 border-black shadow-[12px_12px_0px_#ffcc00]">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-0">
              <input 
                type="text" 
                placeholder="Target Account (e.g. 'Healthcare') or Cuisine..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-black text-white p-6 font-black outline-none placeholder:text-white/20 text-2xl"
              />
              <button 
                type="submit" 
                disabled={isSearching}
                className="bg-[#ffcc00] text-black px-12 py-6 font-black uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50 min-w-[240px] text-xl italic"
              >
                {isSearching ? 'ANALYZING...' : 'RUN LIVE AUDIT'}
              </button>
            </form>
          </div>
          
          {!result && (
            <div className="mt-8 flex gap-x-6 gap-y-3 flex-wrap items-center">
              <span className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em]">Field Presets:</span>
              {['Healthcare', 'Independent', 'Hotel', 'Food Truck', 'Catering', 'School'].map(s => (
                <button 
                  key={s} 
                  onClick={() => { setQuery(s); }}
                  className="text-xs font-bold text-white/60 hover:text-[#ffcc00] uppercase border-b-2 border-transparent hover:border-[#ffcc00] transition-all pb-1"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </section>

        {result ? (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <AuditCard insight={result} onPrint={handleExportAudit} />
            
            <div id="plate-audit-content-area" className="bg-white border-4 border-black shadow-none pdf-export-container">
               <div className="mb-10 flex justify-between items-end border-b-[12px] border-black pb-6 pdf-avoid-break">
                 <div className="pdf-text-sharp">
                    <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none text-black">Live Cost Analysis</h2>
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-900 mt-2">Account Intelligence: {result.title}</p>
                 </div>
                 <div className="text-right hidden sm:block pdf-text-sharp">
                    <p className="text-xs font-black uppercase tracking-widest text-black">Consultant: {currentUser}</p>
                    <p className="text-[11px] font-bold text-gray-600">{new Date().toLocaleDateString()}</p>
                 </div>
               </div>

               <div className="pdf-avoid-break">
                <Calculator onCalculate={handleCalcUpdate} />
               </div>
               
               <div className="p-12 bg-black border-4 border-black mt-12 relative overflow-hidden pdf-avoid-break">
                  <div className="scanline print-hidden"></div>
                  <div className="flex justify-between items-center mb-10 border-b-4 border-white/10 pb-6 relative z-20 pdf-text-sharp">
                    <h5 className="text-sm font-black text-[#ffcc00] uppercase tracking-[0.4em]">EXECUTIVE MARGIN SUMMARY</h5>
                    <span className="bg-[#d40000] text-white text-[10px] font-black px-4 py-1 uppercase tracking-widest">FIELD VERIFIED</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 relative z-20">
                    <div className="border-l-[10px] border-green-500 pl-8 pdf-text-sharp">
                      <span className="text-xs font-black text-white uppercase block mb-3 tracking-widest">Plate Contribution</span>
                      <p className="font-black text-green-500 text-6xl leading-none italic">${calcResult.margin.toFixed(2)}</p>
                    </div>
                    <div className="border-l-[10px] border-blue-500 pl-8 pdf-text-sharp">
                      <span className="text-xs font-black text-white uppercase block mb-3 tracking-widest">Profit Yield</span>
                      <p className="font-black text-blue-400 text-6xl leading-none italic">{calcResult.marginPercent.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="mt-12 pt-8 border-t border-white/20 relative z-20 pdf-text-sharp">
                     <p className="text-white text-sm italic font-bold leading-relaxed max-w-3xl">
                       Strategic Objective: Target SKU consolidation to reduce inventory complexity while maintaining a minimum 65% contribution yield across core menu items.
                     </p>
                  </div>
               </div>
               
               <div className="mt-10 p-6 border-t border-gray-200 pdf-avoid-break pdf-text-sharp">
                  <p className="text-[11px] font-bold text-gray-900 leading-relaxed uppercase text-center italic max-w-xl mx-auto">
                    Ownership and Rights Statement: This application and all of its components, including but not limited to the code, processes, models, and future versions, are fully owned and controlled by Billy James Harman. Billy James Harman retains all rights to own, control, distribute, and sell this application and its associated elements.
                  </p>
                  <p className="text-[9px] font-black text-center uppercase tracking-widest text-black/40 mt-4">SALESMATE PRO AI | STRATEGIC IMPACT 2025</p>
               </div>
            </div>
          </div>
        ) : (
          !isSearching && (
            <div className="text-center py-32 border-4 border-dashed border-white/10 rounded-sm bg-white/5 animate-in zoom-in-95 duration-700">
              <h3 className="text-5xl font-black text-white/10 uppercase italic tracking-tighter leading-none mb-6">Awaiting Input...</h3>
              <p className="text-white/30 font-black max-w-sm mx-auto uppercase text-[10px] tracking-[0.4em] leading-relaxed">
                Enter an account name or category to initialize the profit engine.
              </p>
            </div>
          )
        )}
        
        <div className="mt-32 pt-16 border-t border-white/10 print-hidden">
           <div className="flex flex-col items-center">
              <div className="flex items-center gap-4 mb-8">
                 <div className="h-[2px] w-12 bg-white/10"></div>
                 <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Proprietary Field Intelligence</span>
                 <div className="h-[2px] w-12 bg-white/10"></div>
              </div>
              <p className="text-[10px] font-bold text-white/40 leading-relaxed uppercase text-center max-w-4xl mx-auto px-6">
                Ownership and Rights Statement: This application and all of its components, including but not limited to the code, processes, models, and future versions, are fully owned and controlled by Billy James Harman. Billy James Harman retains all rights to own, control, distribute, and sell this application and its associated elements.
              </p>
              <p className="mt-8 text-[9px] font-black text-white/10 uppercase tracking-widest">SALESMATE PRO AI v2.5 | 2025 ALL RIGHTS RESERVED</p>
           </div>
        </div>
      </main>

      {result && (
        <footer className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-2xl border-t-[6px] border-[#ffcc00] p-6 print:hidden z-50 animate-in slide-in-from-bottom-full duration-500">
          <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
            <div className="flex items-center gap-16">
              <div className="hidden xs:block">
                <span className="text-[10px] font-black text-white/40 uppercase block mb-2 tracking-widest">Live Plate Margin</span>
                <span className="text-4xl font-black text-[#ffcc00] leading-none italic">${calcResult.margin.toFixed(2)}</span>
              </div>
              <div className="h-12 w-[1px] bg-white/10 hidden xs:block"></div>
              <div>
                <span className="text-[10px] font-black text-white/40 uppercase block mb-2 tracking-widest">Contribution Yield</span>
                <span className="text-4xl font-black text-blue-400 leading-none italic">{calcResult.marginPercent.toFixed(1)}%</span>
              </div>
            </div>
            <button 
              onClick={handleExportPlateAudit}
              className="bg-[#ffcc00] text-black text-base font-black px-12 py-5 uppercase tracking-tighter hover:bg-white transition-all shadow-[8px_8px_0px_rgba(255,204,0,0.2)] active:translate-y-1 active:shadow-none italic"
            >
              Export Global Profit Plan (PDF)
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;