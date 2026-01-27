
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Eye, X, Maximize, ShoppingBag, ArrowRight, CheckCircle2, Info, RotateCw, Move, Sparkles, Loader2, Download, Cpu, Zap, Lightbulb, MousePointer2, Layers } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { useProducts } from '../ProductContext';
import { Product } from '../types';
// Added missing Link import from react-router-dom
import { useNavigate, Link } from 'react-router-dom';
import { generateAIComposite } from '../geminiService';

const SimulatorPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { products } = useProducts();
  const navigate = useNavigate();
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [aiGeneratedImage, setAiGeneratedImage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);

  const messages = [
    "Nossas abelhas estão analisando a luz...",
    "Ajustando as sombras do 3D...",
    "Polinizando a imagem com realismo...",
    "George está finalizando o render...",
    "Integrando o product na sua casa..."
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBgImage(reader.result as string);
        setAiGeneratedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateAI = async () => {
    if (!bgImage || !selectedProduct) return;
    
    setIsGenerating(true);
    let msgIndex = 0;
    const interval = setInterval(() => {
      setLoadingMessage(messages[msgIndex % messages.length]);
      msgIndex++;
    }, 2000);

    try {
      const result = await generateAIComposite(bgImage, selectedProduct);
      setAiGeneratedImage(result);
    } catch (err) {
      alert("Houve um erro ao polinizar a imagem. Tente uma foto com luz mais clara!");
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
    }
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (aiGeneratedImage) return;
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !viewerRef.current || aiGeneratedImage) return;
    
    const rect = viewerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    
    setPosition({ 
      x: Math.min(Math.max(x, 0), 100), 
      y: Math.min(Math.max(y, 0), 100) 
    });
  };

  const handleDragEnd = () => setIsDragging(false);

  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      if (isDragging) e.preventDefault();
    };
    document.addEventListener('touchmove', preventDefault, { passive: false });
    return () => document.removeEventListener('touchmove', preventDefault);
  }, [isDragging]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 animate-fade-in">
        {/* Banner Hero Tech Modernizado */}
        <section className="relative pt-10 md:pt-16 pb-12 overflow-hidden px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gray-900 rounded-[3.5rem] p-8 md:p-16 lg:p-24 text-center shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-gray-800 relative overflow-hidden">
               {/* Pattern de Colmeia em Background */}
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45v-30z' fill-rule='evenodd' fill='%23ffffff'/%3E%3C/svg%3E")`, backgroundSize: '60px' }}></div>
               
               {/* Gradiente de Luz Central */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-radial-gradient from-amber-500/10 to-transparent pointer-events-none"></div>

               <div className="relative z-10 flex flex-col items-center">
                 <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-6 py-2.5 rounded-full mb-10 backdrop-blur-md animate-zoom-in">
                   <div className="flex -space-x-2">
                     <div className="w-5 h-5 rounded-full bg-amber-400 border-2 border-gray-900"></div>
                     <div className="w-5 h-5 rounded-full bg-indigo-500 border-2 border-gray-900"></div>
                   </div>
                   <span className="text-[10px] font-black text-amber-400 uppercase tracking-[0.4em]">Powered by Gemini 2.5</span>
                 </div>

                 <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
                   BeeView<br/><span className="text-amber-400">Simulator.</span>
                 </h1>
                 
                 <p className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto mb-14 font-medium leading-relaxed opacity-90">
                   Capture o seu ambiente e veja a mágica da <span className="text-white font-black underline decoration-amber-400 decoration-4 underline-offset-8">IA Generativa</span> fundir nossos produtos com a sua realidade.
                 </p>

                 <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button 
                      onClick={() => navigate('/login')}
                      className="w-full sm:w-auto bg-amber-400 text-gray-900 px-14 py-6 rounded-3xl font-black text-lg shadow-[0_20px_40px_-10px_rgba(251,191,36,0.3)] hover:bg-white hover:scale-105 transition-all active:scale-95 flex items-center justify-center space-x-4 group"
                    >
                      <span>Simular Agora com IA</span>
                      <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                    <Link 
                      to="/produtos" 
                      className="text-white/60 hover:text-white font-bold text-sm uppercase tracking-widest px-8 py-4 transition-colors"
                    >
                      Explorar Catálogo
                    </Link>
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* Seção Explicativa Visual */}
        <section className="max-w-7xl mx-auto px-6 py-20">
           <div className="text-center mb-20">
              <h2 className="text-xs font-black text-amber-500 uppercase tracking-[0.5em] mb-4">Fluxo de Trabalho</h2>
              <h3 className="text-4xl font-black text-gray-900 tracking-tight">Três passos para o realismo total</h3>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Linhas Conectoras (Desktop) */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gray-200 -z-10 translate-y-[-50px]"></div>

              <div className="relative flex flex-col items-center text-center group">
                <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mb-8 border border-gray-100 group-hover:scale-110 group-hover:bg-amber-400 transition-all duration-500">
                  <Camera className="text-amber-500 group-hover:text-gray-900 transition-colors" size={40} />
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-gray-900 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-lg">1</div>
                </div>
                <h4 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Captura Real</h4>
                <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-xs">
                  Você tira uma foto do seu cômodo (mesa, prateleira ou chão). A IA lerá a luz e as texturas.
                </p>
              </div>

              <div className="relative flex flex-col items-center text-center group">
                <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mb-8 border border-gray-100 group-hover:scale-110 group-hover:bg-amber-400 transition-all duration-500">
                  <MousePointer2 className="text-amber-500 group-hover:text-gray-900 transition-colors" size={40} />
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-gray-900 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-lg">2</div>
                </div>
                <h4 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Posicionamento</h4>
                <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-xs">
                  Escolha o item Bee e arraste para o local desejado. Ajuste a escala e rotação manualmente.
                </p>
              </div>

              <div className="relative flex flex-col items-center text-center group">
                <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mb-8 border border-gray-100 group-hover:scale-110 group-hover:bg-amber-400 transition-all duration-500">
                  <Layers className="text-amber-500 group-hover:text-gray-900 transition-colors" size={40} />
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-gray-900 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-lg">3</div>
                </div>
                <h4 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Polinização IA</h4>
                <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-xs">
                  Nossa IA processa a fusão, criando sombras de contato e reflexos reais. O resultado é uma foto impossível!
                </p>
              </div>
           </div>
        </section>

        {/* Banner de Diferenciação */}
        <section className="max-w-6xl mx-auto px-6 mt-12 mb-20">
          <div className="bg-amber-50 border border-amber-200 rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center gap-12">
             <div className="flex-1 space-y-6">
                <div className="inline-block bg-amber-400 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">Diferencial Blee</div>
                <h3 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter leading-tight">Não é apenas um adesivo na tela.</h3>
                <p className="text-gray-600 font-medium leading-relaxed">
                  Diferente de simuladores comuns que apenas sobrepõem o produto, o **BeeView IA** reconstrói o objeto dentro do seu cenário, corrigindo perspectiva e criando sombras que tocam a sua mesa.
                </p>
                <div className="flex items-center space-x-6 pt-4">
                   <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sombras Reais</span>
                   </div>
                   <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reflexos Dinâmicos</span>
                   </div>
                </div>
             </div>
             <div className="w-full md:w-80 aspect-square bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden relative group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                   <div>
                      <Sparkles className="text-amber-400 mx-auto mb-4" size={48} />
                      <p className="text-white font-black text-xl uppercase tracking-tighter">O Próximo Nível da Simulação</p>
                   </div>
                </div>
             </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden relative">
             <div className="p-4 md:p-5 border-b border-gray-50 flex items-center justify-between bg-white/80 backdrop-blur sticky top-0 z-10">
               <div className="flex items-center space-x-3">
                 <div className="bg-amber-400 p-2 rounded-xl text-white shadow-sm shrink-0">
                   <Eye size={18} />
                 </div>
                 <h2 className="text-[11px] md:text-xs font-black uppercase tracking-widest text-gray-900 truncate max-w-[120px] md:max-w-none">
                   {aiGeneratedImage ? 'Render Realista' : 'Preview BeeView'}
                 </h2>
               </div>
               <div className="flex gap-2">
                 {aiGeneratedImage && (
                   <button 
                     onClick={() => setAiGeneratedImage(null)} 
                     className="flex items-center space-x-2 px-3 py-2 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black hover:bg-amber-100 transition-colors whitespace-nowrap"
                   >
                     <RotateCw size={14} />
                     <span className="hidden sm:inline uppercase">Ajustar Manual</span>
                     <span className="sm:hidden uppercase">Ajustar</span>
                   </button>
                 )}
                 {bgImage && (
                   <button 
                    onClick={() => {setBgImage(null); setSelectedProduct(null); setAiGeneratedImage(null);}} 
                    className="flex items-center space-x-2 px-3 py-2 bg-red-50 text-red-500 rounded-xl text-[10px] font-black hover:bg-red-100 transition-colors uppercase tracking-widest"
                   >
                     <X size={14} />
                     <span>Limpar</span>
                   </button>
                 )}
               </div>
             </div>

             <div 
               ref={viewerRef}
               className="aspect-[4/3] md:aspect-[16/9] bg-gray-100 relative overflow-hidden flex items-center justify-center select-none touch-none"
               onMouseMove={handleDragMove}
               onTouchMove={handleDragMove}
               onMouseUp={handleDragEnd}
               onTouchEnd={handleDragEnd}
             >
               {isGenerating && (
                 <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center text-center p-6">
                   <div className="relative mb-4">
                     <Loader2 className="text-amber-400 animate-spin" size={48} />
                     <Sparkles className="absolute -top-1 -right-1 text-white animate-pulse" size={18} />
                   </div>
                   <p className="text-lg font-black text-white mb-1 animate-pulse">{loadingMessage}</p>
                   <p className="text-[10px] text-amber-200 font-bold uppercase tracking-[0.2em]">IA Blee processando...</p>
                 </div>
               )}

               {aiGeneratedImage ? (
                 <div className="w-full h-full relative group">
                   <img src={aiGeneratedImage} className="w-full h-full object-cover animate-in fade-in duration-1000" alt="Resultado IA" />
                   <div className="absolute bottom-4 right-4 flex gap-2">
                      <a 
                        href={aiGeneratedImage} 
                        download="meu-ambiente-blee.png" 
                        className="bg-white/90 backdrop-blur p-3 rounded-xl text-gray-900 shadow-2xl hover:bg-white transition-all active:scale-95"
                        title="Baixar Imagem"
                      >
                        <Download size={20} />
                      </a>
                   </div>
                 </div>
               ) : bgImage ? (
                 <>
                   <img src={bgImage} className="w-full h-full object-cover" alt="Seu Ambiente" />
                   {selectedProduct && (
                     <div 
                       className={`absolute cursor-grab active:cursor-grabbing group ${isDragging ? 'cursor-grabbing' : ''}`}
                       style={{
                         left: `${position.x}%`,
                         top: `${position.y}%`,
                         transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
                         filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))'
                       }}
                       onMouseDown={handleDragStart}
                       onTouchStart={handleDragStart}
                     >
                       <img src={selectedProduct.image} className="w-32 md:w-56 h-auto rounded-2xl pointer-events-none group-hover:border-amber-400 border-2 border-transparent transition-colors" alt={selectedProduct.name} />
                       <div className="absolute -inset-3 border-2 border-dashed border-amber-400 opacity-0 group-hover:opacity-100 rounded-[1.5rem] transition-all flex items-center justify-center">
                         <Move size={12} className="text-amber-400" />
                       </div>
                     </div>
                   )}
                 </>
               ) : (
                 <div className="text-center p-8">
                   <div className="bg-white w-20 h-20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl">
                     <Camera size={32} className="text-amber-500" />
                   </div>
                   <h3 className="text-xl font-black text-gray-900 mb-4 tracking-tight">Foto do seu espaço</h3>
                   <button onClick={() => fileInputRef.current?.click()} className="bg-amber-400 text-gray-900 px-8 py-4 rounded-xl font-black flex items-center space-x-2 mx-auto shadow-lg hover:bg-amber-500 transition-all active:scale-95">
                     <Upload size={18} />
                     <span className="text-xs uppercase">Subir Foto</span>
                   </button>
                   <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                 </div>
               )}
             </div>

             {bgImage && selectedProduct && !aiGeneratedImage && (
               <div className="p-6 bg-amber-400 flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-4">
                  <div className="text-center md:text-left text-gray-900">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-0.5">Tudo pronto?</p>
                    <h4 className="text-sm font-black uppercase">Ativar Inteligência Artificial</h4>
                  </div>
                  <button 
                    onClick={handleGenerateAI}
                    disabled={isGenerating}
                    className="w-full md:w-auto bg-gray-900 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center space-x-3 shadow-xl hover:bg-black active:scale-95 transition-all group"
                  >
                    <Sparkles className="group-hover:rotate-12 transition-transform" size={18} />
                    <span className="text-xs uppercase tracking-tight">Gerar IA Realista</span>
                    <ArrowRight size={16} />
                  </button>
               </div>
             )}
          </div>
          
          {!aiGeneratedImage && bgImage && selectedProduct && (
             <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Escala</label>
                    <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{(scale * 100).toFixed(0)}%</span>
                  </div>
                  <input type="range" min="0.2" max="3" step="0.05" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Rotação</label>
                    <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{rotation}°</span>
                  </div>
                  <input type="range" min="0" max="360" step="1" value={rotation} onChange={(e) => setRotation(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                </div>
             </div>
          )}
        </div>

        <div className="lg:w-80 shrink-0">
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 sticky top-24 max-h-[calc(100vh-8rem)] flex flex-col">
            <h3 className="text-base font-black text-gray-900 mb-5 flex items-center space-x-3 shrink-0">
              <div className="bg-gray-50 p-2 rounded-lg">
                <ShoppingBag size={18} className="text-amber-500" />
              </div>
              <span className="uppercase text-xs tracking-widest">Itens Bee</span>
            </h3>
            
            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-3 mb-5">
              {products.map(product => (
                <button 
                  key={product.id}
                  onClick={() => {setSelectedProduct(product); setAiGeneratedImage(null);}}
                  className={`w-full flex items-center p-3 rounded-2xl border-2 transition-all text-left group ${selectedProduct?.id === product.id ? 'border-amber-400 bg-amber-50 shadow-md' : 'border-gray-50 hover:border-amber-100 bg-gray-50/50'}`}
                >
                  <img src={product.image} className="w-12 h-12 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" alt="" />
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-[11px] truncate">{product.name}</p>
                    <p className="text-[8px] font-black text-amber-600 uppercase tracking-widest mt-0.5">{product.category}</p>
                  </div>
                  {selectedProduct?.id === product.id && <CheckCircle2 size={14} className="text-amber-500 ml-1 shrink-0" />}
                </button>
              ))}
            </div>

            {selectedProduct && (
              <div className="pt-4 border-t border-gray-100 shrink-0">
                <div className="mb-4">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Selecionado</p>
                  <h4 className="font-black text-gray-900 text-xs truncate">{selectedProduct.name}</h4>
                </div>
                <button 
                  onClick={() => navigate(`/product/${selectedProduct.id}`)} 
                  className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-black transition-all shadow-md active:scale-95"
                >
                  Ver Detalhes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulatorPage;
