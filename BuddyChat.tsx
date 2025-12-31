import React, { useState, useRef, useEffect } from 'react';
import { getBuddyResponse } from '../services/geminiService';
import { FoodserviceInsight, FlyerData } from '../types';

interface BuddyChatProps {
  currentContext: FoodserviceInsight | null;
  onPushSuggestion: (suggestion: string) => void;
  onGenerateFlyer: (flyer: FlyerData) => void;
}

const BuddyChat: React.FC<BuddyChatProps> = ({ currentContext, onPushSuggestion, onGenerateFlyer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'buddy' | 'user'; text: string; flyerData?: FlyerData | null }[]>([
    { role: 'buddy', text: "Hey Pro. Need a tactical edge? Ask me for a Happy Hour menu or a recipe flyer." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const parseFlyer = (text: string): { cleanText: string; flyer: FlyerData | null } => {
    const startTag = '[FLYER_JSON]';
    const endTag = '[/FLYER_JSON]';
    if (text.includes(startTag)) {
      const parts = text.split(startTag);
      const cleanText = parts[0];
      const jsonPart = parts[1].split(endTag)[0];
      try {
        return { cleanText, flyer: JSON.parse(jsonPart) };
      } catch (e) {
        console.error("Flyer parse error", e);
      }
    }
    return { cleanText: text, flyer: null };
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await getBuddyResponse(userMsg, currentContext);
      const { cleanText, flyer } = parseFlyer(response);
      setMessages(prev => [...prev, { role: 'buddy', text: cleanText, flyerData: flyer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'buddy', text: "Connection drop. Retrying..." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-[60] print:hidden">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-[#ffcc00] text-black w-16 h-16 rounded-full border-4 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center hover:-translate-y-1 transition-transform"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.015 21.5a.5.5 0 00.635.635L7 20.662c1.47.851 3.179 1.338 5 1.338 5.523 0 10-4.477 10-10S17.523 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>
          </svg>
        </button>
      ) : (
        <div className="bg-white w-80 sm:w-96 border-4 border-black shadow-[8px_8px_0px_#000] flex flex-col max-h-[600px] overflow-hidden">
          <div className="bg-black text-[#ffcc00] p-5 flex justify-between items-center border-b-4 border-[#ffcc00]">
            <span className="font-black uppercase tracking-[0.2em] text-[12px] flex items-center italic">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-3 animate-pulse"></span>
              Buddy Live: Strategy Core
            </span>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-[#ffcc00] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-5 bg-gray-200 min-h-[350px]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[92%] p-5 text-[15px] font-black leading-tight shadow-md border-2 border-black ${
                  msg.role === 'user' 
                    ? 'bg-black text-white rounded-l-xl rounded-tr-xl' 
                    : 'bg-[#fff5cc] text-black rounded-r-xl rounded-tl-xl'
                }`}>
                  {msg.text}
                </div>
                {msg.flyerData && (
                  <button 
                    onClick={() => onGenerateFlyer(msg.flyerData!)}
                    className="mt-4 bg-[#d40000] text-white text-[12px] font-black px-5 py-4 uppercase border-2 border-black flex items-center shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all italic tracking-tighter"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    Initialize High-Impact Flyer
                  </button>
                )}
                {msg.role === 'buddy' && i !== 0 && !msg.flyerData && (
                  <button 
                    onClick={() => onPushSuggestion(msg.text)}
                    className="mt-3 text-[11px] font-black uppercase text-[#d40000] hover:text-black transition-colors flex items-center gap-1 bg-white/50 px-2 py-1 rounded border border-black/10"
                  >
                    <span className="text-xl leading-none font-black">+</span> Append to Strategy
                  </button>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-black/10 p-4 rounded-full flex space-x-2">
                  <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-5 border-t-4 border-black flex bg-white gap-3">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Query Business Engine..."
              className="flex-1 text-base font-black p-3 outline-none border-b-4 border-transparent focus:border-[#ffcc00] placeholder:text-gray-600 text-black bg-gray-50 rounded"
            />
            <button className="bg-black text-[#ffcc00] px-6 py-3 font-black text-sm uppercase hover:bg-[#d40000] hover:text-white transition-all border-2 border-black italic">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};


export default BuddyChat;

