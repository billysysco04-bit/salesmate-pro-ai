import React from 'react';
import { FlyerData } from './types';

interface FlyerPreviewProps {
  data: FlyerData;
  onExport: () => void;
  onClose: () => void;
}

interface FlyerItem {
  name: string;
  description: string;
  price?: string;
  margin?: string;
}

const FlyerPreview: React.FC<FlyerPreviewProps> = ({ data, onExport, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/95 z-[200] flex flex-col items-center justify-center p-4 overflow-y-auto print:static print:bg-white">
      <div className="w-full max-w-2xl bg-white border-[10px] border-black p-0 mb-8 print:shadow-none print:border-4 pdf-export-container overflow-hidden" id="flyer-capture-area">
        <div className="text-center border-b-8 border-black pb-8 mb-8 pdf-avoid-break">
          <h1 className="text-7xl font-black uppercase tracking-tight leading-none italic text-black">
            {data.title}
          </h1>
          {data.subtitle && (
            <p className="text-2xl font-black bg-black text-[#ffcc00] inline-block px-6 py-1 mt-6 uppercase tracking-widest italic">
              {data.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-12 px-10">
          <div className="space-y-8">
            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-[#d40000] border-b-4 border-[#d40000] inline-block mb-4">
              Featured Profit Items
            </h2>
            {data.items.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between items-start border-b-2 border-black pb-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-black uppercase leading-none text-black">{item.name}</h3>
                  <p className="text-sm text-black font-black mt-2 uppercase italic leading-tight">{item.description}</p>
                </div>
                <div className="text-right ml-10">
                  <p className="text-3xl font-black text-black">{item.price}</p>
                  {item.margin && <p className="text-[12px] font-black text-green-800 uppercase tracking-tighter mt-1">Margin: {item.margin}</p>}
                </div>
              </div>
            ))}
          </div>

          {data.recipe && (
            <div className="bg-gray-50 p-10 border-4 border-black border-dashed">
              <h2 className="text-sm font-black uppercase tracking-[0.4em] text-black mb-6 flex items-center">
                <span className="bg-black text-[#ffcc00] px-3 py-1 mr-5 italic">STRATEGIC RECIPE</span>
                {data.recipe.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <div>
                  <h4 className="text-[11px] font-black uppercase mb-2 text-black tracking-widest border-b-2 border-black inline-block pb-1">Core Ingredients:</h4>
                  <ul className="text-sm font-black list-disc pl-5 mt-5 space-y-3 text-black">
                    {data.recipe.ingredients.map((ing: any, i: number) => <li key={i}>{ing}</li>)}
                  </ul>
                </div>
                <div className="border-l-4 border-black pl-10">
                  <h4 className="text-[11px] font-black uppercase mb-2 text-[#d40000] tracking-widest border-b-2 border-[#d40000] inline-block pb-1">Profit Advantage:</h4>
                  <p className="text-sm font-black text-black leading-snug italic mt-5">{data.recipe.marginNote}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-24 text-center border-t-8 border-black pt-12 pb-12 px-10">
          <p className="text-4xl font-black uppercase italic tracking-tighter text-black leading-none mb-8">{data.callToAction}</p>
          <div className="mt-12 pt-8 border-t-2 border-gray-200">
            <p className="text-[11px] font-bold text-gray-900 uppercase tracking-tight italic">
              Ownership and Rights Statement: Fully owned by Billy James Harman.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 print-hidden">
        <button onClick={onClose} className="bg-gray-800 text-white font-black px-10 py-5 uppercase tracking-widest">Discard</button>
        <button onClick={onExport} className="bg-[#ffcc00] text-black font-black px-14 py-5 uppercase tracking-widest border-2 border-black">Download PDF</button>
      </div>
    </div>
  );
};

export default FlyerPreview;
