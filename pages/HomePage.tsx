
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, Zap, ExternalLink, ShoppingBag, ShieldCheck, MousePointer2, Heart } from 'lucide-react';
import { useProducts } from '../ProductContext';
import { useAuth } from '../AuthContext';

const HomePage: React.FC = () => {
  const { products, settings } = useProducts();
  const { favorites, toggleFavorite, isAuthenticated } = useAuth();

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="z-10 text-center lg:text-left">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-100 mb-8">
                <Zap size={14} className="mr-2 text-amber-500" /> Curadoria Exclusiva {settings.storeName}
              </span>
              <h1 className="text-5xl font-black tracking-tighter text-gray-900 sm:text-7xl mb-8 leading-[1.1]">
                {settings.heroTitle} <br/>
                <span className="text-amber-500">{settings.heroHighlight}</span>
              </h1>
              <p className="mt-4 text-lg text-gray-500 mb-10 max-w-lg font-medium leading-relaxed mx-auto lg:mx-0">
                {settings.heroDescription}
              </p>
              <div className="flex flex-col items-center lg:items-start">
                <Link 
                  to="/produtos" 
                  className="bg-[#12141d] text-white px-10 py-5 rounded-2xl font-bold shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.25)] hover:-translate-y-1 transition-all duration-300 flex items-center space-x-6 group border border-white/5"
                >
                  <span className="text-lg">Explorar produtos</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            <div className="mt-16 lg:mt-0 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[550px] p-6">
                <div className="absolute inset-0 border-2 border-amber-100 rounded-[3rem] -m-2 opacity-50"></div>
                <div className="absolute inset-0 border-[10px] border-white rounded-[2.5rem] shadow-2xl z-20 pointer-events-none"></div>
                
                <div className="absolute top-10 left-10 w-24 h-24 bg-amber-200/50 rounded-full blur-xl z-0"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-amber-100/60 rounded-full blur-2xl z-0"></div>
                
                <div className="relative z-10 rounded-[2rem] overflow-hidden bg-amber-50 h-[450px]">
                  <img 
                    src={settings.heroImageUrl} 
                    alt={settings.storeName} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-12 left-12 w-20 h-20 bg-amber-300/30 rounded-full mix-blend-multiply filter blur-sm"></div>
                  <div className="absolute bottom-20 right-12 w-32 h-32 bg-amber-400/20 rounded-full mix-blend-multiply filter blur-md"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product List */}
      <section id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 border-b border-gray-100 pb-8">
          <h2 className="text-4xl font-black text-gray-900 flex items-center tracking-tight">
            <span className="bg-amber-400 w-2.5 h-10 rounded-full mr-4"></span>
            Minha Vitrine
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map(product => (
            <div key={product.id} className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 relative">
              
              {/* Favorite Button */}
              {isAuthenticated && (
                <button 
                  onClick={(e) => { e.preventDefault(); toggleFavorite(product.id); }}
                  className={`absolute top-8 right-8 z-20 p-3 rounded-2xl shadow-lg transition-all transform hover:scale-110 active:scale-90 ${favorites.includes(product.id) ? 'bg-amber-400 text-white' : 'bg-white/80 backdrop-blur text-gray-400 hover:text-amber-500'}`}
                >
                  <Heart size={20} fill={favorites.includes(product.id) ? "currentColor" : "none"} />
                </button>
              )}

              <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-50 m-3 rounded-[2rem]">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute top-5 left-5">
                  <span className="bg-white/95 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-900 border border-gray-100 shadow-sm">
                    {product.category}
                  </span>
                </div>
              </Link>
              
              <div className="p-8 pt-4">
                <div className="flex justify-between items-start mb-3">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-1">{product.name}</h3>
                  </Link>
                  <div className="flex items-center text-amber-500 bg-amber-50 px-3 py-1 rounded-xl border border-amber-100">
                    <Star size={14} fill="currentColor" />
                    <span className="text-xs font-black ml-1.5">{product.rating}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 line-clamp-2 mb-6 h-10 font-medium leading-relaxed">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto border-t border-gray-50 pt-6">
                  <div>
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block mb-1">Preço Sugerido</span>
                    <p className="text-2xl font-black text-gray-900">
                      R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <Link 
                    to={`/product/${product.id}`}
                    className="flex items-center space-x-2 px-6 py-3 bg-amber-400 text-gray-900 rounded-2xl font-black hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-lg shadow-amber-100 text-sm"
                  >
                    <span>Ver Ofertas</span>
                    <ExternalLink size={18} />
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
