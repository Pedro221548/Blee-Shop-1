
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Eye, X, Maximize, ShoppingBag, ArrowRight, CheckCircle2, Info, RotateCw, Move, Sparkles, Loader2, Download, Cpu, Zap, Lightbulb } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { useProducts } from '../ProductContext';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';
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
    "Integrando o produto na sua casa..."
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
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Banner Hero Tech */}
        <section className="relative pt-12 md:pt-20 pb-16 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl z-0">
             <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/20 rounded-full blur-[100px]"></div>
             <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]"></div>
          </div>

          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="bg-gray-900 rounded-[3rem] p-8 md:p-20 text-center shadow-2xl shadow-gray-200 border border-gray-800 relative overflow-hidden">
               {/* Decorações Flutuantes */}
               <div className="absolute top-10 left-10 text-amber-400/20 animate-pulse hidden md:block"><Cpu size={48} /></div>
               <div className="absolute bottom-10 right-10 text-amber-400/20 animate-bounce-slow hidden md:block"><Sparkles size={48} /></div>

               <div className="inline-flex items-center space-x-2 bg-amber-400/10 border border-amber-400/20 px-4 py-2 rounded-full text-amber-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                 <Zap size={14} />
                 <span>O Futuro da Decoração</span>
               </div>

               <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-[1.1]">
                 BeeView <span className="text-amber-400 italic">Simulator</span>
               </h1>
               
               <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                 Nossa tecnologia de <span className="text-white font-black underline decoration-amber-400 underline-offset-4">Realismo Generativo</span> coloca seus produtos favoritos diretamente na sua sala com sombras e luzes reais.
               </p>

               <button 
                 onClick={() => navigate('/login')}
                 className="bg-white text-gray-900 px-12 py-5 rounded-[2rem] font-black text-lg shadow-xl hover:bg-amber-400 transition-all active:scale-95 flex items-center justify-center space-x-4 mx-auto group"
               >
                 <span>Acesse para Começar</span>
                 <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
          </div>
        </section>

        {/* Infográfico de Passos */}
        <section className="max-w-7xl mx-auto px-4 py-12">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-amber-400 transition-colors">
                  <Camera className="text-amber-500 group-hover:text-gray-900 transition-colors" size={32} />
                </div>
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-3xl font-black text-gray-100 group-hover:text-amber-100 transition-colors">01</span>
                  <h3 className="text-xl font-black text-gray-900">Captura</h3>
                </div>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">Tire uma foto do local real. Use boa iluminação para que nossas abelhas IA consigam ler o ambiente.</p>
              </div>

              <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-amber-400 transition-colors">
                  <Move className="text-amber-500 group-hover:text-gray-900 transition-colors" size={32} />
                </div>
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-3xl font-black text-gray-100 group-hover:text-amber-100 transition-colors">02</span>
                  <h3 className="text-xl font-black text-gray-900">Posição</h3>
                </div>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">Escolha um item e posicione-o na superfície desejada. Você controla a escala e a rotação manualmente.</p>
              </div>

              <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-amber-400 transition-colors">
                  <Sparkles className="text-amber-500 group-hover:text-gray-900 transition-colors" size={32} />
                </div>
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-3xl font-black text-gray-100 group-hover:text-amber-100 transition-colors">03</span>
                  <h3 className="text-xl font-black text-gray-900">Polinização</h3>
                </div>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">Clique no botão IA para gerar uma versão realista onde o produto se funde ao cenário com sombras reais.</p>
              </div>
           </div>
        </section>

        {/* Dica do Especialista */}
        <section className="max-w-4xl mx-auto px-4 mt-12">
          <div className="bg-amber-400 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-amber-100 border border-amber-300">
             <div className="bg-white/30 p-4 rounded-2xl shrink-0"><Lightbulb size={32} className="text-white" /></div>
             <p className="text-sm md:text-base font-black text-gray-900 leading-tight text-center md:text-left">
               "Nossa IA analisa texturas e luzes. Quanto melhor for a foto, mais impressionante será o resultado final da simulação!" 
               <span className="block text-[10px] mt-2 opacity-60">— George, Fundador da Blee Shop</span>
             </p>
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
