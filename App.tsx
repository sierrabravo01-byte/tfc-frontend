import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderHistoryDrawer from './components/OrderHistoryDrawer';
import { PRODUCTS, CATEGORIES, BACKEND_API_URL } from './constants';
import { Product, CartItem, Order } from './types';
import { searchProducts } from './utils/search';

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

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
    // Render Free Tier spins down after 15 mins of inactivity.
    // We ping it when the app loads so it's ready by the time the user checks out.
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

  // Use the new fuzzy search utility
  const filteredProducts = searchProducts(PRODUCTS, searchQuery, selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      <Header 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
        onCartClick={() => setIsCartOpen(true)}
        onHistoryClick={() => setIsHistoryOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <Hero />

      {/* Categories Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-8">
        <div className="flex flex-wrap justify-center gap-6 border-b border-gray-100 pb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSearchQuery(""); 
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
      </div>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {searchQuery && (
          <div className="mb-8 text-center">
            <p className="text-gray-500 font-serif italic">
              Showing results for "<span className="text-black not-italic">{searchQuery}</span>"
            </p>
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
              {searchQuery 
                ? `No products found matching "${searchQuery}"`
                : "No products found in this category."}
            </p>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="mt-4 text-xs uppercase tracking-widest border-b border-gray-400 text-gray-600 hover:text-black hover:border-black"
              >
                Clear Search
              </button>
            )}
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
