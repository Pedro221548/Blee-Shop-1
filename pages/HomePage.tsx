
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, Zap, ExternalLink, ShoppingBag, ShieldCheck, MousePointer2, Heart } from 'lucide-react';
import { useProducts } from '../ProductContext';
import { useAuth } from '../AuthContext';

const HomePage: React.FC = () => {
  const { products, settings } = useProducts();
  const { favorites, toggleFavorite, isAuthenticated } = useAuth();

  return (
    <div className="space-y-8 md:space-y-12 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="z-10 text-center lg:text-left">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-900 border border-amber-100 mb-6 md:mb-8 uppercase tracking-widest">
                <Zap size={12} className="mr-2 text-amber-500" /> Curadoria {settings.storeName}
              </span>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-gray-900 mb-6 md:mb-8 leading-[1.1] md:leading-[1]">
                {settings.heroTitle} <br className="hidden sm:block" />
                <span className="text-amber-500">{settings.heroHighlight}</span>
              </h1>
              <p className="text-base md:text-lg text-gray-500 mb-8 md:mb-10 max-w-lg font-medium leading-relaxed mx-auto lg:mx-0">
                {settings.heroDescription}
              </p>
              <div className="flex flex-col items-center lg:items-start px-4 md:px-0">
                <Link 
                  to="/produtos" 
                  className="w-full sm:w-auto bg-[#12141d] text-white px-10 py-4 md:py-5 rounded-2xl font-bold shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-6 group"
                >
                  <span className="text-base md:text-lg">Explorar produtos</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            <div className="mt-12 lg:mt-0 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[450px] md:max-w-[550px] p-4 md:p-6">
                <div className="absolute inset-0 border-2 border-amber-100 rounded-[2.5rem] md:rounded-[3rem] -m-1 md:-m-2 opacity-50"></div>
                <div className="absolute inset-0 border-[6px] md:border-[10px] border-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl z-20 pointer-events-none"></div>
                
                <div className="relative z-10 rounded-[1.8rem] md:rounded-[2rem] overflow-hidden bg-amber-50 h-[320px] sm:h-[400px] md:h-[450px]">
                  <img 
                    src={settings.heroImageUrl} 
                    alt={settings.storeName} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur px-4 py-3 rounded-2xl shadow-lg border border-gray-100 animate-slide-up">
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none">Produção Ativa</p>
                    <p className="text-xs font-bold text-gray-900 mt-1">Colmeia Blee Digital</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product List */}
      <section id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-4 border-b border-gray-100 pb-6 md:pb-8">
          <h2 className="text-2xl md:text-4xl font-black text-gray-900 flex items-center tracking-tight">
            <span className="bg-amber-400 w-1.5 md:w-2.5 h-8 md:h-10 rounded-full mr-3 md:mr-4"></span>
            Minha Vitrine
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {products.map(product => (
            <div key={product.id} className="group bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-500 relative">
              
              {isAuthenticated && (
                <button 
                  onClick={(e) => { e.preventDefault(); toggleFavorite(product.id); }}
                  className={`absolute top-6 right-6 z-20 p-2.5 md:p-3 rounded-xl md:rounded-2xl shadow-lg transition-all transform hover:scale-110 active:scale-90 ${favorites.includes(product.id) ? 'bg-amber-400 text-white' : 'bg-white/80 backdrop-blur text-gray-400 hover:text-amber-500'}`}
                >
                  <Heart size={18} md:size={20} fill={favorites.includes(product.id) ? "currentColor" : "none"} />
                </button>
              )}

              <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-50 m-2 md:m-3 rounded-[1.6rem] md:rounded-[2rem]">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/95 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-900 border border-gray-100 shadow-sm">
                    {product.category}
                  </span>
                </div>
              </Link>
              
              <div className="p-6 md:p-8 pt-2 md:pt-4">
                <div className="flex justify-between items-start mb-2 md:mb-3">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-1">{product.name}</h3>
                  </Link>
                  <div className="flex items-center text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg md:rounded-xl border border-amber-100">
                    <Star size={12} fill="currentColor" />
                    <span className="text-[10px] font-black ml-1">{product.rating}</span>
                  </div>
                </div>
                
                <p className="text-xs md:text-sm text-gray-500 line-clamp-2 mb-4 md:mb-6 h-8 md:h-10 font-medium leading-relaxed">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto border-t border-gray-50 pt-5 md:pt-6">
                  <div>
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest block mb-0.5">Valor Sugerido</span>
                    <p className="text-xl md:text-2xl font-black text-gray-900">
                      R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <Link 
                    to={`/product/${product.id}`}
                    className="flex items-center space-x-2 px-5 py-2.5 md:px-6 md:py-3 bg-amber-400 text-gray-900 rounded-xl md:rounded-2xl font-black hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-lg shadow-amber-50 text-xs md:text-sm"
                  >
                    <span className="hidden sm:block">Ofertas</span>
                    <ExternalLink size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
