import React, { useState } from 'react';
import { FoodserviceInsight } from './types';

interface AdminPanelProps {
  onAddEntry: (entry: FoodserviceInsight) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onAddEntry, onClose }) => {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    insight_1: '',
    insight_2: '',
    tip: '',
    type: 'account' as 'account' | 'category',
    phone: ''
  });

  const [magicLink, setMagicLink] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEntry({
      ...formData,
      id: formData.id.toLowerCase().replace(/\s+/g, '-')
    });
    onClose();
  };

  const generateMagicLink = (user: 'sales_pro' | 'manager') => {
    const pass = user === 'sales_pro' ? 'proven2025' : 'mate123';
    const baseUrl = window.location.href.split('?')[0];
    const link = `${baseUrl}?u=${user}&p=${pass}`;
    
    navigator.clipboard.writeText(link);
    setMagicLink(`${user.toUpperCase()} LINK COPIED!`);
    setTimeout(() => setMagicLink(''), 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border-4 border-black shadow-[10px_10px_0px_#d40000] w-full max-w-lg p-8 my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-black">Admin Panel</h2>
          <button onClick={onClose} className="text-black font-black hover:text-[#d40000]">CLOSE X</button>
        </div>

        <div className="mb-8 p-4 bg-gray-100 border-2 border-black">
          <h3 className="text-xs font-black uppercase tracking-widest mb-3 text-black">Magic Access Links (Testing)</h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => generateMagicLink('sales_pro')}
              className="bg-black text-white py-2 text-[10px] font-black uppercase tracking-tighter hover:bg-[#d40000]"
            >
              Sales Pro Link
            </button>
            <button 
              onClick={() => generateMagicLink('manager')}
              className="bg-black text-white py-2 text-[10px] font-black uppercase tracking-tighter hover:bg-[#d40000]"
            >
              Manager Link
            </button>
          </div>
          {magicLink && <p className="text-[9px] font-black text-green-600 mt-2 text-center animate-pulse">{magicLink}</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest mb-1 text-black">Add Field Strategy</h3>
          <input 
            placeholder="Search Key (e.g. food-truck)" 
            className="w-full border-2 border-black p-3 font-bold text-black"
            value={formData.id}
            onChange={e => setFormData({...formData, id: e.target.value})}
            required
          />
          <input 
            placeholder="Display Title (e.g. Food Truck)" 
            className="w-full border-2 border-black p-3 font-bold text-black"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            required
          />
          <textarea 
            placeholder="Strategy 1" 
            className="w-full border-2 border-black p-3 font-bold h-24 text-black"
            value={formData.insight_1}
            onChange={e => setFormData({...formData, insight_1: e.target.value})}
            required
          />
          <textarea 
            placeholder="Strategy 2" 
            className="w-full border-2 border-black p-3 font-bold h-24 text-black"
            value={formData.insight_2}
            onChange={e => setFormData({...formData, insight_2: e.target.value})}
            required
          />
          <input 
            placeholder="Pro Tip" 
            className="w-full border-2 border-black p-3 font-bold text-black"
            value={formData.tip}
            onChange={e => setFormData({...formData, tip: e.target.value})}
            required
          />
          <select 
            className="w-full border-2 border-black p-3 font-black uppercase text-xs text-black"
            value={formData.type}
            onChange={e => setFormData({...formData, type: e.target.value as any})}
          >
            <option value="account">Account</option>
            <option value="category">Category</option>
          </select>
          <input 
            placeholder="Phone (Optional)" 
            className="w-full border-2 border-black p-3 font-bold text-black"
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
          />
          <button type="submit" className="w-full bg-[#d40000] text-white py-4 font-black uppercase tracking-widest hover:bg-black transition-colors">
            Add to Field Database
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;
