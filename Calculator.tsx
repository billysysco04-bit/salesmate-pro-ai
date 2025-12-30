import React, { useState, useEffect } from 'react';
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

  const currentCost = ingredients.length > 0 
    ? ingredients.reduce((sum: number, item: Ingredient) => sum + item.cost, 0)
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
      setCost(resolved.reduce((sum: number, item: Ingredient) => sum + item.cost, 0));
    } catch (err) {
      console.error(err);
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <div className="bg-[#1e293b] p-6 brutalist-border rounded-lg">
      <h3 className="text-[#facc15] font-black text-xl mb-6 uppercase tracking-wider italic">Plate-Profit Auditor</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="space-y-6">
          <div>
            <label className="block text-[11px] font-black text-gray-200 uppercase mb-2 tracking-widest">Target Price ($)</label>
            <input type="number" step="0.01" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full bg-[#334155] border-2 border-[#475569] p-4 rounded text-3xl font-black text-white outline-none focus:border-[#facc15]" />
          </div>
          <div>
             <label className="block text-[11px] font-black text-gray-200 uppercase mb-2 tracking-widest">Plate Cost ($)</label>
             <input type="number" step="0.01" value={cost} onChange={(e) => setCost(Number(e.target.value))} className="w-full bg-[#334155] border-2 border-[#475569] p-4 rounded text-3xl font-black text-white outline-none focus:border-red-500" disabled={ingredients.length > 0} />
          </div>
        </div>
        <div className="bg-black/30 p-5 border-2 border-[#334155] rounded-lg">
          <label className="block text-[11px] font-black text-[#facc15] uppercase mb-3 tracking-widest">Ingredient Builder</label>
          <textarea placeholder="e.g. 8oz Steak, 4oz Veggies..." className="w-full bg-[#0f172a] p-4 text-sm font-bold text-white min-h-[100px] outline-none" value={ingredientsInput} onChange={(e) => setIngredientsInput(e.target.value)} />
          <button onClick={handleResolveIngredients} disabled={isResolving} className="w-full bg-[#facc15] text-black font-black uppercase text-xs py-4 mt-2 tracking-widest">
            {isResolving ? 'Resolving...' : 'Calculate via AI'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;


