import React, { useState, useEffect } from 'react';
import { X, Smartphone, CheckCircle, ShieldCheck, Loader2, SearchCheck, Lock, Truck, MapPin, PlusCircle } from 'lucide-react';
import { CartItem, Order, DeliveryZone, Vendor } from '../types';
import { CURRENCY, KAZANG_PRODUCT_IDS, KAZANG_CONFIG, BACKEND_API_URL, DELIVERY_ZONES, PICKUP_ADDRESS, ZONE_LANDMARKS } from '../constants';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  clearCart: () => void;
  onOrderComplete: (order: Order) => void;
}

enum Step {
  FORM = 0,
  INITIATING = 1,
  PENDING_USSD = 2,
  PROCESSING = 3,
  SUCCESS = 4
}

type Provider = 'Airtel' | 'MTN' | 'Zamtel';
type DeliveryMethod = 'Delivery' | 'Collection';

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, cart, clearCart, onOrderComplete }) => {
  const [step, setStep] = useState<Step>(Step.FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState<Provider>('Airtel'); 
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('Delivery');
  const [selectedZone, setSelectedZone] = useState<DeliveryZone>(DELIVERY_ZONES[0]);
  const [transactionRef, setTransactionRef] = useState('');
  
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = deliveryMethod === 'Delivery' ? selectedZone.price : 0;
  const total = subtotal + shippingCost;

  useEffect(() => {
    if (isOpen) {
      setStep(Step.FORM);
      setIsSubmitting(false);
      setTransactionRef('');
    }
  }, [isOpen]);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || isSubmitting) return;
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      setStep(Step.INITIATING);
      setIsSubmitting(false);

      const ref = `TFC-${Math.floor(Math.random() * 1000000)}`;
      setTransactionRef(ref);

      setTimeout(() => {
        setStep(Step.PENDING_USSD);
        setTimeout(() => {
          setStep(Step.PROCESSING);
          setTimeout(() => {
             finalizeOrder(ref);
          }, 3000);
        }, 5000);
      }, 2000);
    }, 600);
  };

  const finalizeOrder = async (ref: string) => {
    const newOrder: Order = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      items: [...cart], 
      total: total,
      transactionRef: ref,
      paymentMethod: `${network} Mobile Money`,
      status: 'Completed',
      customerEmail: email,
      customerPhone: phone,
      deliveryMethod: deliveryMethod,
      deliveryZone: deliveryMethod === 'Delivery' ? selectedZone.name : undefined,
      shippingCost: shippingCost
    };
    setStep(Step.SUCCESS);
    onOrderComplete(newOrder);
    clearCart();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-stone-50 px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <ShieldCheck size={18} className="text-green-700"/>
            <h2 className="text-lg font-serif">Secure Checkout</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-black"><X size={20} /></button>
        </div>

        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
          {step === Step.FORM && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={() => setDeliveryMethod('Delivery')} className={`flex flex-col items-center justify-center p-4 border rounded-sm transition-all ${deliveryMethod === 'Delivery' ? 'border-black bg-stone-50 text-black ring-1 ring-black' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                  <Truck size={24} className="mb-2" strokeWidth={1.5} />
                  <span className="text-xs uppercase tracking-widest font-bold">Delivery</span>
                </button>
                <button type="button" onClick={() => setDeliveryMethod('Collection')} className={`flex flex-col items-center justify-center p-4 border rounded-sm transition-all ${deliveryMethod === 'Collection' ? 'border-black bg-stone-50 text-black ring-1 ring-black' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                  <MapPin size={24} className="mb-2" strokeWidth={1.5} />
                  <span className="text-xs uppercase tracking-widest font-bold">Collection</span>
                </button>
              </div>

              <div className="bg-gray-50 p-4 rounded-sm border border-gray-100 space-y-2">
                 <div className="flex justify-between text-xs text-gray-500"><span>Subtotal</span><span>{CURRENCY} {subtotal.toFixed(2)}</span></div>
                 <div className="flex justify-between items-end pt-1"><span className="text-xs uppercase tracking-widest text-black font-bold">Total</span><span className="text-2xl font-serif text-black leading-none">{CURRENCY} {total.toFixed(2)}</span></div>
              </div>

              <form onSubmit={handlePay} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5">Full Name</label>
                     <input required type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border border-gray-300 px-3 py-3 text-sm focus:border-black focus:outline-none" />
                  </div>
                  <div>
                     <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5">Email</label>
                     <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 px-3 py-3 text-sm focus:border-black focus:outline-none" />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h3 className="font-serif text-lg mb-4 flex items-center"><Smartphone className="mr-2 h-5 w-5" /> Mobile Money</h3>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5">Mobile Number</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">+260</span>
                      <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="block w-full border border-gray-300 px-3 py-3 text-sm focus:border-black focus:outline-none" placeholder="97 1234567" />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`w-full py-4 font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center space-x-2 ${isSubmitting ? 'bg-stone-800 text-stone-400 cursor-not-allowed' : 'bg-green-700 hover:bg-green-800 text-white'}`}
                  >
                     {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                     <span>{isSubmitting ? 'Processing...' : `Pay ${CURRENCY} ${total.toFixed(2)}`}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === Step.INITIATING && (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-6 animate-fade-in">
               <Loader2 className="h-12 w-12 text-stone-400 animate-spin" />
               <p className="font-serif text-lg">Connecting to Kazang...</p>
            </div>
          )}

          {step === Step.PENDING_USSD && (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-6 animate-fade-in">
              <div className="relative">
                <div className="h-20 w-20 rounded-full border-4 border-gray-100 border-t-green-600 animate-spin"></div>
                <Smartphone className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400" size={32} />
              </div>
              <h3 className="text-xl font-serif mb-2">Check your phone</h3>
            </div>
          )}

          {step === Step.PROCESSING && (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-6 animate-fade-in">
               <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
               <p className="font-serif text-lg">Finalizing Transaction...</p>
            </div>
          )}

          {step === Step.SUCCESS && (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-6 animate-scale-in">
              <div className="h-20 w-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-2"><CheckCircle size={40} strokeWidth={1.5} /></div>
              <h3 className="text-2xl font-serif mb-2">Order Confirmed!</h3>
              <button onClick={onClose} className="px-8 py-3 bg-black text-white text-xs uppercase tracking-widest">Continue Shopping</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
