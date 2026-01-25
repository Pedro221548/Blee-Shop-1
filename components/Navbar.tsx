
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Menu, LogOut, Settings, ChevronDown, ShoppingCart, Layout, Camera } from 'lucide-react';
import BeeLogo from './BeeLogo';
import { useAuth } from '../AuthContext';
import { useCart } from '../CartContext';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated, isResponsible } = useAuth();
  const { cartCount } = useCart();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-amber-400 p-1 rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-300">
                <BeeLogo size={32} />
              </div>
              <span className="text-2xl font-black text-gray-900 tracking-tight">
                Blee <span className="text-amber-500">Shop</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-amber-600 font-bold transition-colors">Início</Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-amber-600 font-bold transition-colors">Encomendas 3D</Link>
            <Link to="/produtos" className="text-gray-600 hover:text-amber-600 font-bold transition-colors">Produtos</Link>
            {isResponsible && (
              <Link to="/admin" className="text-amber-600 hover:text-amber-700 font-black flex items-center space-x-1">
                <Settings size={16} />
                <span>Gestão</span>
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <Link to="/cart" className="p-2 text-gray-400 hover:text-amber-600 transition-colors relative group">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-amber-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white transform translate-x-1 -translate-y-1">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 pl-3 pr-1 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-all border border-gray-200"
                >
                  <div className="w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center text-[10px] font-black text-white">
                    {user?.name.charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-gray-700 hidden sm:block">{user?.name}</span>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showDropdown && (
                  <>
                    <div className="fixed inset-0 z-[-1]" onClick={() => setShowDropdown(false)}></div>
                    <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl p-2 animate-zoom-in">
                      <div className="px-4 py-3 border-b border-gray-50 mb-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Conta {user?.role === 'responsible' ? 'Responsável' : 'Cliente'}</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{user?.email}</p>
                      </div>
                      <Link to="/dashboard" onClick={() => setShowDropdown(false)} className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-600 font-bold hover:bg-gray-50 hover:text-amber-600 rounded-xl transition-all">
                        <Layout size={18} />
                        <span>Minha Conta</span>
                      </Link>
                      {isResponsible && (
                        <Link to="/admin" onClick={() => setShowDropdown(false)} className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-600 font-bold hover:bg-gray-50 hover:text-amber-600 rounded-xl transition-all">
                          <Settings size={18} />
                          <span>Painel do Dono</span>
                        </Link>
                      )}
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-500 font-bold hover:bg-red-50 rounded-xl transition-all"
                      >
                        <LogOut size={18} />
                        <span>Sair</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center space-x-2 px-5 py-2 bg-gray-900 text-white rounded-full text-xs font-bold hover:bg-amber-500 transition-all shadow-lg shadow-gray-200"
              >
                <User size={14} />
                <span>Entrar</span>
              </Link>
            )}

            <button className="md:hidden p-2 text-gray-400 hover:text-amber-600">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
