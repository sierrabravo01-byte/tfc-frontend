import React from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';
import { CURRENCY } from '../constants';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, cart, updateQuantity, onCheckout }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-md w-full flex">
        <div className="h-full w-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out animate-slide-in">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-serif">Your Basket</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
              <X size={24} strokeWidth={1} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                <ShoppingBag size={48} strokeWidth={1} />
                <p className="font-serif italic text-lg">Your basket is empty</p>
                <button onClick={onClose} className="text-xs uppercase tracking-widest border-b border-gray-400 text-gray-600 hover:text-black hover:border-black">
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex space-x-4">
                  <div className="h-24 w-20 flex-shrink-0 overflow-hidden bg-gray-100">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3 className="font-serif truncate pr-4">{item.name}</h3>
                        <p className="whitespace-nowrap font-serif">{CURRENCY} {(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{item.category}</p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="flex items-center border border-gray-200">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:bg-gray-50 text-gray-600"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 py-1 text-xs">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:bg-gray-50 text-gray-600"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t border-gray-100 px-6 py-6 bg-stone-50">
              <div className="flex justify-between text-base font-serif font-medium text-gray-900 mb-4">
                <p>Subtotal</p>
                <p>{CURRENCY} {total.toFixed(2)}</p>
              </div>
              <p className="mt-0.5 text-xs text-gray-500 italic mb-6">
                Shipping and taxes calculated at checkout.
              </p>
              <button
                onClick={onCheckout}
                className="w-full flex justify-center items-center bg-black px-6 py-4 text-xs font-bold uppercase tracking-widest text-white hover:bg-stone-800 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;