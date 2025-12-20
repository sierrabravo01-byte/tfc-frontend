import React from 'react';
import { X, ShoppingBag, Store, Heart, ShieldCheck } from 'lucide-react';
import { Product } from '../types';
import { CURRENCY } from '../constants';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAdd: (product: Product) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onAdd }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-4xl h-full md:h-auto md:max-h-[90vh] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-scale-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full text-black md:text-gray-400 hover:text-black transition-colors"
        >
          <X size={24} />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 bg-stone-100 h-64 md:h-auto overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info Section */}
        <div className="w-full md:w-1/2 p-6 md:p-12 overflow-y-auto flex flex-col">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-400 mb-2">{product.category}</p>
            <h2 className="text-3xl md:text-4xl font-serif text-black mb-4 leading-tight">{product.name}</h2>
            <p className="text-2xl font-serif text-stone-800 mb-8">{CURRENCY} {product.price.toFixed(2)}</p>
            
            <div className="space-y-6 text-stone-600 leading-relaxed font-light">
              <div>
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-black mb-2">Description</h4>
                <p>{product.description}</p>
              </div>

              {product.details && (
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-black mb-2">The Process</h4>
                  <p className="italic text-sm">{product.details}</p>
                </div>
              )}

              <div className="pt-8 border-t border-stone-100">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="h-10 w-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-400">
                    <Store size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-black">Meet the Artisan</h4>
                    <p className="text-sm font-serif">{product.vendor.name}</p>
                  </div>
                </div>
                <p className="text-xs italic text-stone-500 line-clamp-3">
                  {product.vendor.story || "Hand-crafting quality food products in the heart of Zambia."}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 space-y-4">
             <button 
               onClick={() => {
                 onAdd(product);
                 onClose();
               }}
               className="w-full bg-black text-white py-4 font-bold text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors flex items-center justify-center space-x-3"
             >
               <ShoppingBag size={18} />
               <span>Add to Basket</span>
             </button>
             
             <div className="flex items-center justify-center space-x-4 text-[10px] uppercase tracking-widest text-stone-400">
               <span className="flex items-center"><ShieldCheck size={12} className="mr-1" /> Quality Guaranteed</span>
               <span className="flex items-center"><Heart size={12} className="mr-1" /> Handmade with care</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
