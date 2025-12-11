import React, { useState, useEffect, useMemo, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderHistoryDrawer from './components/OrderHistoryDrawer';
import MenuDrawer from './components/MenuDrawer';
import { PRODUCTS, CATEGORIES, BACKEND_API_URL } from './constants';
import { Product, CartItem, Order } from './types';
import { searchProducts } from './utils/search';
import { Store } from 'lucide-react';

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedVendor, setSelectedVendor] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Refs for scrolling
  const shopSectionRef = useRef<HTMLDivElement>(null);

  // Derive Unique Vendors from Product List
  const vendors = useMemo(() => {
    const uniqueMap = new Map();
    PRODUCTS.forEach(p => {
      uniqueMap.set(p.vendor.id, p.vendor);
    });
    return Array.from(uniqueMap.values());
  }, []);

  // Load orders from local storage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('tfc_orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        console.error("Failed to parse orders", e);
      }
    }

    // WAKE UP RENDER SERVER
    fetch(`${BACKEND_API_URL}/`)
      .then(() => console.log("Backend warming up..."))
      .catch(() => console.log("Backend warm-up signal sent"));

  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  const handleOrderComplete = (newOrder: Order) => {
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('tfc_orders', JSON.stringify(updatedOrders));
  };

  const scrollToShop = () => {
    shopSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Use the search utility with Vendor filtering
  const filteredProducts = searchProducts(PRODUCTS, searchQuery, selectedCategory, selectedVendor);

  return (
    <div className="min-h-screen bg-white">
      <Header 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
        onCartClick={() => setIsCartOpen(true)}
        onHistoryClick={() => setIsHistoryOpen(true)}
        onMenuClick={() => setIsMenuOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <Hero onShopClick={scrollToShop} />

      {/* Filters Section - Attached Ref here for scrolling */}
      <div ref={shopSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-8 space-y-8">
        
        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-6 border-b border-gray-100 pb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
              }}
              className={`text-sm uppercase tracking-widest pb-1 transition-colors ${
                selectedCategory === cat 
                  ? "border-b-2 border-black text-black" 
                  : "text-gray-400 hover:text-black"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Vendors / Artisans Filter */}
        <div className="flex flex-col items-center space-y-3">
          <div className="flex items-center space-x-2 text-gray-400 text-xs uppercase tracking-widest">
            <Store size={14} />
            <span>Filter by Artisan</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedVendor("All")}
              className={`px-4 py-2 rounded-full text-xs font-serif transition-all border ${
                selectedVendor === "All"
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              All Artisans
            </button>
            {vendors.map((vendor) => (
              <button
                key={vendor.id}
                onClick={() => setSelectedVendor(vendor.id)}
                className={`px-4 py-2 rounded-full text-xs font-serif transition-all border ${
                  selectedVendor === vendor.id
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                {vendor.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 mt-8">
        {(searchQuery || selectedCategory !== "All" || selectedVendor !== "All") && (
          <div className="mb-8 text-center space-y-1">
            <p className="text-gray-500 font-serif italic">
              {searchQuery ? (
                <>Showing results for "<span className="text-black not-italic">{searchQuery}</span>"</>
              ) : (
                "Showing products"
              )}
            </p>
            <div className="text-xs text-gray-400 flex justify-center gap-2">
               {selectedCategory !== "All" && <span className="bg-gray-100 px-2 py-1 rounded">{selectedCategory}</span>}
               {selectedVendor !== "All" && <span className="bg-gray-100 px-2 py-1 rounded">Vendor: {vendors.find(v => v.id === selectedVendor)?.name}</span>}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAdd={addToCart} 
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-24">
            <p className="text-gray-400 font-serif italic text-lg">
              No products found matching your criteria.
            </p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedVendor("All");
              }}
              className="mt-4 text-xs uppercase tracking-widest border-b border-gray-400 text-gray-600 hover:text-black hover:border-black"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-stone-100 py-16">
         <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-serif mb-4 uppercase">The Food Collective</h2>
            <div className="flex justify-center space-x-6 mb-8 text-xs uppercase tracking-widest text-gray-500">
               <a href="#" className="hover:text-black">About Us</a>
               <a href="#" className="hover:text-black">Our Artisans</a>
               <a href="#" className="hover:text-black">Sustainability</a>
               <a href="#" className="hover:text-black">Contact</a>
            </div>
            <p className="text-xs text-gray-400">© 2024 The Food Collective. All rights reserved. <br/> Supporting local Zambian commerce.</p>
         </div>
      </footer>

      {/* Overlays */}
      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        updateQuantity={updateQuantity}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        clearCart={clearCart}
        onOrderComplete={handleOrderComplete}
      />

      <OrderHistoryDrawer 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        orders={orders}
      />
    </div>
  );
}

export default App;
