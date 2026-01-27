
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, ProductContextType, StoreSettings, CustomOrder, Review, PortfolioItem } from './types';
import { PRODUCTS as INITIAL_PRODUCTS } from './constants';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, push, update } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCTIUeP-394P6YSoXchUtEDxP4IYnxFDFA",
  authDomain: "projeto-b3d06.firebaseapp.com",
  databaseURL: "https://projeto-b3d06-default-rtdb.firebaseio.com",
  projectId: "projeto-b3d06",
  storageBucket: "projeto-b3d06.firebasestorage.app",
  messagingSenderId: "229281776633",
  appId: "1:229281776633:web:8500e024bd083f9873f328"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const DEFAULT_SETTINGS: StoreSettings = {
  heroTitle: "Impressão 3D.",
  heroHighlight: "Sua Imaginação.",
  heroDescription: "Bem-vindo à oficina da Blee Shop. Somos especialistas em transformar ideias em realidade através da impressão 3D e canecas personalizadas. Explore nossas criações próprias e nossa curadoria exclusiva de tecnologia.",
  heroImageUrl: "https://img.odcdn.com.br/wp-content/uploads/2024/07/imagem_2024-07-29_125616737.png",
  storeName: "Blee Shop",
  storeTagline: "Sua oficina de tecnologia e personalização 3D",
  whatsapp: "5511999999999",
  instagram: "https://instagram.com/bleeshop",
  shopee: "https://shopee.com.br",
  mercadolivre: "https://mercadolivre.com.br"
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    // Products Listener
    const productsRef = ref(db, 'catalog/products');
    const unsubscribeProducts = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productsList = Object.values(data).map((p: any) => ({
          ...p,
          reviewsList: p.reviewsList ? Object.values(p.reviewsList) : []
        })) as Product[];
        setProducts(productsList);
      } else {
        set(productsRef, INITIAL_PRODUCTS.reduce((acc, p) => ({ ...acc, [p.id]: p }), {}));
      }
    });

    // Orders Listener
    const ordersRef = ref(db, 'catalog/orders');
    const unsubscribeOrders = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ordersList = Object.entries(data).map(([id, val]: [string, any]) => ({
          ...val,
          id
        })) as CustomOrder[];
        setOrders(ordersList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } else {
        setOrders([]);
      }
    });

    // Portfolio Listener
    const portfolioRef = ref(db, 'catalog/portfolio');
    const unsubscribePortfolio = onValue(portfolioRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([id, val]: [string, any]) => ({
          ...val,
          id
        })) as PortfolioItem[];
        setPortfolioItems(list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } else {
        setPortfolioItems([]);
      }
    });

    // Settings Listener
    const settingsRef = ref(db, 'catalog/settings');
    const unsubscribeSettings = onValue(settingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSettings({ ...DEFAULT_SETTINGS, ...data });
      } else {
        set(settingsRef, DEFAULT_SETTINGS);
      }
    });

    return () => {
      unsubscribeProducts();
      unsubscribeOrders();
      unsubscribePortfolio();
      unsubscribeSettings();
    };
  }, []);

  const updateProduct = (updatedProduct: Product) => {
    set(ref(db, `catalog/products/${updatedProduct.id}`), updatedProduct);
  };

  const addProduct = (productData: Omit<Product, 'id' | 'rating' | 'reviews'>) => {
    const id = Date.now();
    const newProduct: Product = {
      ...productData,
      id,
      rating: 5.0,
      reviews: 0,
      reviewsList: []
    };
    set(ref(db, `catalog/products/${id}`), newProduct);
  };

  const deleteProduct = (id: number) => {
    set(ref(db, `catalog/products/${id}`), null);
  };

  const resetProducts = () => {
    set(ref(db, 'catalog/products'), INITIAL_PRODUCTS.reduce((acc, p) => ({ ...acc, [p.id]: p }), {}));
    set(ref(db, 'catalog/settings'), DEFAULT_SETTINGS);
  };

  const updateSettings = (newSettings: StoreSettings) => {
    set(ref(db, 'catalog/settings'), newSettings);
  };

  const addOrder = (orderData: Omit<CustomOrder, 'id' | 'status' | 'createdAt'>) => {
    const ordersRef = ref(db, 'catalog/orders');
    const newOrderRef = push(ordersRef);
    const newOrder: Omit<CustomOrder, 'id'> = {
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    set(newOrderRef, newOrder);
  };

  const updateOrderStatus = (orderId: string, status: CustomOrder['status']) => {
    set(ref(db, `catalog/orders/${orderId}/status`), status);
  };

  const deleteOrder = (orderId: string) => {
    set(ref(db, `catalog/orders/${orderId}`), null);
  };

  const addProductReview = (productId: number, reviewData: Omit<Review, 'id' | 'date'>) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const reviewsRef = ref(db, `catalog/products/${productId}/reviewsList`);
    const newReviewRef = push(reviewsRef);
    const newReview: Review = {
      ...reviewData,
      id: newReviewRef.key || Date.now().toString(),
      date: new Date().toISOString()
    };

    const updatedReviewsCount = (product.reviews || 0) + 1;
    const currentTotalRating = (product.rating || 0) * (product.reviews || 0);
    const newAverageRating = (currentTotalRating + reviewData.rating) / updatedReviewsCount;

    const updates: any = {};
    updates[`catalog/products/${productId}/reviewsList/${newReview.id}`] = newReview;
    updates[`catalog/products/${productId}/reviews`] = updatedReviewsCount;
    updates[`catalog/products/${productId}/rating`] = Number(newAverageRating.toFixed(1));

    update(ref(db), updates);
  };

  const addPortfolioItem = (itemData: Omit<PortfolioItem, 'id' | 'createdAt'>) => {
    const portfolioRef = ref(db, 'catalog/portfolio');
    const newItemRef = push(portfolioRef);
    const newItem = {
      ...itemData,
      createdAt: new Date().toISOString()
    };
    set(newItemRef, newItem);
  };

  const updatePortfolioItem = (item: PortfolioItem) => {
    const { id, ...data } = item;
    set(ref(db, `catalog/portfolio/${id}`), data);
  };

  const deletePortfolioItem = (id: string) => {
    set(ref(db, `catalog/portfolio/${id}`), null);
  };

  return (
    <ProductContext.Provider value={{ 
      products, 
      orders,
      portfolioItems,
      settings, 
      updateProduct, 
      addProduct, 
      deleteProduct, 
      resetProducts,
      updateSettings,
      addOrder,
      updateOrderStatus,
      deleteOrder,
      addProductReview,
      addPortfolioItem,
      updatePortfolioItem,
      deletePortfolioItem
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within a ProductProvider');
  return context;
};
