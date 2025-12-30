import React, { useState } from 'react';

interface LoginProps {
  onLogin: (user: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((username === 'sales_pro' && password === 'proven2025') || 
        (username === 'manager' && password === 'mate123')) {
      onLogin(username);
    } else {
      setError('Invalid Consultant ID or Password');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'SalesMate Pro AI',
      text: 'Access the Strategic Foodservice Intelligence Dashboard.',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('App URL copied to clipboard! Send this link to your mobile device to test.');
      }
    } catch (err) {
      console.error('Share failed', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 brutalist-border brutalist-shadow w-full max-w-md relative">
        <div className="bg-[#b71c1c] text-white p-4 -mt-12 mb-8 text-center brutalist-border">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">SalesMate Pro</h2>
          <p className="text-[10px] font-bold tracking-widest uppercase">Consultant Edition 2025</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-black uppercase mb-2">Consultant ID</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-2 border-black p-3 font-bold outline-none focus:bg-gray-50 text-black"
              placeholder="e.g. sales_pro"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-black text-black uppercase mb-2">Security Key</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-black p-3 font-bold outline-none focus:bg-gray-50 text-black"
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-[#b71c1c] text-xs font-bold uppercase">{error}</p>}
          <button 
            type="submit"
            className="w-full bg-black text-white font-black py-4 uppercase tracking-widest hover:bg-[#b71c1c] transition-all"
          >
            Sign In to Dashboard
          </button>
        </form>

        <button 
          onClick={handleShare}
          className="mt-6 w-full bg-gray-100 text-black font-black py-3 uppercase text-[10px] tracking-widest border-2 border-black hover:bg-white flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.683-1.843l-4.94-2.47a3.027 3.027 0 000-.23l4.94-2.47A2.981 2.981 0 0015 8z" />
          </svg>
          Share App Access Link
        </button>
        
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-[9px] font-bold text-gray-400 leading-tight uppercase text-center">
            Ownership and Rights Statement:<br/>
            This application and all of its components, including but not limited to the code, processes, models, and future versions, are fully owned and controlled by Billy James Harman. Billy James Harman retains all rights to own, control, distribute, and sell this application and its associated elements.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;