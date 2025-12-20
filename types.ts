export interface Vendor {
  id: string;
  name: string;
  location: string;
  email?: string;
  story?: string; // New: Story about the artisan
}

export interface Product {
  id: string;
  name: string;
  description: string;
  details?: string; // New: Longer artisanal details
  price: number; 
  category: string;
  image: string;
  vendor: Vendor;
  tags: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  transactionRef: string;
  paymentMethod: string;
  status: 'Completed' | 'Pending' | 'Failed';
  customerEmail?: string;
  customerPhone?: string;
  deliveryMethod: 'Delivery' | 'Collection';
  deliveryZone?: string; 
  shippingCost: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  price: number;
}
