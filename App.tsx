import React, { useState, useEffect, useMemo, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderHistoryDrawer from './components/OrderHistoryDrawer';
import MenuDrawer from './components/MenuDrawer';
import ComplianceModal from './components/ComplianceModal';
import { PRODUCTS, CATEGORIES, BACKEND_API_URL } from './constants';
import { Product, CartItem, Order } from './types';
import { searchProducts } from './utils/search';
import { Store, Wifi, WifiOff, Loader2 } from 'lucide-react';

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isComplianceOpen, setIsComplianceOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedVendor, setSelectedVendor] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const shopSectionRef = useRef<HTMLDivElement>(null);

  const vendors = useMemo(() => {
    const uniqueMap = new Map();
    PRODUCTS.forEach(p => uniqueMap.set(p.vendor.id, p.vendor));
    return Array.from(uniqueMap.values());
  }, []);

  useEffect(() => {
    const savedOrders = localStorage.getItem('tfc_orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));

    setBackendStatus('checking');
    fetch(`${BACKEND_API_URL}/`).then(res => setBackendStatus(res.ok ? 'online' : 'offline')).catch(() => setBackendStatus('offline'));
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => prev.map((item) => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter((item) => item.quantity > 0));
  };

  const handleOrderComplete = (newOrder: Order) => {
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('tfc_orders', JSON.stringify(updatedOrders));
  };

  const filteredProducts = searchProducts(PRODUCTS, searchQuery, selectedCategory, selectedVendor);

  return (
    <div className="min-h-screen bg-white">
      <Header cartCount={cart.reduce((a, b) => a + b.quantity, 0)} onCartClick={() => setIsCartOpen(true)} onHistoryClick={() => setIsHistoryOpen(true)} onMenuClick={() => setIsMenuOpen(true)} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <Hero onShopClick={() => shopSectionRef.current?.scrollIntoView({ behavior: 'smooth' })} />

      <div ref={shopSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-8">
        <div className="flex flex-wrap justify-center gap-6 border-b border-gray-100 pb-6">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`text-sm uppercase tracking-widest pb-1 ${selectedCategory === cat ? "border-b-2 border-black text-black" : "text-gray-400 hover:text-black"}`}>{cat}</button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {filteredProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={addToCart} />)}
        </div>
      </main>

      <footer className="bg-stone-100 py-16">
         <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-serif mb-4 uppercase">The Food Collective</h2>
            <div className="flex justify-center space-x-6 mb-8 text-xs uppercase tracking-widest text-gray-500">
               <button onClick={() => setIsMenuOpen(true)} className="hover:text-black">About Us</button>
               <button onClick={() => setIsComplianceOpen(true)} className="hover:text-black">Trust & Security</button>
               <button onClick={() => setIsComplianceOpen(true)} className="hover:text-black">Sub-processors</button>
               <a href="mailto:ninagibs@gmail.com" className="hover:text-black">Contact</a>
            </div>
            <p className="text-xs text-gray-400">© 2024 The Food Collective. All rights reserved.</p>
         </div>
      </footer>

      <MenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} updateQuantity={updateQuantity} onCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} cart={cart} clearCart={() => setCart([])} onOrderComplete={handleOrderComplete} />
      <OrderHistoryDrawer isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} orders={orders} />
      <ComplianceModal isOpen={isComplianceOpen} onClose={() => setIsComplianceOpen(false)} />
    </div>
  );
}

export default App;
