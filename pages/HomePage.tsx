
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, Zap, ExternalLink, Heart, ChevronLeft, ChevronRight, Box, ShieldCheck, Sparkles } from 'lucide-react';
import { useProducts } from '../ProductContext';
import { useAuth } from '../AuthContext';

const HomePage: React.FC = () => {
  const { products, settings } = useProducts();
  const { favorites, toggleFavorite, isAuthenticated } = useAuth();
  
  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  
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
      image: "https://http2.mlstatic.com/D_Q_NP_892182-MLB93487725615_092025-F.webp", // Wandinha
      tag: "Fabricação Própria"
    },
    {
      title: "Canecas.",
      highlight: "Sua Dose de Estilo.",
      description: "Canecas de cerâmica premium com estampas exclusivas ou personalizadas. Resistentes a micro-ondas e com alto brilho.",
      image: "https://http2.mlstatic.com/D_Q_NP_825003-MLB103723021942_012026-C.webp", // Caneca
      tag: "Coleção Exclusiva"
    },
    {
      title: "Quadros.",
      highlight: "Quadros Alto Relevo.",
      description: "Arte exclusiva em alto relevo que transforma seu ambiente. Textura tátil e design moderno para paredes com personalidade.",
      image: "https://http2.mlstatic.com/D_Q_NP_826339-MLB103628736154_012026-F.webp", // Quadros
      tag: "Lançamento Blee"
    },
    {
      title: "Sua Decoração.",
      highlight: "Estilo em 3D.",
      description: "Transforme seu ambiente com peças exclusivas da nossa oficina. De vasos geométricos a suportes temáticos, criamos decorações que dão vida e personalidade ao seu espaço.",
      image: "https://http2.mlstatic.com/D_Q_NP_813588-MLB93490175283_092025-C.webp", // Alien como referência de decoração
      tag: "Ambientes Criativos"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const actionFigures = products.filter(p => p.category === "Action Figures");

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Slider Section */}
      <section className="relative overflow-hidden bg-white dark:bg-[#0a0c10] py-12 md:py-24 transition-colors duration-300 min-h-[600px] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            
            {/* Slide Content */}
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
              <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 justify-center lg:justify-start">
                <Link 
                  to="/produtos" 
                  className="w-full sm:w-auto bg-[#12141d] dark:bg-amber-400 text-white dark:text-gray-900 px-10 py-4 md:py-5 rounded-2xl font-bold shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-6 group"
                >
                  <span className="text-base md:text-lg">Explorar produtos</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex space-x-2">
                   {slides.map((_, idx) => (
                     <button 
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-8 bg-amber-500' : 'w-2 bg-gray-200 dark:bg-gray-800 hover:bg-amber-200'}`}
                     />
                   ))}
                </div>
              </div>
            </div>
            
            {/* Slide Image Container */}
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
                  <div className="absolute bottom-6 right-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur px-4 py-3 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <p className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest leading-none">STATUS: ONLINE</p>
                    <p className="text-xs font-bold text-gray-900 dark:text-white mt-1">Colmeia Blee Digital</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons (Desktop) */}
        <div className="hidden lg:block">
           <button 
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/50 dark:bg-black/20 hover:bg-amber-400 dark:hover:bg-amber-400 hover:text-white rounded-full transition-all backdrop-blur-md z-30"
           >
             <ChevronLeft size={24} />
           </button>
           <button 
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/50 dark:bg-black/20 hover:bg-amber-400 dark:hover:bg-amber-400 hover:text-white rounded-full transition-all backdrop-blur-md z-30"
           >
             <ChevronRight size={24} />
           </button>
        </div>
      </section>

      {/* Specialty: Action Figures Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-amber-500 font-black uppercase text-[10px] tracking-[0.3em] mb-4">Nossa Especialidade</span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            Action Figures <span className="text-amber-500">Premium.</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mt-4 font-medium">
            De bustos icônicos a criaturas autorais. Nossa oficina transforma resina líquida em arte colecionável com detalhes que você consegue sentir.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {actionFigures.map(figure => (
            <div key={figure.id} className="group bg-white dark:bg-[#161b22] rounded-[3rem] border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-2xl transition-all duration-500">
              <Link to={`/product/${figure.id}`} className="block relative aspect-[4/5] overflow-hidden">
                <img src={figure.image} alt={figure.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                   <div className="text-white">
                      <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1">Ver Detalhes</p>
                      <h4 className="text-xl font-black">{figure.name}</h4>
                   </div>
                </div>
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                   <span className="bg-amber-400 text-gray-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Oficina Blee</span>
                   <span className="bg-white/90 dark:bg-gray-800/90 backdrop-blur text-gray-900 dark:text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-100 dark:border-gray-700">Handmade</span>
                </div>
              </Link>
              <div className="p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{figure.name}</h3>
                  <div className="flex items-center text-amber-500">
                    <Star size={14} fill="currentColor" />
                    <span className="text-xs font-black ml-1">5.0</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-gray-900 dark:text-white">R$ {figure.price.toFixed(2)}</span>
                  <Link to={`/product/${figure.id}`} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-2xl hover:bg-amber-400 dark:hover:bg-amber-400 hover:text-white transition-all">
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Product Vitrine */}
      <section id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-4 border-b border-gray-100 dark:border-gray-800 pb-6 md:pb-8">
          <h2 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white flex items-center tracking-tight">
            <span className="bg-amber-400 w-1.5 md:w-2.5 h-8 md:h-10 rounded-full mr-3 md:mr-4"></span>
            Minha Vitrine Geral
          </h2>
          <div className="flex gap-4">
             <button className="px-6 py-2 bg-amber-400 text-gray-900 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">Tudo</button>
             <button className="px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full text-xs font-black uppercase tracking-widest hover:bg-amber-50 transition-colors">Tech</button>
             <button className="px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full text-xs font-black uppercase tracking-widest hover:bg-amber-50 transition-colors">Setup</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {products.filter(p => p.category !== "Action Figures").map(product => (
            <div key={product.id} className="group bg-white dark:bg-[#161b22] rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-500 relative">
              
              {isAuthenticated && (
                <button 
                  onClick={(e) => { e.preventDefault(); toggleFavorite(product.id); }}
                  className={`absolute top-6 right-6 z-20 p-2.5 md:p-3 rounded-xl md:rounded-2xl shadow-lg transition-all transform hover:scale-110 active:scale-95 ${favorites.includes(product.id) ? 'bg-amber-400 text-white' : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur text-gray-400 hover:text-amber-500'}`}
                >
                  <Heart size={18} fill={favorites.includes(product.id) ? "currentColor" : "none"} />
                </button>
              )}

              <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-900 m-2 md:m-3 rounded-[1.6rem] md:rounded-[2rem]">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/95 dark:bg-gray-800/95 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-700 shadow-sm">
                    {product.category}
                  </span>
                </div>
              </Link>
              
              <div className="p-6 md:p-8 pt-2 md:pt-4">
                <div className="flex justify-between items-start mb-2 md:mb-3">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white group-hover:text-amber-600 transition-colors line-clamp-1">{product.name}</h3>
                  </Link>
                  <div className="flex items-center text-amber-500 bg-amber-50 dark:bg-amber-400/10 px-2 py-0.5 rounded-lg md:rounded-xl border border-amber-100 dark:border-amber-900/30">
                    <Star size={12} fill="currentColor" />
                    <span className="text-[10px] font-black ml-1">{product.rating}</span>
                  </div>
                </div>
                
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 md:mb-6 h-8 md:h-10 font-medium leading-relaxed">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto border-t border-gray-50 dark:border-gray-800 pt-5 md:pt-6">
                  <div>
                    <span className="text-[9px] text-gray-400 dark:text-gray-600 font-black uppercase tracking-widest block mb-0.5">Valor Sugerido</span>
                    <p className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">
                      R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <Link 
                    to={`/product/${product.id}`}
                    className="flex items-center space-x-2 px-5 py-2.5 md:px-6 md:py-3 bg-amber-400 text-gray-900 rounded-xl md:rounded-2xl font-black hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-all duration-300 shadow-lg shadow-amber-50 dark:shadow-none text-xs md:text-sm"
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

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-gray-900 dark:bg-[#161b22] p-10 md:p-16 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
            
            <div className="flex flex-col items-center text-center space-y-4">
               <div className="bg-amber-400 p-4 rounded-3xl text-gray-900 shadow-lg shadow-amber-400/20">
                  <Box size={32} />
               </div>
               <h3 className="text-xl font-black uppercase tracking-tight">Embalagem Blindada</h3>
               <p className="text-gray-400 text-sm font-medium leading-relaxed">Seus colecionáveis viajam com proteção reforçada para chegarem perfeitos.</p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
               <div className="bg-white/10 p-4 rounded-3xl text-amber-400 backdrop-blur-md">
                  <ShieldCheck size={32} />
               </div>
               <h3 className="text-xl font-black uppercase tracking-tight">Garantia Blee</h3>
               <p className="text-gray-400 text-sm font-medium leading-relaxed">Cada peça passa por um controle de qualidade rigoroso na nossa colmeia.</p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
               <div className="bg-white/10 p-4 rounded-3xl text-amber-400 backdrop-blur-md">
                  <Sparkles size={32} />
               </div>
               <h3 className="text-xl font-black uppercase tracking-tight">Criação Única</h3>
               <p className="text-gray-400 text-sm font-medium leading-relaxed">Nada de genérico. Nossos designs são exclusivos e pensados para fãs exigentes.</p>
            </div>
         </div>
      </section>
    </div>
  );
};

export default HomePage;
