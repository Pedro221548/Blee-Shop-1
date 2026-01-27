
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { User, Menu, LogOut, Settings, ChevronDown, ShoppingCart, Layout, Search, X, ArrowRight, Home, Image, Box, Eye, Phone } from 'lucide-react';
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
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (isSearchOpen || isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
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

  const navigateAndClose = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  };

  return (
    <nav className="sticky top-0 z-[60] glass-effect border-b border-gray-100 h-16 md:h-20 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-full">
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
            <Link to="/simulador" className="text-gray-600 hover:text-amber-600 font-bold transition-colors flex items-center gap-1">
              <Eye size={16} className="text-amber-500" />
              <span>Simulador</span>
            </Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-amber-600 font-bold transition-colors">Encomendas 3D</Link>
            <Link to="/produtos" className="text-gray-600 hover:text-amber-600 font-bold transition-colors">Portifólio</Link>
            <Link to="/contato" className="text-gray-600 hover:text-amber-600 font-bold transition-colors">Contato</Link>
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

      {/* Portal para o Menu Mobile */}
      {isMobileMenuOpen && createPortal(
        <div className="fixed inset-0 z-[10000] md:hidden">
          {/* Backdrop Escuro Sólido */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" 
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Menu Panel */}
          <div className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[320px] bg-white shadow-2xl flex flex-col z-[10001] animate-slide-in-right overflow-hidden">
            
            {/* Header do Menu */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-white shrink-0">
              <div className="flex items-center space-x-2">
                <BeeLogo size={24} />
                <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Navegação</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 text-gray-400 hover:text-amber-500 bg-gray-50 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Links da Lista */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-white">
              <button 
                onClick={() => navigateAndClose('/')}
                className="w-full flex items-center space-x-4 p-4 rounded-2xl bg-amber-50 text-amber-900 font-black border border-amber-100 text-left"
              >
                <Home size={20} />
                <span className="text-sm">Início</span>
              </button>

              <button 
                onClick={() => navigateAndClose('/simulador')}
                className="w-full flex items-center space-x-4 p-4 rounded-2xl text-gray-600 font-bold hover:bg-gray-50 transition-all text-left"
              >
                <Eye size={20} className="text-amber-500" />
                <span className="text-sm">Simulador BeeView</span>
              </button>
              
              <button 
                onClick={() => navigateAndClose('/dashboard')}
                className="w-full flex items-center space-x-4 p-4 rounded-2xl text-gray-600 font-bold hover:bg-gray-50 transition-all text-left"
              >
                <Box size={20} className="text-amber-500" />
                <span className="text-sm">Encomendas 3D</span>
              </button>

              <button 
                onClick={() => navigateAndClose('/produtos')}
                className="w-full flex items-center space-x-4 p-4 rounded-2xl text-gray-600 font-bold hover:bg-gray-50 transition-all text-left"
              >
                <Image size={20} className="text-amber-500" />
                <span className="text-sm">Portifólio</span>
              </button>

              <button 
                onClick={() => navigateAndClose('/contato')}
                className="w-full flex items-center space-x-4 p-4 rounded-2xl text-gray-600 font-bold hover:bg-gray-50 transition-all text-left"
              >
                <Phone size={20} className="text-amber-500" />
                <span className="text-sm">Contato</span>
              </button>

              {isResponsible && (
                <div className="pt-6 mt-6 border-t border-gray-50">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3 px-2">Gestão</p>
                  <button 
                    onClick={() => navigateAndClose('/admin')}
                    className="w-full flex items-center space-x-4 p-4 rounded-2xl bg-gray-900 text-white font-black shadow-lg"
                  >
                    <Settings size={20} className="text-amber-400" />
                    <span className="text-sm">Painel Dono</span>
                  </button>
                </div>
              )}
            </div>

            {/* Rodapé do Menu (Usuário) */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0">
              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 bg-white p-4 rounded-2xl border border-gray-200/50 shadow-sm">
                    <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center text-white font-black text-base shrink-0">
                      {user?.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-gray-900 text-xs truncate">{user?.name}</p>
                      <p className="text-[9px] text-amber-600 font-black uppercase tracking-widest mt-0.5">Conta Ativa</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 py-3.5 bg-red-50 text-red-500 rounded-2xl font-black text-[11px] hover:bg-red-100 transition-all border border-red-100/30"
                  >
                    <LogOut size={16} />
                    <span>Desconectar</span>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => navigateAndClose('/login')}
                  className="w-full flex items-center justify-center space-x-3 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs shadow-xl"
                >
                  <User size={18} />
                  <span>Entrar na Loja</span>
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Overlay de Busca */}
      {isSearchOpen && createPortal(
        <div className="fixed inset-0 z-[20000] bg-white animate-fade-in overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 pt-10 md:pt-24 pb-20">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center space-x-4 md:space-x-6 flex-1">
                <Search className="text-amber-500 shrink-0" size={32} />
                <input 
                  ref={searchInputRef}
                  type="text"
                  placeholder="Procurar na colmeia..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-2xl md:text-5xl font-black text-gray-900 placeholder-gray-100 outline-none border-none tracking-tight"
                  onKeyDown={(e) => e.key === 'Escape' && handleSearchClose()}
                />
              </div>
              <button 
                onClick={handleSearchClose}
                className="p-4 bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 hover:rotate-90 transition-all duration-300"
              >
                <X size={28} />
              </button>
            </div>

            <div className="space-y-10">
              {searchQuery ? (
                <div className="animate-zoom-in">
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] mb-6 border-b border-gray-50 pb-4">Resultados</p>
                  
                  {filteredResults.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {filteredResults.map(product => (
                        <button 
                          key={product.id}
                          onClick={() => navigateAndClose(`/product/${product.id}`)}
                          className="flex items-center p-5 bg-gray-50 rounded-[2.5rem] border border-transparent hover:border-amber-200 hover:bg-white hover:shadow-xl transition-all group text-left w-full"
                        >
                          <img src={product.image} className="w-16 h-16 md:w-24 md:h-24 rounded-3xl object-cover shadow-sm group-hover:scale-110 transition-transform duration-500" alt="" />
                          <div className="ml-6 flex-1">
                            <h4 className="font-black text-lg text-gray-900 group-hover:text-amber-600 transition-colors leading-tight">{product.name}</h4>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{product.category}</p>
                          </div>
                          <div className="text-right ml-4">
                            <span className="font-black text-xl text-gray-900">R$ {product.price.toFixed(2)}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="py-24 text-center">
                      <p className="text-xl text-gray-300 font-black italic">Nenhum rastro de mel por aqui...</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="animate-fade-in">
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] mb-8">Categorias</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['Impressão 3D', 'Canecas', 'Acessórios'].map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setSearchQuery(cat)}
                        className="p-8 bg-gray-50 rounded-[2.5rem] text-left flex items-center justify-between hover:bg-amber-400 hover:text-gray-900 transition-all group"
                      >
                        <span className="text-lg font-black uppercase tracking-tight">{cat}</span>
                        <ArrowRight size={20} className="text-amber-500 group-hover:text-gray-900 group-hover:translate-x-2 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </nav>
  );
};

export default Navbar;
