
import React, { useState } from 'react';
import { useProducts } from '../ProductContext';
import { useAuth } from '../AuthContext';
import { Trash2, Plus, RefreshCw, Image as ImageIcon, CheckCircle, Layout, ShoppingBag, Settings, Eye, X, AlertCircle, MessageSquare, Box, Coffee, Clock, CheckCircle2, Phone, ZoomIn, Camera, Edit3, Save, RotateCcw, AlertTriangle, Ruler, Weight, FlaskConical } from 'lucide-react';
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
  
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    title: '',
    onConfirm: () => {},
  });

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
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&h=600&auto=format&fit=crop",
      width: 15,
      height: 15,
      length: 15,
      weight: 0.5
    });
    showFeedback("Novo produto adicionado!");
  };

  const handleAddTestProduct = () => {
    addProduct({
      name: "Produto Teste MP",
      description: "Item de R$ 1,00 para testar o Mercado Pago.",
      price: 1.00,
      category: "Testes",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&h=600&auto=format&fit=crop",
      width: 10,
      height: 10,
      length: 10,
      weight: 0.1
    });
    showFeedback("Produto de teste criado!");
  };

  /* ... restante das funções do AdminPage ... */

  const getStatusStyle = (status: CustomOrder['status']) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'contacted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'finished': return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Gestão da Colmeia</h1>
          <p className="text-gray-500 font-medium">George, você está no controle. <span className="text-amber-600 font-bold">Voe alto.</span></p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleAddTestProduct}
            className="flex items-center space-x-2 px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-xl text-sm font-bold text-blue-600 hover:bg-blue-100 transition-all"
          >
            <FlaskConical size={16} />
            <span>Produto Teste</span>
          </button>
          <Link to="/" className="flex items-center space-x-2 px-4 py-2.5 bg-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-200 transition-all">
            <Eye size={16} />
            <span>Ver Site</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 bg-gray-100 p-1.5 rounded-2xl mb-10 w-fit">
        <button 
          onClick={() => setActiveTab('products')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'products' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <ShoppingBag size={18} />
          <span>Catálogo</span>
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
          <span>Pedidos 3D</span>
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

      {activeTab === 'products' && (
        <div className="space-y-6 animate-slide-up">
          <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">Produtos Ativos ({products.length})</h2>
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
                {/* ... conteúdo do card de produto (mesmo do AdminPage.tsx original) ... */}
                <div className="flex flex-col lg:flex-row gap-10">
                  <div className="w-full lg:w-56 h-56 rounded-3xl overflow-hidden bg-gray-100 border border-gray-100 shrink-0 relative group cursor-pointer" onClick={() => setViewingImage(product.image)}>
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <ZoomIn className="text-white" size={32} />
                    </div>
                  </div>

                  <div className="flex-1 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    </div>

                    <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Ruler size={14} className="text-amber-500" /> Logística (Dimensões em cm / Peso em kg)
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-500 uppercase ml-1">Largura</label>
                          <input 
                            type="number" 
                            value={product.width || 0}
                            onChange={(e) => updateProduct({...product, width: parseFloat(e.target.value) || 0})}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 outline-none font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-500 uppercase ml-1">Altura</label>
                          <input 
                            type="number" 
                            value={product.height || 0}
                            onChange={(e) => updateProduct({...product, height: parseFloat(e.target.value) || 0})}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 outline-none font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-500 uppercase ml-1">Comprimento</label>
                          <input 
                            type="number" 
                            value={product.length || 0}
                            onChange={(e) => updateProduct({...product, length: parseFloat(e.target.value) || 0})}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 outline-none font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-500 uppercase ml-1">Peso (kg)</label>
                          <input 
                            type="number" 
                            step="0.001"
                            value={product.weight || 0}
                            onChange={(e) => updateProduct({...product, weight: parseFloat(e.target.value) || 0})}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 outline-none font-bold text-amber-600"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      {/* ... outros tabs simplificados ... */}
    </div>
  );
};

export default AdminPage;
