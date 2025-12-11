import { Product, Vendor, DeliveryZone } from './types';

export const CURRENCY = "ZMW";

// REPLACE THIS WITH YOUR RENDER URL AFTER DEPLOYMENT
export const BACKEND_API_URL = "https://tfc-backend-4eo9.onrender.com"; 

export const PICKUP_ADDRESS = "The Food Collective HQ, 45 Leopards Hill Road, Lusaka";

// Mock Delivery Zones
export const DELIVERY_ZONES: DeliveryZone[] = [
  { id: 'zone_1', name: 'Lusaka Central (CBD, Rhodes Park)', price: 45 },
  { id: 'zone_2', name: 'Inner Suburbs (Woodlands, Kabulonga)', price: 60 },
  { id: 'zone_3', name: 'Outer Suburbs (Makeni, Avondale)', price: 95 },
  { id: 'zone_4', name: 'Outskirts (Chilanga, Chongwe)', price: 150 },
];

// Address Suggestions mapped to Zones
export const ZONE_LANDMARKS: Record<string, string[]> = {
  'zone_1': ['Manda Hill Mall', 'Levy Junction', 'Cairo Road', 'Rhodes Park School', 'Addis Ababa Drive', 'Fairview Hospital'],
  'zone_2': ['Woodlands Shopping Mall', 'Kabulonga Centro', 'Lewanika Mall', 'Crossroads Shopping Centre', 'Ibex Hill', 'State House Area'],
  'zone_3': ['Twin Palm Mall', 'Avondale Shopping Centre', 'Makeni Mall', 'Cosmopolitan Mall', 'Chalala', 'Chelston'],
  'zone_4': ['Chilanga Golf Club', 'Sandy\'s Creations', 'Garden City Mall', 'KKIA Airport', 'Chongwe Town'],
};

export const KAZANG_CONFIG = {
  host: "https://testapi.kazang.net",
  channel: "TheFoodCollectiveZAM",
  username: "1000637586",
  password: "82551972"
};

export const KAZANG_PRODUCT_IDS = {
  // Airtel Pay
  airtelPayPayment: 1663,
  airtelPayQuery: 1664,
  
  // MTN MoMo
  mtnDebit: 1612,
  mtnDebitApproval: 1613,
  
  // Zamtel Money
  zamtelMoneyPay: 1706
};

const mainVendor: Vendor = {
  id: "v1",
  name: "The Food Collective",
  location: "Lusaka, Zambia"
};

const guestVendor: Vendor = {
  id: "v2",
  name: "Mama Tembo's Spices",
  location: "Livingstone, Zambia"
};

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Wild Zambezi Honey",
    description: "Pure, organic honey harvested from the Miombo woodlands. Dark, rich, and full of antioxidants.",
    price: 150,
    category: "Pantry",
    image: "https://picsum.photos/id/312/800/800",
    vendor: mainVendor,
    tags: ["organic", "honey", "breakfast"]
  },
  {
    id: "2",
    name: "Moringa Infused Oil",
    description: "Cold-pressed olive oil infused with locally grown Moringa leaves. A nutritional powerhouse for your salads.",
    price: 220,
    category: "Oils",
    image: "https://picsum.photos/id/292/800/800",
    vendor: mainVendor,
    tags: ["oil", "health", "cooking"]
  },
  {
    id: "3",
    name: "Spicy Mango Chutney",
    description: "A perfect blend of sweet ripe mangoes and fiery Zambian bird's eye chillies. Handmade in small batches.",
    price: 85,
    category: "Preserves",
    image: "https://picsum.photos/id/102/800/800",
    vendor: guestVendor,
    tags: ["spicy", "condiment", "vegan"]
  },
  {
    id: "4",
    name: "Baobab Fruit Powder",
    description: "Superfruit powder rich in Vitamin C and fiber. Add to smoothies or porridge for a tangy citrus boost.",
    price: 120,
    category: "Health",
    image: "https://picsum.photos/id/514/800/800",
    vendor: mainVendor,
    tags: ["superfood", "powder", "baking"]
  },
  {
    id: "5",
    name: "Artisanal Sourdough",
    description: "Slow-fermented rustic loaf with a crispy crust and chewy interior. Baked fresh daily.",
    price: 60,
    category: "Bakery",
    image: "https://picsum.photos/id/999/800/800",
    vendor: mainVendor,
    tags: ["bread", "fresh", "bakery"]
  },
  {
    id: "6",
    name: "Livingstone Roast Coffee",
    description: "Single-origin Arabica beans roasted to perfection. Notes of dark chocolate and citrus.",
    price: 180,
    category: "Beverages",
    image: "https://picsum.photos/id/425/800/800",
    vendor: guestVendor,
    tags: ["coffee", "drinks", "morning"]
  },
  {
    id: "7",
    name: "Marula Nut Butter",
    description: "Creamy, nutty spread made from wild-harvested Marula nuts. A rare delicacy.",
    price: 250,
    category: "Pantry",
    image: "https://picsum.photos/id/835/800/800",
    vendor: mainVendor,
    tags: ["spread", "nuts", "breakfast"]
  },
  {
    id: "8",
    name: "Dried Hibiscus Flowers",
    description: "Premium dried hibiscus for making refreshing Sindambi tea. Tart and colorful.",
    price: 90,
    category: "Beverages",
    image: "https://picsum.photos/id/113/800/800",
    vendor: mainVendor,
    tags: ["tea", "dried", "flower"]
  }
];

export const CATEGORIES = ["All", "Pantry", "Oils", "Preserves", "Health", "Bakery", "Beverages"];
