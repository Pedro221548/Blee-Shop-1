
import React, { useState, useRef } from 'react';
import { useAuth } from '../AuthContext';
import { useProducts } from '../ProductContext';
import { Heart, Box, Coffee, Phone, Send, Clock, Trash2, ArrowRight, Star, ShoppingBag, CheckCircle2, ImagePlus, X, ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDashboard: React.FC = () => {
  const { user, favorites, toggleFavorite } = useAuth();
  const { products, addOrder } = useProducts();
  const [activeTab, setActiveTab] = useState<'favorites' | 'custom'>('custom');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Custom Order Form State
  const [orderType, setOrderType] = useState<'3d' | 'mug'>('3d');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const favProducts = products.filter(p => favorites.includes(p.id));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !phone || !user) return;
    
    addOrder({
      type: orderType,
      description,
      phone,
      image: image || undefined,
      customerName: user.name,
      customerEmail: user.email
    });
    
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDescription('');
      setPhone('');
      setImage(null);
    }, 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">ÁREA DO CLIENTE</h1>
        <p className="text-gray-500 font-medium">Bem-vindo de volta, <span className="text-amber-600 font-bold">{user?.name}</span>!</p>
      </div>

      <div className="flex space-x-2 bg-gray-100 p-1.5 rounded-2xl mb-10 w-fit">
        <button 
          onClick={() => setActiveTab('custom')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'custom' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Box size={18} />
          <span>Encomendas Especiais</span>
        </button>
        <button 
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'favorites' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Heart size={18} />
          <span>Meus Favoritos ({favProducts.length})</span>
        </button>
      </div>

      {activeTab === 'favorites' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {favProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-[2.5rem] border border-gray-100 text-center shadow-sm">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                <Heart size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum favorito ainda</h3>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">Explore nossa colmeia e marque os itens que você mais gostou para vê-los aqui!</p>
              <Link to="/" className="bg-amber-400 text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-gray-900 hover:text-white transition-all inline-block">
                Ver Vitrine
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {favProducts.map(product => (
                <div key={product.id} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all group relative">
                   <button 
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur p-2.5 rounded-xl text-red-500 shadow-sm hover:scale-110 transition-transform"
                  >
                    <Trash2 size={18} />
                  </button>
                  <Link to={`/product/${product.id}`} className="block aspect-square overflow-hidden bg-gray-50">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </Link>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                       <h4 className="font-bold text-gray-900 line-clamp-1">{product.name}</h4>
                       <div className="flex items-center text-amber-500 text-xs font-black">
                         <Star size={12} fill="currentColor" className="mr-1" />
                         {product.rating}
                       </div>
                    </div>
                    <p className="text-2xl font-black text-gray-900 mb-4">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <Link to={`/product/${product.id}`} className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold flex items-center justify-center space-x-2 text-sm hover:bg-amber-500 transition-colors">
                      <ShoppingBag size={16} />
                      <span>Ver Produto</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Info Side */}
          <div className="space-y-8">
            <div className="bg-amber-400 p-10 rounded-[3rem] text-gray-900 shadow-xl shadow-amber-100">
              <h2 className="text-3xl font-black mb-4">Peças 3D & Canecas Sob Medida</h2>
              <p className="font-medium text-amber-900 leading-relaxed opacity-90">
                Além da nossa curadoria de tecnologia, fabricamos itens exclusivos para você. 
                Seja um protótipo, um action figure ou aquela caneca com sua estampa favorita.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-white/30 backdrop-blur p-4 rounded-2xl flex flex-col items-center text-center">
                  <Box className="mb-2" size={24} />
                  <span className="text-xs font-black uppercase tracking-widest">Impressão 3D</span>
                </div>
                <div className="bg-white/30 backdrop-blur p-4 rounded-2xl flex flex-col items-center text-center">
                  <Coffee className="mb-2" size={24} />
                  <span className="text-xs font-black uppercase tracking-widest">Canecas Personalizadas</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-4 p-6 bg-white rounded-3xl border border-gray-100">
                <div className="bg-gray-100 p-3 rounded-2xl">
                  <Clock className="text-gray-500" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Prazo de Produção</h4>
                  <p className="text-sm text-gray-400 font-medium">Geralmente entre 3 a 7 dias úteis.</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-6 bg-white rounded-3xl border border-gray-100">
                <div className="bg-gray-100 p-3 rounded-2xl">
                  <CheckCircle2 className="text-gray-500" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Qualidade Garantida</h4>
                  <p className="text-sm text-gray-400 font-medium">Acabamento manual e materiais premium.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/40 relative overflow-hidden">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10 animate-in zoom-in duration-300">
                <div className="bg-green-100 p-6 rounded-full text-green-600 mb-6">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Pedido Recebido!</h3>
                <p className="text-gray-500 font-medium max-w-xs">Nossas abelhas já estão processando seu pedido. Entraremos em contato via WhatsApp em breve!</p>
              </div>
            ) : (
              <form onSubmit={handleOrderSubmit} className="space-y-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Send className="text-amber-500" size={20} />
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Solicitar Orçamento</h3>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">O que você deseja?</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      type="button"
                      onClick={() => setOrderType('3d')}
                      className={`py-4 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 border-2 transition-all ${orderType === '3d' ? 'border-amber-400 bg-amber-50 text-amber-900' : 'border-gray-100 text-gray-400'}`}
                    >
                      <Box size={16} />
                      <span>Peça 3D</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setOrderType('mug')}
                      className={`py-4 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 border-2 transition-all ${orderType === 'mug' ? 'border-amber-400 bg-amber-50 text-amber-900' : 'border-gray-100 text-gray-400'}`}
                    >
                      <Coffee size={16} />
                      <span>Caneca</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Imagem de Referência (Opcional)</label>
                  <div className="relative">
                    {image ? (
                      <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-gray-100 shadow-inner group">
                        <img src={image} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-xl shadow-lg hover:scale-110 transition-transform"
                        >
                          <X size={16} />
                        </button>
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <span className="text-white text-[10px] font-black uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">Alterar Foto</span>
                        </div>
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                    ) : (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center space-y-2 cursor-pointer hover:border-amber-400 hover:bg-amber-50/30 transition-all group"
                      >
                        <div className="bg-white p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                          <ImagePlus className="text-gray-400 group-hover:text-amber-500" size={24} />
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-amber-600">Anexar Inspiração</span>
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Detalhes do Projeto</label>
                  <textarea 
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva o que você imagina... (tamanho, cores, material)"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all font-medium resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp / Telefone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      type="tel" 
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(00) 00000-0000"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-5 py-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all font-bold"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gray-900 text-white py-5 rounded-[1.5rem] font-bold flex items-center justify-center space-x-3 hover:bg-black transition-all shadow-xl shadow-gray-200 group active:scale-95"
                >
                  <span className="text-sm">Enviar para a Oficina</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
