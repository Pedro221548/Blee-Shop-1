
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductDetail from './pages/ProductDetail';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import UserDashboard from './pages/UserDashboard';
import InfoPage from './pages/InfoPage';
import CustomOrderLanding from './pages/CustomOrderLanding';
import ProductsGallery from './pages/ProductsGallery';
import SimulatorPage from './pages/SimulatorPage';
import { ProductProvider, useProducts } from './ProductContext';
import { AuthProvider, useAuth } from './AuthContext';
import { CartProvider } from './CartContext';
import BeeLogo from './components/BeeLogo';

const ProtectedRoute: React.FC<{ children: React.ReactNode, adminOnly?: boolean }> = ({ children, adminOnly = false }) => {
  const { isResponsible, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (adminOnly && !isResponsible) return <Navigate to="/" />;
  return <>{children}</>;
};

const DashboardRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <UserDashboard /> : <CustomOrderLanding />;
};

const AppContent: React.FC = () => {
  const { settings } = useProducts();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/info/:tab" element={<InfoPage />} />
          <Route path="/dashboard" element={<DashboardRoute />} />
          <Route path="/produtos" element={<ProductsGallery />} />
          <Route path="/simulador" element={<SimulatorPage />} />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminPage />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      
      <footer className="bg-white border-t border-gray-100 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-6 group">
                <div className="bg-amber-400 p-1.5 rounded-lg group-hover:rotate-12 transition-transform shadow-sm">
                  <BeeLogo size={28} />
                </div>
                <span className="text-2xl font-black text-gray-900 tracking-tighter">
                  {settings.storeName.split(' ')[0]} <span className="text-amber-500">{settings.storeName.split(' ').slice(1).join(' ')}</span>
                </span>
              </div>
              <p className="text-gray-500 max-w-sm mx-auto md:mx-0 font-medium leading-relaxed">
                {settings.storeTagline}
              </p>
            </div>
            <div>
              <h4 className="font-black text-xs uppercase tracking-widest text-gray-900 mb-6">Informações</h4>
              <ul className="space-y-3 text-gray-500 text-sm font-bold">
                <li><Link to="/info/como-funciona" className="hover:text-amber-600 transition-colors">Como Funciona</Link></li>
                <li><Link to="/info/aviso-legal" className="hover:text-amber-600 transition-colors">Aviso Legal</Link></li>
                <li><Link to="/info/privacidade" className="hover:text-amber-600 transition-colors">Privacidade</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest gap-4">
            <p>&copy; 2024 {settings.storeName}. Todos os links levam a lojas oficiais parceiras.</p>
            <div className="flex space-x-6">
              <span>Mercado Livre Oficial</span>
              <span>Shopee Verificado</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <Router>
            <AppContent />
          </Router>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
};

export default App;
