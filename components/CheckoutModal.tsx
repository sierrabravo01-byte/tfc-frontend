import React, { useState, useEffect } from 'react';
import { X, Smartphone, CheckCircle, ShieldCheck, Loader2, SearchCheck, Lock } from 'lucide-react';
import { CartItem, Order } from '../types';
import { CURRENCY, KAZANG_PRODUCT_IDS, KAZANG_CONFIG, BACKEND_API_URL } from '../constants';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  clearCart: () => void;
  onOrderComplete: (order: Order) => void;
}

// Checkout Steps
// 1. Submit Data (Form)
// 2. Initiating (API Request to Kazang)
// 3. Pending USSD (User interaction on phone)
// 4. Processing/Querying (Finalizing transaction)
// 5. Success
enum Step {
  FORM = 0,
  INITIATING = 1,
  PENDING_USSD = 2,
  PROCESSING = 3,
  SUCCESS = 4
}

type Provider = 'Airtel' | 'MTN' | 'Zamtel';

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, cart, clearCart, onOrderComplete }) => {
  const [step, setStep] = useState<Step>(Step.FORM);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [network, setNetwork] = useState<Provider>('Airtel'); 
  const [transactionRef, setTransactionRef] = useState('');
  
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStep(Step.FORM);
      setTransactionRef('');
    }
  }, [isOpen]);

  const finalizeOrder = async (ref: string) => {
    // Construct the new order object
    const newOrder: Order = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      items: [...cart], // Snapshot of current cart
      total: total,
      transactionRef: ref,
      paymentMethod: `${network} Mobile Money`,
      status: 'Completed',
      customerEmail: email,
      customerPhone: phone
    };

    // Trigger Notification Backend (Fire and Forget)
    try {
      console.log(`[Notification] Connecting to backend at ${BACKEND_API_URL}...`);
      
      // We don't await this if we want the UI to be snappy, but for a prototype 
      // let's log the result to ensure it works.
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
            phone: phone
          }
        }),
      }).then(response => {
        if (response.ok) {
          console.log("[Notification] Emails sent successfully via Backend.");
        } else {
          console.warn("[Notification] Backend returned error status.");
        }
      }).catch(err => {
        console.warn("[Notification] Could not reach backend (Is it running?).", err);
      });

    } catch (e) {
      console.error("Error triggering backend notifications", e);
    }

    setStep(Step.SUCCESS);
    // Save order locally and clear cart
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
    // This logic mimics the Postman script flow
    
    let initiationProductId = 0;
    let initiationEndpoint = '';
    let confirmEndpoint = '';

    if (network === 'Airtel') {
      initiationProductId = KAZANG_PRODUCT_IDS.airtelPayPayment; // 1663
      initiationEndpoint = 'airtelPayPayment';
      confirmEndpoint = 'airtelPayPaymentConfirm';
    } else if (network === 'MTN') {
      initiationProductId = KAZANG_PRODUCT_IDS.mtnDebit; // 1612
      initiationEndpoint = 'mtnDebit';
      confirmEndpoint = 'mtnDebitApproval (Step 1)'; // MTN uses DebitApproval as the second main phase
    } else {
      initiationProductId = KAZANG_PRODUCT_IDS.zamtelMoneyPay; // 1706
      initiationEndpoint = 'zamtelMoneyPay';
      confirmEndpoint = 'zamtelMoneyPayConfirm';
    }

    console.group("Kazang Payment Flow");
    console.log(`[Auth] Authenticating as ${KAZANG_CONFIG.username}...`);
    console.log(`[Step 1] POST /${initiationEndpoint} (Product ID: ${initiationProductId})`);
    console.log(`[Step 1] Payload: { amount: "${total * 100}", wallet_msisdn: "${phone}" }`);

    // Simulate Network latency for Kazang API request (Step 1)
    setTimeout(() => {
      console.log(`[Step 1] Success. Received Confirmation Number.`);
      
      // Transition to "Pending" - Waiting for user to approve USSD push
      setStep(Step.PENDING_USSD);
      
      if (network === 'Airtel') {
         console.log(`[Step 2] POST /${confirmEndpoint} (User Confirmed Details)`);
      } else if (network === 'Zamtel') {
         console.log(`[Step 2] POST /${confirmEndpoint} (User Confirmed Details)`);
      }
      
      // Simulate User taking time to approve on phone (e.g. 5 seconds)
      setTimeout(() => {
        
        // Step 3: Verification/Finalization
        setStep(Step.PROCESSING);

        // Provider specific finalization logic based on Postman Script
        if (network === 'Airtel') {
           // Airtel requires the Query Flow
           console.log(`[Step 3] Airtel Query Flow Initiated`);
           console.log(`[Step 3a] POST /airtelPayQuery (Product ID: ${KAZANG_PRODUCT_IDS.airtelPayQuery})`);
           console.log(`[Step 3b] POST /airtelPayQueryConfirm`);
        } else if (network === 'MTN') {
           // MTN requires Debit Approval
           console.log(`[Step 2] POST /mtnDebitApproval (Product ID: ${KAZANG_PRODUCT_IDS.mtnDebitApproval})`);
           console.log(`[Step 3] POST /mtnDebitApprovalConfirm`);
        } else {
           console.log(`[Final] Transaction Finalized on Zamtel.`);
        }

        // Simulate Notification Delay (processing order)
        console.log(`[System] Processing Order Notifications...`);
        
        // Simulate Final API latency
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
      {/* Backdrop */}
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
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
              {/* Order Summary Summary */}
              <div className="bg-gray-50 p-4 rounded-sm border border-gray-100">
                 <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Order Total</p>
                 <p className="text-3xl font-serif text-black">{CURRENCY} {total.toFixed(2)}</p>
                 <p className="text-xs text-gray-500 mt-1">{cart.length} items from The Food Collective</p>
              </div>

              {/* Payment Form */}
              <form onSubmit={handlePay} className="space-y-5">
                <div>
                   <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5">Full Name</label>
                   <input 
                    required 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border border-gray-300 px-3 py-3 text-sm focus:border-black focus:outline-none rounded-none" 
                    placeholder="Enter your name" 
                   />
                </div>
                <div>
                   <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5">Email Address</label>
                   <input 
                    required 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 px-3 py-3 text-sm focus:border-black focus:outline-none rounded-none" 
                    placeholder="For receipt and confirmations" 
                   />
                </div>
                <div>
                   <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1.5">Delivery Address</label>
                   <textarea required rows={2} className="w-full border border-gray-300 px-3 py-3 text-sm focus:border-black focus:outline-none rounded-none" placeholder="Street, Area, City" />
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="font-serif text-lg mb-4 flex items-center">
                    <Smartphone className="mr-2 h-5 w-5" /> 
                    Mobile Money Payment
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">
                    Select your network provider. We support Airtel Pay, MTN MoMo, and Zamtel.
                  </p>
                  
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
                     <span>Pay with Kazang</span>
                  </button>
                  <p className="text-[10px] text-center text-gray-400 mt-3">
                    Powered by Kazang • Encrypted & Secure
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
                  We've sent a payment prompt to <strong>+260 {phone}</strong> on {network}.
                </p>
                <div className="bg-yellow-50 border border-yellow-100 p-3 mt-4 text-xs text-yellow-800 rounded">
                  Please enter your PIN on your mobile device to authorize the transaction.
                </div>
                <p className="text-[10px] text-gray-400 mt-4">Ref: {transactionRef}</p>
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
                 <p className="font-serif text-lg">
                    {network === 'Airtel' ? 'Verifying Payment...' : 'Finalizing Transaction...'}
                 </p>
                 <p className="text-xs text-gray-500 mt-2">
                   {network === 'Airtel' ? 'Querying Airtel Pay status' : `Confirming ${network} approval`}
                 </p>
                 <p className="text-[10px] text-gray-400 mt-4 animate-pulse">Notifying Vendors...</p>
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
                  Thank you for supporting Zambian artisans. Your payment via Kazang was successful.
                </p>
                
                {email && (
                  <div className="bg-blue-50 border border-blue-100 p-3 mb-6 rounded text-xs text-blue-800">
                    <p className="font-bold mb-1">Confirmation Sent</p>
                    <p>Email: {email}</p>
                    {phone && <p>SMS: +260 {phone}</p>}
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