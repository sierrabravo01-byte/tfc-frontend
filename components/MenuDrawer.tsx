import React from 'react';
import { X, ChevronRight, Instagram, Facebook, Twitter } from 'lucide-react';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuDrawer: React.FC<MenuDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      {/* Drawer - Slide from Left */}
      <div className="absolute inset-y-0 left-0 max-w-xs w-full flex">
        <div className="h-full w-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out animate-slide-in-left">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <span className="text-xl font-serif">Menu</span>
            <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
              <X size={24} strokeWidth={1} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto py-6">
            <nav className="space-y-1">
              {['Home', 'Shop All', 'Our Artisans', 'About Us', 'Sustainability', 'Contact'].map((item) => (
                <a 
                  key={item}
                  href="#" 
                  className="flex items-center justify-between px-6 py-4 text-gray-800 hover:bg-stone-50 transition-colors group"
                >
                  <span className="font-serif text-lg">{item}</span>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-black transition-colors" />
                </a>
              ))}
            </nav>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 p-6 bg-stone-50">
            <div className="flex justify-center space-x-6 text-gray-400 mb-6">
               <Instagram size={20} className="hover:text-black cursor-pointer" />
               <Facebook size={20} className="hover:text-black cursor-pointer" />
               <Twitter size={20} className="hover:text-black cursor-pointer" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-serif font-bold uppercase tracking-widest mb-1">The Food Collective</h3>
              <p className="text-[10px] text-gray-500">Lusaka, Zambia</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuDrawer;
