import React, { useState, useEffect } from 'react';
import { X, Smartphone, CheckCircle, ShieldCheck, Loader2, SearchCheck, Lock, Truck, MapPin } from 'lucide-react';
import { CartItem, Order, DeliveryZone } from '../types';
import { CURRENCY, KAZANG_PRODUCT_IDS, KAZANG_CONFIG, BACKEND_API_URL, DELIVERY_ZONES, PICKUP_ADDRESS } from '../constants';

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
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState<Provider>('Airtel'); 
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('Delivery');
  const [selectedZone, setSelectedZone] = useState<DeliveryZone>(DELIVERY_ZONES[0]);
  const [transactionRef, setTransactionRef] = useState('');
  
  // Calculate Totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = deliveryMethod === 'Delivery' ? selectedZone.price : 0;
  const total = subtotal + shippingCost;

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStep(Step.FORM);
      setTransactionRef('');
    }
  }, [isOpen]);

  const dispatchDeliveryPartner = (order: Order) => {
    // This function simulates what the BACKEND would do.
    // In production, the frontend does NOT call Yango/Delivery APIs directly (to protect API Keys).
    // Instead, the backend sees the new order and calls the delivery partner.
    
    console.group("🚚 Dispatching Delivery Partner (Yango Simulation)");
    console.log(`[Backend] Connecting to Delivery Provider API...`);
    console.log(`[Backend] POST /v1/delivery/create-claim`);
    console.log(`[Backend] Payload: {
       pickup: "${PICKUP_ADDRESS}",
       dropoff: "${order.deliveryMethod === 'Delivery' ? address + ', ' + selectedZone.name : 'N/A'}",
       customer_phone: "${order.customerPhone}",
       items: ${order.items.length}
    }`);
    console.log(`[Success] Driver Assigned! Tracking URL: https://yango.delivery/track/tfc-${order.id}`);
    console.groupEnd();
  };

  const finalizeOrder = async (ref: string) => {
    // Construct the new order object
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

    // Trigger Notification Backend
    try {
      console.log(`[Notification] Connecting to backend at ${BACKEND_API_URL}...`);
      
      fetch(`${BACKEND_API_URL}/api/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order: newOrder,
          customer: {
            name: fullName,
            email: email,
            phone: phone,
            address: deliveryMethod === 'Delivery' ? `${address} (${selectedZone.name})` : 'Collection'
          }
        }),
      }).then(response => {
        if (response.ok) {
          console.log("[Notification] Emails sent successfully via Backend.");
        } else {
          console.warn("[Notification] Backend returned error status.");
        }
      }).catch(err => {
        console.warn("[Notification] Could not reach backend.", err);
      });

    } catch (e) {
      console.error("Error triggering backend notifications", e);
    }
    
    // Simulate dispatching the rider if it's a delivery
    if (deliveryMethod === 'Delivery') {
      dispatchDeliveryPartner(newOrder);
    }

    setStep(Step.SUCCESS);
    onOrderComplete(newOrder);
    clearCart();
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    
    // Step 1: Initiate Payment
    setStep(Step.INITIATING);
    
    // Generate a simulated transaction reference
    const ref = `TFC-${Math.floor(Math.random() * 1000000)}`;
    setTransactionRef(ref);

    // KAZANG API SIMULATION
    let initiationProductId = 0;
    let initiationEndpoint = '';
    let confirmEndpoint = '';

    if (network === 'Airtel') {
      initiationProductId = KAZANG_PRODUCT_IDS.airtelPayPayment;
      initiationEndpoint = 'airtelPayPayment';
      confirmEndpoint = 'airtelPayPaymentConfirm';
    } else if (network === 'MTN') {
      initiationProductId = KAZANG_PRODUCT_IDS.mtnDebit;
      initiationEndpoint = 'mtnDebit';
      confirmEndpoint = 'mtnDebitApproval';
    } else {
      initiationProductId = KAZANG_PRODUCT_IDS.zamtelMoneyPay;
      initiationEndpoint = 'zamtelMoneyPay';
      confirmEndpoint = 'zamtelMoneyPayConfirm';
    }

    console.group("Kazang Payment Flow");
    console.log(`[Auth] Authenticating as ${KAZANG_CONFIG.username}...`);
    console.log(`[Step 1] POST /${initiationEndpoint} (Product ID: ${initiationProductId})`);
    console.log(`[Step 1] Payload: { amount: "${total * 100}", wallet_msisdn: "${phone}" }`);

    setTimeout(() => {
      console.log(`[Step 1] Success. Received Confirmation Number.`);
      setStep(Step.PENDING_USSD);
      
      setTimeout(() => {
        setStep(Step.PROCESSING);

        console.log(`[System] Processing Order Notifications...`);
        
        setTimeout(() => {
           console.log(`[Success] Payment Complete. Transaction Ref: ${ref}`);
           console.groupEnd();
           finalizeOrder(ref);
        }, 3000);

      }, 5000);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-stone-50 px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <ShieldCheck size={18} className="text-green-700"/>
            <h2 className="text-lg font-serif">Secure Checkout</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
          {step === Step.FORM && (
            <div className="space-y-6">
              
              {/* Delivery Method Toggle */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('Delivery')}
                  className={`flex flex-col items-center justify-center p-4 border rounded-sm transition-all ${
                    deliveryMethod === 'Delivery' 
                    ? 'border-black bg-stone-50 text-black ring-1 ring-black' 
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <Truck size={24} className="mb-2" strokeWidth={1.5} />
                  <span className="text-xs uppercase tracking-widest font-bold">Delivery</span>
                  <span className="text-[10px] text-gray-400 mt-1">Via Partner (Yango/Similar)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('Collection')}
                  className={`flex flex-col items-center justify-center p-4 border rounded-sm transition-all ${
                    deliveryMethod === 'Collection' 
                    ? 'border-black bg-stone-50 text-black ring-1 ring-black' 
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <MapPin size={24} className="mb-2" strokeWidth={1.5} />
                  <span className="text-xs uppercase tracking-widest font-bold">Collection</span>
                  <span className="text-[10px] text-gray-400 mt-1">Free Pickup</span>
                </button>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-sm border border-gray-100 space-y-2">
                 <div className="flex justify-between text-xs text-gray-500">
                   <span>Subtotal</span>
                   <span>{CURRENCY} {subtotal.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-xs text-gray-500 border-b border-gray-200 pb-2">
                   <span>Shipping ({deliveryMethod})</span>
                   <span>{shippingCost === 0 ? 'FREE' : `${CURRENCY} ${shippingCost.toFixed(2)}`}</span>
                 </div>
                 <div className="flex justify-between items-end pt-1">
                    <span className="text-xs uppercase tracking-widest text-black font-bold">Total</span>
                    <span className="text-2xl font-serif text-black leading-none">{CURRENCY} {total.toFixed(2)}</span>
                 </div>
              </div>

              {/* Payment Form */}
              <form onSubmit={handlePay} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5">Full Name</label>
                     <input 
                      required 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full border border-gray-300 px-3 py-3 text-sm focus:border-black focus:outline-none rounded-none" 
                     />
                  </div>
                  <div>
                     <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5">Email</label>
                     <input 
                      required 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-300 px-3 py-3 text-sm focus:border-black focus:outline-none rounded-none" 
                     />
                  </div>
                </div>

                {deliveryMethod === 'Delivery' ? (
                  <div className="space-y-4">
                     <div>
                       <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5">Select Delivery Zone</label>
                       <select
                        value={selectedZone.id}
                        onChange={(e) => {
                          const zone = DELIVERY_ZONES.find(z => z.id === e.target.value);
                          if (zone) setSelectedZone(zone);
                        }}
                        className="w-full border border-gray-300 px-3 py-3 text-sm focus:border-black focus:outline-none rounded-none bg-white"
                       >
                         {DELIVERY_ZONES.map(zone => (
                           <option key={zone.id} value={zone.id}>
                             {zone.name} - {CURRENCY} {zone.price}
                           </option>
                         ))}
                       </select>
                     </div>
                     <div>
                       <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5">Specific Address Details</label>
                       <textarea 
                        required 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={2} 
                        className="w-full border border-gray-300 px-3 py-3 text-sm focus:border-black focus:outline-none rounded-none" 
                        placeholder="House Number, Street Name, Landmarks..." 
                       />
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-sm">
                    <p className="text-xs font-bold text-yellow-800 uppercase tracking-widest mb-1">Collection Point</p>
                    <p className="text-sm text-yellow-900">{PICKUP_ADDRESS}</p>
                    <p className="text-[10px] text-yellow-700 mt-2">Available for pickup: Mon-Fri, 08:00 - 17:00</p>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="font-serif text-lg mb-4 flex items-center">
                    <Smartphone className="mr-2 h-5 w-5" /> 
                    Mobile Money Payment
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {(['Airtel', 'MTN', 'Zamtel'] as Provider[]).map((net) => (
                      <button 
                        key={net}
                        type="button"
                        onClick={() => setNetwork(net)}
                        className={`py-3 text-xs font-bold border transition-colors ${network === net ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
                      >
                        {net}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5">Mobile Number</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        +260
                      </span>
                      <input 
                        type="tel" 
                        required 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="block w-full border border-gray-300 px-3 py-3 text-sm focus:border-black focus:outline-none rounded-none" 
                        placeholder="97 1234567" 
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white py-4 font-bold text-sm uppercase tracking-widest transition-colors flex items-center justify-center space-x-2">
                     <Lock size={16} />
                     <span>Pay {CURRENCY} {total.toFixed(2)}</span>
                  </button>
                  <p className="text-[10px] text-center text-gray-400 mt-3">
                    Secure Payment • Delivery by Partner
                  </p>
                </div>
              </form>
            </div>
          )}

          {step === Step.INITIATING && (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-6 animate-fade-in">
               <Loader2 className="h-12 w-12 text-stone-400 animate-spin" />
               <p className="font-serif text-lg">Connecting to Kazang...</p>
               <p className="text-xs text-gray-500">Initiating {network} payment request</p>
            </div>
          )}

          {step === Step.PENDING_USSD && (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-6 animate-fade-in">
              <div className="relative">
                <div className="h-20 w-20 rounded-full border-4 border-gray-100 border-t-green-600 animate-spin"></div>
                <Smartphone className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400" size={32} />
              </div>
              <div>
                <h3 className="text-xl font-serif mb-2">Check your phone</h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">
                  Payment prompt sent to <strong>+260 {phone}</strong>
                </p>
                <div className="bg-yellow-50 border border-yellow-100 p-3 mt-4 text-xs text-yellow-800 rounded">
                  Enter PIN on mobile to authorize {CURRENCY} {total.toFixed(2)}
                </div>
              </div>
            </div>
          )}

          {step === Step.PROCESSING && (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-6 animate-fade-in">
               <div className="relative">
                 <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                 <SearchCheck className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-700" size={16}/>
               </div>
               <div>
                 <p className="font-serif text-lg">Finalizing Transaction...</p>
                 <p className="text-[10px] text-gray-400 mt-4 animate-pulse">Assigning Delivery Partner...</p>
               </div>
            </div>
          )}

          {step === Step.SUCCESS && (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-6 animate-scale-in">
              <div className="h-20 w-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-2">
                <CheckCircle size={40} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-2xl font-serif mb-2">Order Confirmed!</h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto mb-2">
                  Thank you for supporting Zambian artisans.
                </p>
                
                {deliveryMethod === 'Collection' ? (
                  <div className="bg-yellow-50 border border-yellow-100 p-3 mb-6 rounded text-xs text-yellow-800 text-left">
                    <p className="font-bold mb-1">Ready for Collection at:</p>
                    <p>{PICKUP_ADDRESS}</p>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-100 p-3 mb-6 rounded text-xs text-blue-800 text-left">
                    <p className="font-bold mb-1">Delivery Scheduled:</p>
                    <p>Zone: {selectedZone.name}</p>
                    <p className="italic mt-1">You will receive a rider tracking link shortly.</p>
                  </div>
                )}

                <div className="bg-gray-50 p-3 mb-6 text-xs text-gray-500">
                  Transaction ID: {transactionRef}
                </div>
                <button 
                  onClick={onClose}
                  className="px-8 py-3 bg-black text-white text-xs uppercase tracking-widest hover:bg-gray-800"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
