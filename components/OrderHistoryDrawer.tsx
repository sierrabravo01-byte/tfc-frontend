import React from 'react';
import { X, Package, Calendar, Smartphone, Truck, MapPin } from 'lucide-react';
import { Order } from '../types';
import { CURRENCY } from '../constants';

interface OrderHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

const OrderHistoryDrawer: React.FC<OrderHistoryDrawerProps> = ({ isOpen, onClose, orders }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-md w-full flex">
        <div className="h-full w-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out animate-slide-in">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-serif">Order History</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
              <X size={24} strokeWidth={1} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-stone-50">
            {orders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                <Package size={48} strokeWidth={1} />
                <p className="font-serif italic text-lg">No past orders found</p>
                <p className="text-xs text-gray-500">Your purchase history will appear here.</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white p-5 shadow-sm border border-gray-100 rounded-sm">
                  {/* Order Header */}
                  <div className="flex justify-between items-start mb-4 pb-3 border-b border-gray-100">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Order #{order.id.slice(-6)}</p>
                      <div className="flex items-center text-xs text-gray-600">
                        <Calendar size={12} className="mr-1" />
                        {new Date(order.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-serif font-medium">{CURRENCY} {order.total.toFixed(2)}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] uppercase tracking-wider font-bold rounded-full">
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Transaction Info */}
                  <div className="mb-4 bg-gray-50 p-2 rounded space-y-1">
                    <div className="text-[10px] text-gray-500 flex items-center justify-between">
                      <span className="flex items-center">
                          <Smartphone size={12} className="mr-1"/> Mobile Money
                      </span>
                      <span>Ref: {order.transactionRef}</span>
                    </div>
                    <div className="text-[10px] text-gray-500 flex items-center justify-between border-t border-gray-200 pt-1 mt-1">
                      <span className="flex items-center">
                          {order.deliveryMethod === 'Delivery' ? <Truck size={12} className="mr-1"/> : <MapPin size={12} className="mr-1"/>}
                          {order.deliveryMethod}
                      </span>
                      <span>{order.shippingCost > 0 ? `Shipping: ${CURRENCY} ${order.shippingCost}` : 'Free'}</span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={`${order.id}-${index}`} className="flex justify-between items-center text-sm">
                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-bold text-gray-400">{item.quantity}x</span>
                          <span className="text-gray-800 line-clamp-1">{item.name}</span>
                        </div>
                        <span className="text-gray-600 font-serif text-xs">
                          {CURRENCY} {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryDrawer;
