
export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  reviewsList?: Review[];
  mlUrl?: string;
  shopeeUrl?: string;
  width?: number;   // em cm
  height?: number;  // em cm
  length?: number;  // em cm
  weight?: number;  // em kg
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  url: string;
  createdAt: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  delivery_time: number;
  company: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CustomOrder {
  id: string;
  type: '3d' | 'mug';
  description: string;
  phone: string;
  image?: string;
  customerName: string;
  customerEmail: string;
  status: 'pending' | 'contacted' | 'finished';
  createdAt: string;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  notification: string | null;
  selectedShipping: ShippingOption | null;
  setSelectedShipping: (option: ShippingOption | null) => void;
}

export interface StoreSettings {
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  heroImageUrl: string;
  storeName: string;
  storeTagline: string;
}

export interface ProductContextType {
  products: Product[];
  orders: CustomOrder[];
  portfolioItems: PortfolioItem[];
  settings: StoreSettings;
  updateProduct: (updatedProduct: Product) => void;
  addProduct: (newProduct: Omit<Product, 'id' | 'rating' | 'reviews'>) => void;
  deleteProduct: (id: number) => void;
  resetProducts: () => void;
  updateSettings: (newSettings: StoreSettings) => void;
  addOrder: (order: Omit<CustomOrder, 'id' | 'status' | 'createdAt'>) => void;
  updateOrderStatus: (orderId: string, status: CustomOrder['status']) => void;
  deleteOrder: (orderId: string) => void;
  addProductReview: (productId: number, review: Omit<Review, 'id' | 'date'>) => void;
  addPortfolioItem: (item: Omit<PortfolioItem, 'id' | 'createdAt'>) => void;
  updatePortfolioItem: (item: PortfolioItem) => void;
  deletePortfolioItem: (id: string) => void;
}
