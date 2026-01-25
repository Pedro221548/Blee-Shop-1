
import React, { useState } from 'react';
import { useProducts } from '../ProductContext';
import { useAuth } from '../AuthContext';
import { Trash2, Plus, RefreshCw, Image as ImageIcon, CheckCircle, Layout, ShoppingBag, Settings, Eye, X, AlertCircle, MessageSquare, Box, Coffee, Clock, CheckCircle2, Phone, ZoomIn, Camera, Edit3, Save, RotateCcw, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CustomOrder, PortfolioItem } from '../types';

interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  onConfirm: () => void;
}

const AdminPage: React.FC = () => {
  const { 
    products, 
    orders, 
    portfolioItems,
    settings, 
    updateProduct, 
    addProduct, 
    deleteProduct, 
    resetProducts, 
    updateSettings, 
    updateOrderStatus, 
    deleteOrder,
    addPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem
  } = useProducts();
  
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'branding' | 'orders' | 'portfolio'>('products');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  
  // State para Modal de Confirmação Customizado
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    title: '',
    onConfirm: () => {},
  });

  // States para Edição de Portfólio
  const [editingPortfolioId, setEditingPortfolioId] = useState<string | null>(null);
  const [portfolioEditBuffer, setPortfolioEditBuffer] = useState<PortfolioItem | null>(null);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const openConfirm = (title: string, onConfirm: () => void) => {
    setConfirmModal({
      isOpen: true,
      title,
      onConfirm: () => {
        onConfirm();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
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
  };

  const handleAddPortfolio = () => {
    const tempId = "new_" + Date.now();
    const newItem: PortfolioItem = {
      id: tempId,
      title: "Novo Trabalho",
      category: "Geral",
      url: "https://images.unsplash.com/photo-1560762484-813fc97650a0?q=80&w=800&auto=format&fit=crop",
      createdAt: new Date().toISOString()
    };
    
    setEditingPortfolioId(tempId);
    setPortfolioEditBuffer(newItem);
    showFeedback("Preencha os dados do novo trabalho.");
  };

  const startEditingPortfolio = (item: PortfolioItem) => {
    setEditingPortfolioId(item.id);
    setPortfolioEditBuffer({ ...item });
  };

  const cancelEditingPortfolio = () => {
    setEditingPortfolioId(null);
    setPortfolioEditBuffer(null);
  };

  const savePortfolioEdit = () => {
    if (!portfolioEditBuffer) return;

    if (editingPortfolioId?.startsWith('new_')) {
      const { id, createdAt, ...data } = portfolioEditBuffer;
      addPortfolioItem(data);
    } else {
      updatePortfolioItem(portfolioEditBuffer);
    }

    setEditingPortfolioId(null);
    setPortfolioEditBuffer(null);
    showFeedback("Trabalho salvo!");
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
      {/* Custom Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100">
            <div className="bg-red-50 w-16 h-16 rounded-3xl flex items-center justify-center text-red-500 mb-6 mx-auto">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-black text-gray-900 text-center mb-2">{confirmModal.title}</h3>
            <p className="text-gray-500 text-sm text-center mb-8 font-medium">Esta ação não poderá ser desfeita na colmeia.</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={confirmModal.onConfirm}
                className="w-full bg-red-500 text-white py-4 rounded-2xl font-black text-sm hover:bg-red-600 transition-all shadow-lg shadow-red-100"
              >
                Sim, excluir
              </button>
              <button 
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="w-full bg-gray-100 text-gray-600 py-4 rounded-2xl font-black text-sm hover:bg-gray-200 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

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
            alt="Visualização" 
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
          <p className="text-gray-500 font-medium">Olá, <span className="text-amber-600">{user?.name}</span>. Controle sua vitrine e portfólio.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-2 px-4 py-2.5 bg-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-200 transition-all">
            <Eye size={16} />
            <span>Ver Site</span>
          </Link>
          <button 
            onClick={() => openConfirm('Deseja realmente resetar ?', resetProducts)}
            className="flex items-center space-x-2 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all active:scale-95"
          >
            <RefreshCw size={16} />
            <span>Resetar</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 bg-gray-100 p-1.5 rounded-2xl mb-10 w-fit">
        <button 
          onClick={() => setActiveTab('products')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'products' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <ShoppingBag size={18} />
          <span>Links Loja</span>
        </button>
        <button 
          onClick={() => setActiveTab('portfolio')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'portfolio' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Camera size={18} />
          <span>Portifólio</span>
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
          <span>Visual</span>
        </button>
      </div>

      {activeTab === 'portfolio' && (
        <div className="space-y-6 animate-slide-up">
          <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">Trabalhos do Portifólio ({portfolioItems.length})</h2>
            <button 
              onClick={handleAddPortfolio}
              disabled={editingPortfolioId !== null}
              className="flex items-center space-x-2 px-6 py-3 bg-amber-400 rounded-2xl text-sm font-bold text-gray-900 hover:bg-amber-500 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:grayscale"
            >
              <Plus size={18} />
              <span>Novo Trabalho</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Novo Trabalho sendo criado */}
            {editingPortfolioId?.startsWith('new_') && portfolioEditBuffer && (
              <div className="bg-white border-2 border-amber-400 rounded-[2.5rem] p-6 shadow-xl animate-in zoom-in duration-300">
                <div className="flex flex-col sm:flex-row gap-6">
                   <div className="w-full sm:w-40 h-40 rounded-3xl overflow-hidden bg-gray-50 shrink-0 border border-amber-100">
                    <img src={portfolioEditBuffer.url} className="w-full h-full object-cover opacity-50" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                       <div className="space-y-1">
                        <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest ml-1">Título</label>
                        <input 
                          type="text" 
                          autoFocus
                          value={portfolioEditBuffer.title}
                          onChange={(e) => setPortfolioEditBuffer({...portfolioEditBuffer, title: e.target.value})}
                          className="w-full bg-amber-50/50 border border-amber-100 rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest ml-1">Categoria</label>
                        <input 
                          type="text" 
                          value={portfolioEditBuffer.category}
                          onChange={(e) => setPortfolioEditBuffer({...portfolioEditBuffer, category: e.target.value})}
                          className="w-full bg-amber-50/50 border border-amber-100 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest ml-1">URL da Imagem</label>
                        <input 
                          type="text" 
                          value={portfolioEditBuffer.url}
                          onChange={(e) => setPortfolioEditBuffer({...portfolioEditBuffer, url: e.target.value})}
                          className="w-full bg-amber-50/50 border border-amber-100 rounded-xl px-4 py-2 text-[10px] focus:ring-2 focus:ring-amber-500 outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4 border-t border-amber-50 mt-4">
                      <button onClick={cancelEditingPortfolio} className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                        <X size={18} />
                      </button>
                      <button onClick={savePortfolioEdit} className="flex items-center space-x-2 px-5 py-2.5 bg-amber-400 text-gray-900 rounded-xl hover:bg-amber-500 transition-all shadow-md font-bold text-xs">
                        <Save size={16} />
                        <span>Salvar Novo</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {portfolioItems.map(item => {
              const isEditing = editingPortfolioId === item.id;
              const displayData = isEditing ? portfolioEditBuffer! : item;

              return (
                <div key={item.id} className={`bg-white border rounded-[2.5rem] p-6 transition-all duration-300 ${isEditing ? 'border-amber-400 ring-4 ring-amber-50 shadow-2xl' : 'border-gray-100 hover:border-gray-200 shadow-sm'}`}>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="w-full sm:w-40 h-40 rounded-3xl overflow-hidden bg-gray-50 shrink-0 cursor-pointer group relative border border-gray-50" onClick={() => !isEditing && setViewingImage(displayData.url)}>
                      <img src={displayData.url} className={`w-full h-full object-cover transition-transform duration-500 ${isEditing ? 'scale-105 brightness-90' : 'group-hover:scale-110'}`} />
                      {!isEditing && (
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ZoomIn className="text-white" size={24} />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-4">
                        {isEditing ? (
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest ml-1">Título</label>
                              <input 
                                type="text" 
                                value={displayData.title}
                                onChange={(e) => setPortfolioEditBuffer({...portfolioEditBuffer!, title: e.target.value})}
                                className="w-full bg-amber-50/30 border border-amber-100 rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest ml-1">Categoria</label>
                              <input 
                                type="text" 
                                value={displayData.category}
                                onChange={(e) => setPortfolioEditBuffer({...portfolioEditBuffer!, category: e.target.value})}
                                className="w-full bg-amber-50/30 border border-amber-100 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest ml-1">Link da Imagem</label>
                              <input 
                                type="text" 
                                value={displayData.url}
                                onChange={(e) => setPortfolioEditBuffer({...portfolioEditBuffer!, url: e.target.value})}
                                className="w-full bg-amber-50/30 border border-amber-100 rounded-xl px-4 py-2 text-[10px] focus:ring-2 focus:ring-amber-500 outline-none"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="pt-2">
                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100 mb-2 inline-block">
                              {item.category}
                            </span>
                            <h3 className="text-xl font-black text-gray-900 leading-tight line-clamp-2">{item.title}</h3>
                          </div>
                        )}
                      </div>

                      <div className={`flex justify-end space-x-2 pt-4 border-t mt-4 transition-colors ${isEditing ? 'border-amber-100' : 'border-gray-50'}`}>
                        {isEditing ? (
                          <>
                            <button onClick={cancelEditingPortfolio} className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all" title="Cancelar">
                              <RotateCcw size={18} />
                            </button>
                            <button onClick={savePortfolioEdit} className="flex items-center space-x-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-amber-500 transition-all shadow-md font-bold text-xs">
                              <Save size={16} />
                              <span>Salvar</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => openConfirm('Deseja realmente excluir ?', () => deletePortfolioItem(item.id))}
                              className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                              title="Remover"
                            >
                              <Trash2 size={20} />
                            </button>
                            <button 
                              onClick={() => startEditingPortfolio(item)}
                              disabled={editingPortfolioId !== null}
                              className="p-3 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all disabled:opacity-20"
                              title="Editar"
                            >
                              <Edit3 size={20} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
                      <button 
                        onClick={() => openConfirm('Deseja realmente excluir ?', () => deleteProduct(product.id))}
                        className="p-4 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                      >
                        <Trash2 size={24} />
                      </button>
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

      {activeTab === 'branding' && (
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm animate-slide-up">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center">
              <Settings className="mr-3 text-amber-500" size={24} />
              Identidade Visual
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
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Tagline</label>
                  <input 
                    type="text" 
                    value={settings.storeTagline}
                    onChange={(e) => updateSettings({...settings, storeTagline: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all font-bold"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Banner Principal URL</label>
                <input 
                  type="text" 
                  value={settings.heroImageUrl}
                  onChange={(e) => updateSettings({...settings, heroImageUrl: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map(order => (
               <div key={order.id} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                  <div className={`px-6 py-3 border-b border-gray-50 text-[10px] font-black uppercase tracking-widest flex justify-between items-center ${getStatusStyle(order.status)}`}>
                    <div className="flex items-center space-x-2">
                      <Clock size={12} />
                      <span>{order.status === 'pending' ? 'Pendente' : order.status === 'contacted' ? 'Em Contato' : 'Finalizado'}</span>
                    </div>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="p-6">
                    <h4 className="font-black text-gray-900">{order.customerName}</h4>
                    <p className="text-xs text-gray-500 mb-4">{order.customerEmail}</p>
                    <p className="text-sm italic mb-6">"{order.description}"</p>
                    <div className="flex gap-2">
                      <button onClick={() => window.open(`https://wa.me/${order.phone.replace(/\D/g, '')}`, '_blank')} className="flex-1 bg-green-500 text-white py-2 rounded-xl text-xs font-bold">WhatsApp</button>
                      <button onClick={() => updateOrderStatus(order.id, 'finished')} className="p-2 bg-gray-100 rounded-xl hover:bg-green-100"><CheckCircle2 size={16}/></button>
                      <button onClick={() => openConfirm('Deseja realmente excluir ?', () => deleteOrder(order.id))} className="p-2 bg-gray-100 rounded-xl hover:bg-red-100"><Trash2 size={16}/></button>
                    </div>
                  </div>
               </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
