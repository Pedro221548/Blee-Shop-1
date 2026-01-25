
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Menu, LogOut, Settings, ChevronDown, ShoppingCart, Layout, Search, X, ArrowRight, Home, Image, Box } from 'lucide-react';
import BeeLogo from './BeeLogo';
import { useAuth } from '../AuthContext';
import { useCart } from '../CartContext';
import { useProducts } from '../ProductContext';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated, isResponsible } = useAuth();
  const { cartCount } = useCart();
  const { products } = useProducts();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Bloquear scroll do body quando o menu mobile ou busca estiverem abertos
  useEffect(() => {
    if (isSearchOpen || isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isSearchOpen, isMobileMenuOpen]);

  const filteredResults = searchQuery.trim() === '' 
    ? [] 
    : products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-amber-400 p-1.5 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                <BeeLogo size={28} />
              </div>
              <span className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                Blee <span className="text-amber-500">Shop</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-amber-600 font-bold transition-colors">Início</Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-amber-600 font-bold transition-colors">Encomendas 3D</Link>
            <Link to="/produtos" className="text-gray-600 hover:text-amber-600 font-bold transition-colors">Galeria</Link>
            {isResponsible && (
              <Link to="/admin" className="text-amber-600 hover:text-amber-700 font-black flex items-center space-x-1">
                <Settings size={16} />
                <span>Gestão</span>
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-1 md:space-x-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 text-gray-500 hover:text-amber-600 transition-colors"
              aria-label="Buscar"
            >
              <Search size={22} />
            </button>

            <Link to="/cart" className="p-2.5 text-gray-500 hover:text-amber-600 transition-colors relative group">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-amber-500 text-white text-[9px] font-black min-w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="relative hidden md:block">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 pl-3 pr-1 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-all border border-gray-200"
                >
                  <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-[11px] font-black text-white">
                    {user?.name.charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-gray-700">{user?.name}</span>
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
                      <Link to="/dashboard" onClick={() => setShowDropdown(false)} className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-600 font-bold hover:bg-gray-50 hover:text-amber-600 rounded-xl transition-all">
                        <Layout size={18} />
                        <span>Minha Conta</span>
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-500 font-bold hover:bg-red-50 rounded-xl transition-all"
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
                className="hidden md:flex items-center space-x-2 px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm font-bold hover:bg-amber-500 transition-all shadow-lg"
              >
                <User size={16} />
                <span>Entrar</span>
              </Link>
            )}

            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2.5 text-gray-500 hover:text-amber-600"
              aria-label="Abrir Menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Lateral (Drawer) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="fixed inset-y-0 right-0 w-[80%] max-w-xs bg-white shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
            <div className="p-6 flex items-center justify-between border-b border-gray-50">
              <span className="text-xl font-black text-gray-900">Navegação</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-50 rounded-xl text-gray-400"><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-2">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-4 p-4 rounded-2xl bg-gray-50 text-gray-900 font-bold">
                <Home size={20} className="text-amber-500" />
                <span>Início</span>
              </Link>
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-gray-50 text-gray-600 font-bold">
                <Box size={20} className="text-amber-500" />
                <span>Encomendas 3D</span>
              </Link>
              <Link to="/produtos" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-gray-50 text-gray-600 font-bold">
                <Image size={20} className="text-amber-500" />
                <span>Galeria Portfólio</span>
              </Link>
              {isResponsible && (
                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-amber-50 text-amber-600 font-black">
                  <Settings size={20} />
                  <span>Painel do Dono</span>
                </Link>
              )}
            </div>

            <div className="p-6 border-t border-gray-50">
              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-2">
                    <div className="w-10 h-10 bg-amber-400 rounded-2xl flex items-center justify-center text-white font-black text-sm">
                      {user?.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 leading-none">{user?.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Conta Ativa</p>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 py-4 bg-red-50 text-red-500 rounded-2xl font-bold">
                    <LogOut size={18} />
                    <span>Desconectar</span>
                  </button>
                </div>
              ) : (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center justify-center space-x-2 py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-lg shadow-gray-200">
                  <User size={18} />
                  <span>Entrar / Cadastrar</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Overlay de Busca (Otimizado Mobile) */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-white animate-in fade-in duration-200 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 pt-6 md:pt-20">
            <div className="flex items-center justify-between mb-8 md:mb-12">
              <div className="flex items-center space-x-3 md:space-x-4 flex-1">
                <Search className="text-amber-500 hidden sm:block" size={32} />
                <Search className="text-amber-500 sm:hidden" size={24} />
                <input 
                  ref={searchInputRef}
                  type="text"
                  placeholder="Procurar na colmeia..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xl md:text-3xl font-black text-gray-900 placeholder-gray-200 outline-none border-none"
                  onKeyDown={(e) => e.key === 'Escape' && handleSearchClose()}
                />
              </div>
              <button 
                onClick={handleSearchClose}
                className="p-2 md:p-3 bg-gray-100 rounded-xl md:rounded-full text-gray-400 hover:text-gray-900 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="pb-10">
              {searchQuery && (
                <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Resultados Encontrados</p>
                  
                  {filteredResults.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {filteredResults.map(product => (
                        <Link 
                          key={product.id}
                          to={`/product/${product.id}`}
                          onClick={handleSearchClose}
                          className="flex items-center p-3 md:p-4 bg-gray-50 rounded-2xl md:rounded-3xl border border-transparent hover:border-amber-200 hover:bg-white transition-all group"
                        >
                          <img src={product.image} className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl object-cover shadow-sm" alt="" />
                          <div className="ml-4 flex-1">
                            <h4 className="font-bold text-sm md:text-base text-gray-900 group-hover:text-amber-600 transition-colors">{product.name}</h4>
                            <p className="text-[10px] md:text-xs text-gray-400 font-medium">{product.category}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-xs md:text-base text-gray-900">R$ {product.price.toFixed(2)}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center">
                      <p className="text-base text-gray-400 font-bold italic">Nenhum rastro de mel encontrado...</p>
                    </div>
                  )}
                </div>
              )}

              {!searchQuery && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 animate-in fade-in duration-500">
                  {['Eletrônicos', 'Acessórios', 'Moda', '3D Printing'].map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setSearchQuery(cat)}
                      className="p-5 bg-gray-50 rounded-2xl text-left flex items-center justify-between hover:bg-amber-50 transition-all"
                    >
                      <span className="text-xs font-black uppercase tracking-widest text-gray-600">{cat}</span>
                      <ArrowRight size={14} className="text-amber-500" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
