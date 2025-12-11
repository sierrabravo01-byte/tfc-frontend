import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getAiRecommendation } from '../services/geminiService';
import { PRODUCTS } from '../constants';

interface HeroProps {
  onShopClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onShopClick }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    // Create a context string of product names for the AI
    const productContext = PRODUCTS.map(p => `${p.name} (${p.category})`).join(", ");
    
    const response = await getAiRecommendation(question, productContext);
    setAnswer(response);
    setIsLoading(false);
  };

  return (
    <div className="relative w-full bg-stone-50 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/id/431/1920/1080" 
          alt="Table spread" 
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-40 flex flex-col justify-center items-center text-center">
        <h2 className="text-white text-sm md:text-base uppercase tracking-[0.3em] mb-4">
          Farm to Table
        </h2>
        <h1 className="text-4xl md:text-7xl font-serif text-white mb-8 leading-tight">
          Taste the Spirit <br/> of Zambia
        </h1>
        <button 
          onClick={onShopClick}
          className="px-8 py-3 bg-white text-black text-xs md:text-sm uppercase tracking-widest hover:bg-stone-100 transition-colors duration-300 border border-white"
        >
          Shop the Collection
        </button>

        {/* AI Concierge Section */}
        <div className="mt-16 w-full max-w-xl bg-white/95 backdrop-blur md:rounded-sm p-6 shadow-xl border border-gray-100">
          <div className="flex items-center justify-center space-x-2 mb-4 text-stone-600">
            <Sparkles size={16} />
            <span className="text-xs uppercase tracking-widest font-serif">Culinary Concierge</span>
          </div>
          
          {answer ? (
            <div className="mb-4 animate-fade-in">
              <p className="text-stone-800 font-serif italic text-lg leading-relaxed">"{answer}"</p>
              <button 
                onClick={() => { setAnswer(''); setQuestion(''); }}
                className="mt-4 text-xs text-stone-500 hover:text-black underline underline-offset-4"
              >
                Ask another question
              </button>
            </div>
          ) : (
            <form onSubmit={handleAsk} className="relative">
              <input 
                type="text" 
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask for pairings, e.g., 'What goes with sourdough?'"
                className="w-full bg-transparent border-b border-gray-300 py-2 pl-2 pr-12 text-center text-sm focus:outline-none focus:border-stone-800 transition-colors placeholder:text-stone-400 font-serif italic"
              />
              <button 
                type="submit" 
                disabled={isLoading}
                className="absolute right-0 top-2 text-stone-800 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="h-4 w-4 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ArrowRight size={16} />
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
