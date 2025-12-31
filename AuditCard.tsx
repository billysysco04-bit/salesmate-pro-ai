import React from 'react';
import { FoodserviceInsight } from '../types';

interface AuditCardProps {
  insight: FoodserviceInsight;
  onPrint: () => void;
}

const AuditCard: React.FC<AuditCardProps> = ({ insight, onPrint }) => {
  const handleShare = () => {
    const text = `SalesMate Pro Strategy for ${insight.title}:\n1. ${insight.insight_1}\n2. ${insight.insight_2}\nTip: ${insight.tip}`;
    if (navigator.share) {
      navigator.share({ title: 'SalesMate Pro Audit', text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Strategic insights copied to clipboard!");
    }
  };

  const mapUrl = `https://www.google.com/maps/search/${encodeURIComponent(insight.title)}`;

  return (
    <div id="audit-content-area" className="bg-white p-10 border-4 border-black shadow-[12px_12px_0px_#d40000] mb-12 relative overflow-hidden pdf-export-container">
      <div className="absolute top-0 right-0 bg-[#d40000] text-white px-6 py-2 text-xs font-black uppercase tracking-widest border-l-4 border-b-4 border-black italic print-hidden">
        {insight.type === 'category' ? 'Category Intel' : 'Strategic Audit'}
      </div>
      
      <div className="mb-10 pdf-avoid-break">
        <h2 className="text-6xl font-black text-black uppercase tracking-tighter leading-[0.9] border-b-[16px] border-black pb-4 inline-block italic">
          {insight.title}
        </h2>
      </div>

      {/* Field Actions */}
      <div className="grid grid-cols-3 gap-4 mb-12 print:hidden">
        <a 
          href={insight.phone ? `tel:${insight.phone}` : '#'} 
          className={`flex items-center justify-center gap-3 p-4 font-black text-xs uppercase border-4 border-black transition-all ${insight.phone ? 'bg-[#22c55e] text-white hover:bg-black active:translate-y-1' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          Direct Dial
        </a>
        <a 
          href={mapUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 p-4 bg-black text-white font-black text-xs uppercase border-4 border-black hover:bg-[#d40000] transition-all active:translate-y-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          Location Intel
        </a>
        <button 
          onClick={handleShare}
          className="flex items-center justify-center gap-3 p-4 bg-white text-black font-black text-xs uppercase border-4 border-black hover:bg-gray-100 transition-all active:translate-y-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.683-1.843l-4.94-2.47a3.027 3.027 0 000-.23l4.94-2.47A2.981 2.981 0 0015 8z" />
          </svg>
          Share Plan
        </button>
      </div>

      <div className="space-y-8 mb-12">
        <div className="bg-[#fff9e6] p-8 border-l-[12px] border-[#ffcc00] pdf-avoid-break border-black">
          <div className="flex gap-6">
            <div className="bg-black text-[#ffcc00] font-black h-10 w-10 flex items-center justify-center shrink-0 border-2 border-[#ffcc00]">01</div>
            <div>
              <h4 className="font-black text-black uppercase text-xs mb-2 tracking-[0.4em]">Strategy: Operational Leverage</h4>
              <p className="text-2xl text-black leading-tight font-black italic">{insight.insight_1}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#fff9e6] p-8 border-l-[12px] border-[#ffcc00] pdf-avoid-break border-black">
          <div className="flex gap-6">
            <div className="bg-black text-[#ffcc00] font-black h-10 w-10 flex items-center justify-center shrink-0 border-2 border-[#ffcc00]">02</div>
            <div>
              <h4 className="font-black text-black uppercase text-xs mb-2 tracking-[0.4em]">Strategy: Profit Velocity</h4>
              <p className="text-2xl text-black leading-tight font-black italic">{insight.insight_2}</p>
            </div>
          </div>
        </div>
      </div>

      {insight.buddySuggestions && insight.buddySuggestions.length > 0 && (
        <div className="mb-12 space-y-6">
          <h4 className="font-black text-black uppercase text-sm tracking-[0.5em] border-b-4 border-black inline-block mb-4 pdf-avoid-break">Marketing & Visual Assets</h4>
          {insight.buddySuggestions.map((suggestion, idx) => (
            <div key={idx} className="bg-gray-50 p-8 border-4 border-dashed border-gray-400 relative pdf-avoid-break">
               <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-black"></div>
              <p className="text-base font-bold text-black whitespace-pre-line leading-relaxed">{suggestion}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-black p-8 mb-12 border-4 border-black pdf-avoid-break">
        <div className="text-xs font-black text-[#ffcc00] uppercase tracking-[0.5em] mb-4 flex items-center">
          <span className="w-2 h-2 bg-[#ffcc00] mr-3 rounded-full animate-pulse"></span>
          Consultant Closing Note:
        </div>
        <p className="text-2xl italic font-medium text-white leading-tight">"{insight.tip}"</p>
      </div>

      <div className="mb-10 p-6 border-t-2 border-gray-200 pdf-avoid-break">
        <p className="text-[11px] font-bold text-gray-900 leading-relaxed uppercase text-center italic font-medium">
          Ownership and Rights Statement: This application and all of its components, including but not limited to the code, processes, models, and future versions, are fully owned and controlled by Billy James Harman. Billy James Harman retains all rights to own, control, distribute, and sell this application and its associated elements.
        </p>
        <p className="text-[9px] font-black text-center uppercase tracking-[0.5em] text-black/40 mt-4">SALESMATE PRO AI | FIELD INTELLIGENCE 2025</p>
      </div>

      <button 
        onClick={onPrint}
        className="w-full bg-[#d40000] text-white font-black py-6 hover:bg-black transition-all uppercase tracking-[0.4em] text-base flex items-center justify-center print:hidden italic border-b-8 border-black shadow-[8px_8px_0px_rgba(212,0,0,0.2)]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Download Full Strategic Proposal
      </button>
    </div>
  );
};


export default AuditCard;




