
import React, { useState } from 'react';
import { useProducts } from '../ProductContext';
import { useAuth } from '../AuthContext';
import { Trash2, Plus, RefreshCw, Image as ImageIcon, CheckCircle, Layout, ShoppingBag, Settings, Eye, X, AlertCircle, MessageSquare, Box, Coffee, Clock, CheckCircle2, Phone, ZoomIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CustomOrder } from '../types';

const AdminPage: React.FC = () => {
  const { products, orders, settings, updateProduct, addProduct, deleteProduct, resetProducts, updateSettings, updateOrderStatus, deleteOrder } = useProducts();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'branding' | 'orders'>('products');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleAddProduct = () => {
    addProduct({
      name: "Novo Produto",
      description: "Descreva seu novo item aqui...",
      price: 0,
      category: "Geral",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&h=600&auto=format&fit=crop"
    });
    showFeedback("Novo produto adicionado!");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    if (window.confirm("Isso apagará todas as suas edições personalizadas. Deseja resetar o catálogo para o padrão?")) {
      resetProducts();
      showFeedback("Catálogo resetado.");
    }
  };

  const confirmDelete = (id: number) => {
    deleteProduct(id);
    setDeletingId(null);
    showFeedback("Produto removido com sucesso.");
  };

  const openWhatsApp = (phone: string, description: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Olá! Sou da Blee Shop. Vi sua solicitação para: ${description}. Podemos conversar?`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const getStatusStyle = (status: CustomOrder['status']) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'contacted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'finished': return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Image Modal Viewer */}
      {viewingImage && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setViewingImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 bg-white/10 rounded-full"
            onClick={() => setViewingImage(null)}
          >
            <X size={32} />
          </button>
          <img 
            src={viewingImage} 
            alt="Referência do cliente" 
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {feedback && (
        <div className="fixed bottom-10 right-10 z-[100] bg-gray-900 text-white px-6 py-4 rounded-2xl font-bold shadow-2xl flex items-center space-x-3 animate-slide-up">
          <CheckCircle className="text-amber-400" size={20} />
          <span>{feedback}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">ADMINISTRAÇÃO</h1>
          <p className="text-gray-500 font-medium">Olá, <span className="text-amber-600">{user?.name}</span>. Controle sua vitrine e personalize a experiência.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-2 px-4 py-2.5 bg-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-200 transition-all">
            <Eye size={16} />
            <span>Ver Site</span>
          </Link>
          <button 
            onClick={handleReset}
            className="flex items-center space-x-2 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all active:scale-95"
          >
            <RefreshCw size={16} />
            <span>Limpar Tudo</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 bg-gray-100 p-1.5 rounded-2xl mb-10 w-fit">
        <button 
          onClick={() => setActiveTab('products')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'products' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <ShoppingBag size={18} />
          <span>Configurar Links</span>
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm transition-all relative ${activeTab === 'orders' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <MessageSquare size={18} />
          <span>Solicitações</span>
          {orders.filter(o => o.status === 'pending').length > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
              {orders.filter(o => o.status === 'pending').length}
            </span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('branding')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'branding' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Layout size={18} />
          <span>Identidade Visual</span>
        </button>
      </div>

      {activeTab === 'branding' && (
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm animate-slide-up">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center">
              <Settings className="mr-3 text-amber-500" size={24} />
              Configurações da Vitrine
            </h2>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Nome da Loja</label>
                  <input 
                    type="text" 
                    value={settings.storeName}
                    onChange={(e) => updateSettings({...settings, storeName: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Tagline (Rodapé)</label>
                  <input 
                    type="text" 
                    value={settings.storeTagline}
                    onChange={(e) => updateSettings({...settings, storeTagline: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Título do Banner (Bold)</label>
                  <input 
                    type="text" 
                    value={settings.heroTitle}
                    onChange={(e) => updateSettings({...settings, heroTitle: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-amber-500 uppercase tracking-widest">Destaque do Banner (Colorido)</label>
                  <input 
                    type="text" 
                    value={settings.heroHighlight}
                    onChange={(e) => updateSettings({...settings, heroHighlight: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all font-bold text-amber-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Descrição do Banner</label>
                <textarea 
                  rows={3}
                  value={settings.heroDescription}
                  onChange={(e) => updateSettings({...settings, heroDescription: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none resize-none transition-all font-medium leading-relaxed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">URL da Imagem de Capa</label>
                <div className="flex gap-4 items-start">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                    <img src={settings.heroImageUrl} className="w-full h-full object-cover" />
                  </div>
                  <input 
                    type="text" 
                    value={settings.heroImageUrl}
                    onChange={(e) => updateSettings({...settings, heroImageUrl: e.target.value})}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all font-medium"
                    placeholder="Cole a URL de uma imagem..."
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-green-600 text-xs font-black bg-green-50 px-4 py-2 rounded-full border border-green-100">
                  <CheckCircle size={14} />
                  <span className="uppercase tracking-widest">Sincronizado via Firebase</span>
                </div>
                <button 
                  onClick={() => showFeedback("Configurações salvas!")}
                  className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-gray-200"
                >
                  Salvar Mudanças
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="space-y-6 animate-slide-up">
          <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">Catálogo de Produtos ({products.length})</h2>
            <button 
              onClick={handleAddProduct}
              className="flex items-center space-x-2 px-6 py-3 bg-amber-400 rounded-2xl text-sm font-bold text-gray-900 hover:bg-amber-500 transition-all shadow-lg shadow-amber-100 active:scale-95"
            >
              <Plus size={18} />
              <span>Novo Produto</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row gap-10">
                  <div className="w-full lg:w-56 h-56 rounded-3xl overflow-hidden bg-gray-100 border border-gray-100 shrink-0 relative group cursor-pointer" onClick={() => setViewingImage(product.image)}>
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <ZoomIn className="text-white" size={32} />
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Título do Item</label>
                      <input 
                        type="text" 
                        value={product.name}
                        onChange={(e) => updateProduct({...product, name: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all font-bold"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Preço Sugerido (R$)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={product.price}
                        onChange={(e) => updateProduct({...product, price: parseFloat(e.target.value) || 0})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-black text-amber-600 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Categoria</label>
                      <input 
                        type="text" 
                        value={product.category}
                        onChange={(e) => updateProduct({...product, category: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest">🔗 Link Mercado Livre</label>
                      <input 
                        type="text" 
                        value={product.mlUrl || ''}
                        placeholder="Cole o link aqui..."
                        onChange={(e) => updateProduct({...product, mlUrl: e.target.value})}
                        className="w-full bg-blue-50/50 border border-blue-100 rounded-2xl px-4 py-3 text-xs focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest">🔗 Link Shopee</label>
                      <input 
                        type="text" 
                        value={product.shopeeUrl || ''}
                        placeholder="Cole o link aqui..."
                        onChange={(e) => updateProduct({...product, shopeeUrl: e.target.value})}
                        className="w-full bg-orange-50/50 border border-orange-100 rounded-2xl px-4 py-3 text-xs focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">URL da Imagem</label>
                      <input 
                        type="text" 
                        value={product.image}
                        onChange={(e) => updateProduct({...product, image: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs focus:ring-2 focus:ring-amber-500 outline-none transition-all font-medium"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Breve descrição (Até 2 linhas)</label>
                      <textarea 
                        rows={1}
                        value={product.description}
                        onChange={(e) => updateProduct({...product, description: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none resize-none transition-all font-medium"
                      />
                    </div>

                    <div className="flex items-end justify-end space-x-3">
                      <div className="relative">
                        {deletingId === product.id ? (
                          <div className="flex items-center space-x-2 bg-blue-50 border-2 border-dashed border-blue-400 p-2.5 rounded-2xl animate-zoom-in">
                             <div className="bg-blue-100 p-1.5 rounded-lg text-blue-600">
                                <AlertCircle size={14} />
                             </div>
                             <span className="text-[10px] font-black text-blue-700 uppercase tracking-tight px-1">Excluir item?</span>
                             <button 
                                onClick={() => confirmDelete(product.id)}
                                className="bg-red-600 text-white p-2 rounded-xl hover:bg-red-700 transition-all shadow-md active:scale-90"
                             >
                                <CheckCircle size={16} />
                             </button>
                             <button 
                                onClick={() => setDeletingId(null)}
                                className="bg-white text-gray-500 p-2 rounded-xl hover:bg-gray-100 transition-all border border-gray-200"
                             >
                                <X size={16} />
                             </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setDeletingId(product.id)}
                            className="p-4 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                            title="Remover Produto"
                          >
                            <Trash2 size={24} />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-green-600 text-[10px] font-black bg-green-50 px-4 py-4 rounded-2xl border border-green-100">
                        <CheckCircle size={16} />
                        <span className="uppercase tracking-widest">SINCRONIZADO</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-6 animate-slide-up">
           <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <MessageSquare className="text-amber-500" size={24} />
              <span>Solicitações de Orçamento ({orders.length})</span>
            </h2>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white p-20 rounded-[3rem] border border-gray-100 text-center">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhuma solicitação ainda</h3>
              <p className="text-gray-500">Quando os clientes pedirem peças 3D ou canecas, elas aparecerão aqui.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {orders.map(order => (
                <div key={order.id} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                  {/* Status Bar */}
                  <div className={`px-6 py-3 border-b border-gray-50 text-[10px] font-black uppercase tracking-widest flex justify-between items-center ${getStatusStyle(order.status)}`}>
                    <div className="flex items-center space-x-2">
                      <Clock size={12} />
                      <span>{order.status === 'pending' ? 'Pendente' : order.status === 'contacted' ? 'Em Contato' : 'Finalizado'}</span>
                    </div>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-center space-x-4 mb-6">
                      <div 
                        className={`w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shrink-0 relative group ${order.image ? 'cursor-zoom-in' : ''}`}
                        onClick={() => order.image && setViewingImage(order.image)}
                      >
                        {order.image ? (
                          <>
                            <img src={order.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <ZoomIn className="text-white" size={16} />
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            {order.type === '3d' ? <Box size={24} /> : <Coffee size={24} />}
                          </div>
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="font-black text-gray-900 leading-tight truncate">{order.customerName}</h4>
                        <p className="text-[10px] font-bold text-gray-400 truncate">{order.customerEmail}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl mb-6 flex-grow">
                      <div className="flex items-center space-x-2 mb-2">
                        {order.type === '3d' ? <Box size={14} className="text-amber-500" /> : <Coffee size={14} className="text-amber-500" />}
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{order.type === '3d' ? 'Peça 3D' : 'Caneca'}</span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium line-clamp-4 leading-relaxed italic">
                        "{order.description}"
                      </p>
                    </div>

                    <div className="space-y-3">
                      <button 
                        onClick={() => openWhatsApp(order.phone, order.description)}
                        className="w-full bg-green-500 text-white py-3 rounded-xl font-bold flex items-center justify-center space-x-2 text-xs hover:bg-green-600 transition-all shadow-lg shadow-green-100"
                      >
                        <MessageSquare size={16} />
                        <span>Chamar no WhatsApp</span>
                      </button>

                      <div className="flex gap-2">
                        {order.status !== 'contacted' && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'contacted')}
                            className="flex-1 bg-blue-50 text-blue-600 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-100 transition-all border border-blue-100"
                          >
                            Marcar Contato
                          </button>
                        )}
                        {order.status !== 'finished' && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'finished')}
                            className="flex-1 bg-green-50 text-green-600 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-green-100 transition-all border border-green-100"
                          >
                            Finalizar
                          </button>
                        )}
                        <button 
                          onClick={() => { if(confirm('Excluir solicitação?')) deleteOrder(order.id); }}
                          className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all border border-red-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
