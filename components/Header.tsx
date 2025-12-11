import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Menu, Search, X, User } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onHistoryClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  cartCount, 
  onCartClick, 
  onHistoryClick, 
  searchQuery, 
  onSearchChange, 
  onMenuClick 
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [localSearchValue, setLocalSearchValue] = useState(searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync local state if the prop changes externally (e.g. clearing search from App)
  useEffect(() => {
    setLocalSearchValue(searchQuery);
  }, [searchQuery]);

  // Debounce logic: Only call parent onSearchChange after user stops typing for 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      // Only fire if the value is different to prevent loops
      if (localSearchValue !== searchQuery) {
        onSearchChange(localSearchValue);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [localSearchValue, onSearchChange, searchQuery]);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchValue(e.target.value);
  };

  const toggleSearch = () => {
    if (isSearchOpen && localSearchValue) {
      // If closing with text, clear it immediately
      setLocalSearchValue('');
      onSearchChange('');
    }
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Left: Mobile Menu & Search */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <button 
              onClick={onMenuClick}
              className="p-2 text-gray-600 hover:text-black transition-colors"
            >
              <Menu size={24} strokeWidth={1} />
            </button>
            
            <div className={`flex items-center ${isSearchOpen ? 'bg-gray-50 rounded-full pl-2' : ''} transition-all duration-300`}>
              <button 
                onClick={toggleSearch}
                className="p-2 text-gray-600 hover:text-black transition-colors"
                aria-label="Toggle Search"
              >
                {isSearchOpen ? <X size={20} strokeWidth={1} /> : <Search size={20} strokeWidth={1} />}
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isSearchOpen ? 'w-40 md:w-64 opacity-100 mr-2' : 'w-0 opacity-0'}`}>
                <input
                  ref={inputRef}
                  type="text"
                  value={localSearchValue}
                  onChange={handleInputChange}
                  placeholder="Search products..."
                  className="w-full bg-transparent border-none focus:ring-0 text-sm text-gray-900 placeholder-gray-400 font-serif h-full py-1 leading-relaxed outline-none"
                />
              </div>
            </div>
          </div>

          {/* Center: Logo */}
          <div className={`flex-shrink-0 flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto' : 'opacity-100'}`}>
            <div className="text-center">
              <h1 className="text-xl md:text-3xl font-serif tracking-wider text-black uppercase whitespace-nowrap">
                The Food Collective
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mt-1">
                Artisanal Zambia
              </p>
            </div>
          </div>

          {/* Right: Cart & History */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <button 
              onClick={onHistoryClick}
              className="p-2 text-gray-600 hover:text-black transition-colors"
              title="Order History"
            >
              <User size={22} strokeWidth={1} />
            </button>

            <button 
              onClick={onCartClick}
              className="group relative p-2 text-gray-800 hover:text-black transition-colors"
            >
              <div className="flex items-center space-x-2">
                <span className="hidden md:block text-xs uppercase tracking-widest group-hover:underline decoration-1 underline-offset-4">
                  Basket
                </span>
                <ShoppingBag size={22} strokeWidth={1} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-0 md:-top-1 md:-right-2 bg-black text-white text-[10px] flex items-center justify-center h-4 w-4 rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
