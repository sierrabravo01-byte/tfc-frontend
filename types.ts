export interface Vendor {
  id: string;
  name: string;
  location: string;
  email?: string; // Email for order notifications
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // In Zambian Kwacha (ZMW)
  category: string;
  image: string;
  vendor: Vendor;
  tags: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  price: number;
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

export interface UserDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}

export enum CheckoutStep {
  CART = 'CART',
  DETAILS = 'DETAILS',
  PAYMENT = 'PAYMENT',
  SUCCESS = 'SUCCESS'
}
