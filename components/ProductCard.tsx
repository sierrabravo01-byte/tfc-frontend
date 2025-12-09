import React from 'react';
import { Plus, Store } from 'lucide-react';
import { Product } from '../types';
import { CURRENCY } from '../constants';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
  return (
    <div className="group relative flex flex-col bg-white">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 group-hover:filter-none filter grayscale-[20%]"
        />
        {/* Quick Add Overlay (Desktop) */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/90 backdrop-blur-sm hidden md:flex justify-between items-center">
           <span className="text-sm font-serif">{CURRENCY} {product.price.toFixed(2)}</span>
           <button 
             onClick={() => onAdd(product)}
             className="text-xs uppercase tracking-widest border-b border-black hover:opacity-70 transition-opacity"
           >
             Add to Basket
           </button>
        </div>
        
        {/* Mobile Add Button */}
        <button 
          onClick={() => onAdd(product)}
          className="md:hidden absolute bottom-2 right-2 h-8 w-8 bg-white rounded-full shadow flex items-center justify-center text-black"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Info */}
      <div className="mt-4 text-center md:text-left space-y-1">
        <p className="text-[10px] uppercase tracking-widest text-gray-500">
          {product.category}
        </p>
        <h3 className="text-lg font-serif text-gray-900 group-hover:underline decoration-1 underline-offset-4 cursor-pointer">
          {product.name}
        </h3>
        
        {/* Vendor Badge */}
        <div className="flex items-center justify-center md:justify-start space-x-1.5 pt-1 group/vendor cursor-pointer">
          <Store size={12} className="text-gray-400 group-hover/vendor:text-black transition-colors" />
          <p className="text-xs text-gray-500 italic group-hover/vendor:text-black transition-colors border-b border-transparent group-hover/vendor:border-gray-300">
            {product.vendor.name}
          </p>
        </div>

        <p className="md:hidden text-sm font-medium mt-1">
          {CURRENCY} {product.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;