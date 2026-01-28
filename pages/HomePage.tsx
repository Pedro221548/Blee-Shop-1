
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, Zap, Heart, ChevronLeft, ChevronRight, Box, ShieldCheck, Sparkles } from 'lucide-react';
import { useProducts } from '../ProductContext';
import { useAuth } from '../AuthContext';

const HomePage: React.FC = () => {
  const { products, settings } = useProducts();
  const { favorites, toggleFavorite, isAuthenticated } = useAuth();
  
  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState('TUDO');
  
  const slides = [
    {
      title: settings.heroTitle,
      highlight: settings.heroHighlight,
      description: settings.heroDescription,
      image: settings.heroImageUrl,
      tag: "Curadoria Blee Shop"
    },
    {
      title: "Action Figures.",
      highlight: "Nível Colecionador.",
      description: "Nossos bonecos são fabricados com resina de alta precisão e acabamento artesanal. Perfeito para sua estante ou setup gamer.",
      image: "https://http2.mlstatic.com/D_Q_NP_892182-MLB93487725615_092025-F.webp",
      tag: "Fabricação Própria"
    },
    {
      title: "Canecas.",
      highlight: "Sua Dose de Estilo.",
      description: "Canecas de cerâmica premium com estampas exclusivas ou personalizadas. Resistentes a micro-ondas e com alto brilho.",
      image: "https://http2.mlstatic.com/D_Q_NP_825003-MLB103723021942_012026-C.webp",
      tag: "Coleção Exclusiva"
    },
    {
      title: "Quadros.",
      highlight: "Quadros Alto Relevo.",
      description: "Arte exclusiva em alto relevo que transforma seu ambiente. Textura tátil e design moderno para paredes com personalidade.",
      image: "https://http2.mlstatic.com/D_Q_NP_826339-MLB103628736154_012026-F.webp",
      tag: "Lançamento Blee"
    },
    {
      title: "Sua Decoração.",
      highlight: "Estilo em 3D.",
      description: "Transforme seu ambiente com peças exclusivas da nossa oficina. De vasos geométricos a suportes temáticos, criamos decorações com personalidade.",
      image: "https://http2.mlstatic.com/D_Q_NP_813588-MLB93490175283_092025-C.webp",
      tag: "Ambientes Criativos"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const categories = ['TUDO', 'DECORAÇÃO', 'QUADROS', 'CANECAS', 'ACTION FIGURES'];

  // Função para normalizar strings (remove acentos e espaços para comparação segura)
  const normalizeStr = (str: string) => 
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toUpperCase();

  const filteredProducts = products.filter(product => {
    if (activeCategory === 'TUDO') return true;
    return normalizeStr(product.category) === normalizeStr(activeCategory);
  });

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Slider Section */}
      <section className="relative overflow-hidden bg-white dark:bg-[#0a0c10] py-12 md:py-24 transition-colors duration-300 min-h-[600px] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            
            <div className="z-10 text-center lg:text-left animate-in fade-in slide-in-from-left-8 duration-700" key={`content-${currentSlide}`}>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-amber-50 dark:bg-amber-400/10 text-amber-900 dark:text-amber-500 border border-amber-100 dark:border-amber-900/30 mb-6 md:mb-8 uppercase tracking-widest">
                <Zap size={12} className="mr-2 text-amber-500" /> {slides[currentSlide].tag}
              </span>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-gray-900 dark:text-white mb-6 md:mb-8 leading-[1.1]">
                {slides[currentSlide].title} <br className="hidden sm:block" />
                <span className="text-amber-500">{slides[currentSlide].highlight}</span>
              </h1>
              <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 mb-8 md:mb-10 max-w-lg font-medium leading-relaxed mx-auto lg:mx-0">
                {slides[currentSlide].description}
              </p>
              
              <div className="flex flex-col items-center lg:items-start space-y-10">
                <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 justify-center lg:justify-start">
                  <Link 
                    to="/produtos" 
                    className="w-full sm:w-auto bg-[#12141d] dark:bg-amber-400 text-white dark:text-gray-900 px-10 py-4 md:py-5 rounded-2xl font-bold shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-6 group"
                  >
                    <span className="text-base md:text-lg">Explorar produtos</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                
                {/* Indicadores Centralizados Conforme Print */}
                <div className="flex items-center space-x-2.5">
                   {slides.map((_, idx) => (
                     <button 
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-500 ${currentSlide === idx ? 'w-10 bg-amber-500' : 'w-2.5 bg-gray-200 dark:bg-gray-800 hover:bg-amber-200'}`}
                      aria-label={`Slide ${idx + 1}`}
                     />
                   ))}
                </div>
              </div>
            </div>
            
            <div className="mt-12 lg:mt-0 relative flex justify-center lg:justify-end animate-in fade-in zoom-in duration-1000" key={`image-${currentSlide}`}>
              <div className="relative w-full max-w-[450px] md:max-w-[550px] p-4 md:p-6">
                <div className="absolute inset-0 border-2 border-amber-100 dark:border-amber-900/30 rounded-[2.5rem] md:rounded-[3rem] -m-1 md:-m-2 opacity-50"></div>
                <div className="absolute inset-0 border-[6px] md:border-[10px] border-white dark:border-gray-800 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl z-20 pointer-events-none"></div>
                
                <div className="relative z-10 rounded-[1.8rem] md:rounded-[2rem] overflow-hidden bg-amber-50 dark:bg-gray-900 h-[320px] sm:h-[400px] md:h-[450px]">
                  <img 
                    src={slides[currentSlide].image} 
                    alt="Blee Product" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Product Vitrine Section */}
      <section id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white flex items-center tracking-tight">
            <span className="bg-amber-400 w-2 h-10 rounded-full mr-4"></span>
            Minha Vitrine Geral
          </h2>
          
          <div className="flex flex-wrap gap-2 md:gap-3 p-1.5 bg-gray-100/80 dark:bg-gray-800/50 rounded-full border border-gray-100 dark:border-gray-800 shadow-sm">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeCategory === cat ? 'bg-amber-400 text-gray-900 shadow-md' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-white dark:hover:bg-gray-800'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {filteredProducts.map(product => (
            <div key={product.id} className="group bg-white dark:bg-[#161b22] rounded-[3.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-2xl transition-all duration-500 relative flex flex-col">
              
              {isAuthenticated && (
                <button 
                  onClick={(e) => { e.preventDefault(); toggleFavorite(product.id); }}
                  className={`absolute top-6 right-6 z-20 p-3 rounded-2xl shadow-lg transition-all transform hover:scale-110 active:scale-95 ${favorites.includes(product.id) ? 'bg-amber-400 text-white' : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur text-gray-400 hover:text-amber-500'}`}
                >
                  <Heart size={18} fill={favorites.includes(product.id) ? "currentColor" : "none"} />
                </button>
              )}

              <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-900 m-4 rounded-[2.8rem]">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Tag de Categoria - Corrigida para fundo branco sólido conforme sua solicitação */}
                <div className="absolute top-5 left-5">
                  <span className="bg-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.15em] text-gray-900 shadow-xl border border-gray-50">
                    {product.category.toUpperCase()}
                  </span>
                </div>
              </Link>
              
              <div className="p-8 pt-2 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <Link to={`/product/${product.id}`} className="flex-1">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-amber-600 transition-colors line-clamp-1">{product.name}</h3>
                  </Link>
                  {/* Rating Pill ao lado do título */}
                  <div className="flex items-center text-amber-500 bg-amber-50 dark:bg-amber-400/10 px-2.5 py-1 rounded-xl border border-amber-100 dark:border-amber-900/30 shrink-0 ml-3">
                    <Star size={12} fill="currentColor" />
                    <span className="text-[11px] font-black ml-1.5">{product.rating.toFixed(1)}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-8 font-medium leading-relaxed h-10">
                  {product.description}
                </p>
                
                <div className="mt-auto flex items-center justify-between border-t border-gray-50 dark:border-gray-800 pt-6">
                  <div>
                    <span className="text-[9px] text-gray-400 dark:text-gray-600 font-black uppercase tracking-widest block mb-0.5">Sugestão</span>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">
                      R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <Link 
                    to={`/product/${product.id}`}
                    className="flex items-center space-x-2 px-6 py-3.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl font-black hover:bg-amber-400 hover:text-gray-900 transition-all duration-300 text-xs uppercase tracking-widest"
                  >
                    <span>Ver</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Badges - Ajustado conforme estética do print */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-gray-900 dark:bg-[#161b22] p-12 md:p-20 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
            
            <div className="flex flex-col items-center text-center space-y-6">
               <div className="bg-amber-400 p-5 rounded-[2rem] text-gray-900 shadow-xl shadow-amber-400/20">
                  <Box size={36} />
               </div>
               <div>
                  <h3 className="text-xl font-black uppercase tracking-tight mb-2">Embalagem Blindada</h3>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed">Seus colecionáveis viajam com proteção reforçada para chegarem perfeitos.</p>
               </div>
            </div>

            <div className="flex flex-col items-center text-center space-y-6">
               <div className="bg-white/10 p-5 rounded-[2rem] text-amber-400 backdrop-blur-md">
                  <ShieldCheck size={36} />
               </div>
               <div>
                  <h3 className="text-xl font-black uppercase tracking-tight mb-2">Garantia Blee</h3>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed">Cada peça passa por um controle de qualidade rigoroso na nossa colmeia.</p>
               </div>
            </div>

            <div className="flex flex-col items-center text-center space-y-6">
               <div className="bg-white/10 p-5 rounded-[2rem] text-amber-400 backdrop-blur-md">
                  <Sparkles size={36} />
               </div>
               <div>
                  <h3 className="text-xl font-black uppercase tracking-tight mb-2">Criação Única</h3>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed">Nada de genérico. Nossos designs são exclusivos e pensados para fãs exigentes.</p>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default HomePage;
