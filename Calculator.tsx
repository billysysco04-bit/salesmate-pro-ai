import React, { useState, useEffect, useCallback } from 'react';
import { CalculationResult, Ingredient } from '../types';
import { getIngredientCosts } from '../services/geminiService';

interface CalculatorProps {
  onCalculate: (result: CalculationResult) => void;
}

const Calculator: React.FC<CalculatorProps> = ({ onCalculate }) => {
  const [price, setPrice] = useState<number>(15.00);
  const [cost, setCost] = useState<number>(4.50);
  const [ingredientsInput, setIngredientsInput] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  // Calculate margin based on either the manual cost or the sum of ingredients
  const currentCost = ingredients.length > 0 
    ? ingredients.reduce((sum, item) => sum + item.cost, 0)
    : cost;

  const margin = price - currentCost;
  const marginPercent = price > 0 ? (margin / price) * 100 : 0;

  useEffect(() => {
    onCalculate({ sellPrice: price, cost: currentCost, margin, marginPercent });
  }, [price, currentCost, onCalculate, margin, marginPercent]);

  const handleResolveIngredients = async () => {
    if (!ingredientsInput.trim()) return;
    setIsResolving(true);
    try {
      const resolved = await getIngredientCosts(ingredientsInput);
      setIngredients(resolved);
      // Automatically sync the main "Plate Cost" field for non-ingredient mode
      const total = resolved.reduce((sum, item) => sum + item.cost, 0);
      setCost(total);
    } catch (err) {
      console.error("Failed to resolve costs", err);
    } finally {
      setIsResolving(false);
    }
  };

  const updateIngredientCost = (index: number, newCost: number) => {
    const updated = [...ingredients];
    updated[index].cost = newCost;
    setIngredients(updated);
    const total = updated.reduce((sum, item) => sum + item.cost, 0);
    setCost(total);
  };

  const clearIngredients = () => {
    setIngredients([]);
    setIngredientsInput('');
  };

  return (
    <div className="bg-[#1e293b] p-6 brutalist-border rounded-lg mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[#facc15] font-black text-xl flex items-center uppercase tracking-wider italic">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2-2v14a2 2 0 002 2z" />
          </svg>
          Live Plate-Profit Auditor
        </h3>
        {ingredients.length > 0 && (
          <button 
            onClick={clearIngredients}
            className="text-[11px] font-black text-white hover:text-[#facc15] uppercase tracking-widest bg-black/40 px-3 py-1 rounded transition-colors"
          >
            Reset Breakdown
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left Side: Inputs */}
        <div className="space-y-6">
          <div>
            <label className="block text-[11px] font-black text-gray-200 uppercase mb-2 tracking-widest">Target Menu Price ($)</label>
            <input 
              type="number" 
              step="0.01"
              value={price} 
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full bg-[#334155] border-2 border-[#475569] p-4 rounded text-3xl font-black focus:border-[#facc15] outline-none transition-colors text-white"
            />
          </div>

          {!ingredients.length ? (
            <div>
              <label className="block text-[11px] font-black text-gray-200 uppercase mb-2 tracking-widest">Manual Plate Cost ($)</label>
              <input 
                type="number" 
                step="0.01"
                value={cost} 
                onChange={(e) => setCost(Number(e.target.value))}
                className="w-full bg-[#334155] border-2 border-[#475569] p-4 rounded text-3xl font-black focus:border-[#d40000] outline-none transition-colors text-white"
              />
            </div>
          ) : (
             <div className="bg-[#0f172a] p-5 border-2 border-green-500/50 rounded shadow-inner">
                <label className="block text-[11px] font-black text-green-400 uppercase mb-2 tracking-widest">Itemized Total Cost</label>
                <div className="text-4xl font-black text-white">${currentCost.toFixed(2)}</div>
             </div>
          )}
        </div>

        {/* Right Side: Ingredient Breakdown Tool */}
        <div className="bg-black/30 p-5 border-2 border-[#334155] rounded-lg">
          <label className="block text-[11px] font-black text-[#facc15] uppercase mb-3 tracking-widest italic">Build Plate via Ingredients</label>
          <div className="flex flex-col gap-3">
            <textarea 
              placeholder="e.g. 8oz Ribeye, 4oz Asparagus, 1 cup Mashed Potatoes, 2oz Compound Butter"
              className="w-full bg-[#0f172a] border border-[#334155] p-4 text-sm font-bold text-white min-h-[100px] outline-none focus:border-[#facc15] placeholder:text-gray-500"
              value={ingredientsInput}
              onChange={(e) => setIngredientsInput(e.target.value)}
            />
            <button 
              onClick={handleResolveIngredients}
              disabled={isResolving || !ingredientsInput.trim()}
              className="bg-[#facc15] text-black font-black uppercase text-xs py-4 tracking-widest hover:bg-white transition-all disabled:opacity-50 shadow-md"
            >
              {isResolving ? 'ESTIMATING MARKET COSTS...' : 'RESOLVE ITEM COSTS'}
            </button>
          </div>
        </div>
      </div>

      {/* Itemized Table */}
      {ingredients.length > 0 && (
        <div className="mb-8 border-t border-[#334155] pt-6 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-black text-gray-300 uppercase tracking-widest border-b-2 border-[#334155]">
                <th className="pb-3 px-2">Ingredient Item</th>
                <th className="pb-3 px-2">Quantity</th>
                <th className="pb-3 px-2 text-right">Market Cost ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]/30">
              {ingredients.map((ing, idx) => (
                <tr key={idx} className="group hover:bg-black/20">
                  <td className="py-4 px-2 text-sm font-black text-white uppercase">{ing.name}</td>
                  <td className="py-4 px-2 text-sm font-bold text-gray-300 italic">{ing.quantity}</td>
                  <td className="py-4 px-2 text-right">
                    <input 
                      type="number"
                      step="0.01"
                      className="bg-[#0f172a] border border-[#334155] text-right font-black text-green-400 p-2 w-24 outline-none focus:border-green-400 rounded"
                      value={ing.cost}
                      onChange={(e) => updateIngredientCost(idx, Number(e.target.value))}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Output */}
      <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[#334155]">
        <div className="bg-[#0f172a] p-6 text-center rounded-lg border-2 border-[#334155] shadow-xl">
          <span className="text-[11px] font-black text-gray-300 uppercase block mb-2 tracking-widest">Plate Margin</span>
          <h4 className="text-4xl font-black text-green-500 italic">${margin.toFixed(2)}</h4>
        </div>
        <div className="bg-[#0f172a] p-6 text-center rounded-lg border-2 border-[#334155] shadow-xl">
          <span className="text-[11px] font-black text-gray-300 uppercase block mb-2 tracking-widest">Yield %</span>
          <h4 className="text-4xl font-black text-blue-400 italic">{marginPercent.toFixed(1)}%</h4>
        </div>
      </div>
    </div>
  );
};

export default Calculator;