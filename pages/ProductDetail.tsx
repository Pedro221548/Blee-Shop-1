
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, Truck, ExternalLink, ArrowLeft, MessageSquare, ShoppingCart, CheckCircle2, X, Loader2, Plus, Minus, Wallet } from 'lucide-react';
import { useProducts } from '../ProductContext';
import { useAuth } from '../AuthContext';
import { useCart } from '../CartContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addProductReview } = useProducts();
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Produto fora de voo...</h2>
        <button onClick={() => navigate('/')} className="text-amber-600 font-black flex items-center space-x-2">
          <ArrowLeft size={18} />
          <span>Voltar para a Vitrine</span>
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Adiciona ao carrinho com a quantidade selecionada
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSubmittingReview(true);
    addProductReview(product.id, {
      userName: user?.name || 'Cliente',
      rating: newRating,
      comment: newComment
    });
    
    setTimeout(() => {
      setSubmittingReview(false);
      setShowReviewForm(false);
      setNewComment('');
      setNewRating(5);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 md:mb-8 flex items-center space-x-2 text-gray-400 hover:text-amber-600 font-bold transition-colors"
      >
        <ArrowLeft size={18} />
        <span className="text-sm">Voltar</span>
      </button>

      <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
        {/* Imagem Principal */}
        <div className="space-y-6 md:space-y-8">
          <div className="aspect-square overflow-hidden rounded-[2rem] md:rounded-[3.5rem] bg-gray-100 shadow-xl border border-gray-100 group relative">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute top-6 left-6">
               <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-amber-600 shadow-sm border border-amber-50">Destaque Blee</span>
            </div>
          </div>

          {/* Seção de Feedback */}
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-gray-100 p-6 md:p-10 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="bg-amber-100 p-2.5 rounded-2xl text-amber-600 shadow-inner">
                  <MessageSquare size={20} />
                </div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Avaliações</h3>
              </div>
              <button 
                onClick={() => isAuthenticated ? setShowReviewForm(!showReviewForm) : navigate('/login')}
                className="text-[10px] font-black text-amber-600 uppercase tracking-widest hover:text-amber-700 bg-amber-50 px-4 py-2 rounded-xl transition-all"
              >
                {showReviewForm ? 'Cancelar' : 'Deixar Feedback'}
              </button>
            </div>

            {showReviewForm ? (
              <form onSubmit={handleReviewSubmit} className="space-y-5 animate-zoom-in">
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Sua experiência em estrelas</p>
                  <div className="flex space-x-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className={`transition-all transform hover:scale-125 ${star <= newRating ? 'text-amber-400' : 'text-gray-200'}`}
                      >
                        <Star size={28} fill={star <= newRating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  required
                  rows={4}
                  placeholder="Conte para a colmeia o que você achou deste item..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] px-6 py-5 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all font-medium resize-none shadow-inner"
                />

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full bg-gray-900 text-white py-5 rounded-[1.5rem] font-black text-sm flex items-center justify-center space-x-2 shadow-xl hover:bg-black transition-all"
                >
                  {submittingReview ? <Loader2 className="animate-spin" size={20} /> : <span>Publicar Avaliação</span>}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                {product.reviewsList && product.reviewsList.length > 0 ? (
                  <div className="space-y-6 max-h-[400px] overflow-y-auto pr-3 custom-scrollbar">
                    {product.reviewsList.map((review) => (
                      <div key={review.id} className="bg-gray-50/50 p-5 rounded-3xl border border-gray-50/50">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center text-xs font-black text-white shadow-sm">
                              {review.userName.charAt(0)}
                            </div>
                            <div>
                              <span className="text-sm font-bold text-gray-900 block">{review.userName}</span>
                              <div className="flex text-amber-400 mt-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={10} fill={i < review.rating ? 'currentColor' : 'none'} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-[9px] text-gray-300 font-black uppercase">{new Date(review.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed font-medium">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                    <MessageSquare size={32} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-xs text-gray-400 font-bold italic">Ainda não polinizamos esta seção com comentários.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Informações e Compra */}
        <div className="mt-10 lg:mt-0 sticky top-24">
          <div className="mb-4">
            <span className="text-amber-600 font-black tracking-widest uppercase text-[10px] bg-amber-50 px-4 py-2 rounded-full border border-amber-100 shadow-sm">{product.category}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter leading-none">{product.name}</h1>
          
          <div className="flex items-center space-x-4 mb-10">
            <div className="flex items-center text-amber-500 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
              <Star size={16} fill="currentColor" className="mr-1.5" />
              <span className="font-black text-sm">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">({product.reviews} feedbacks na colmeia)</span>
          </div>

          <div className="mb-10 p-6 bg-gray-50 rounded-[2rem] border border-gray-100 inline-block min-w-[240px]">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] block mb-2">Valor da Unidade</span>
            <span className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter">
              R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <p className="text-gray-500 text-lg mb-12 leading-relaxed font-medium max-w-xl">{product.description}</p>

          {/* Botões de Ação Principais */}
          <div className="space-y-4 mb-12">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center bg-gray-100 rounded-2xl p-1 shrink-0 border border-gray-200">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-4 hover:bg-white rounded-xl transition-all text-gray-500"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-black text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-4 hover:bg-white rounded-xl transition-all text-gray-500"
                >
                  <Plus size={18} />
                </button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-gray-900 text-white px-8 py-5 rounded-[1.5rem] font-black flex items-center justify-center space-x-3 hover:bg-amber-500 hover:text-gray-900 transition-all shadow-xl active:scale-95 group"
              >
                <ShoppingCart size={20} className="group-hover:rotate-12 transition-transform" />
                <span className="uppercase tracking-widest text-xs">Adicionar ao Carrinho</span>
              </button>
            </div>

            <button 
              onClick={handleBuyNow}
              className="w-full bg-amber-400 text-gray-900 px-8 py-6 rounded-[1.5rem] font-black flex items-center justify-center space-x-3 hover:bg-amber-500 transition-all shadow-xl shadow-amber-100 active:scale-95 group"
            >
              <Wallet size={24} className="group-hover:scale-110 transition-transform" />
              <span className="uppercase tracking-[0.2em] text-sm">Comprar Agora</span>
            </button>
          </div>

          {/* Opções Externas */}
          <div className="space-y-4 mb-12 p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center">
               <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-2"></div>
               Lojas Oficiais Parceiras
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.mlUrl && (
                <a 
                  href={product.mlUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white text-gray-900 px-6 py-4 rounded-2xl font-black border border-gray-200 hover:border-[#FFF159] hover:bg-[#FFF159]/10 transition-all flex items-center justify-between group shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">📦</span>
                    <span className="text-[10px] uppercase tracking-widest">Mercado Livre</span>
                  </div>
                  <ExternalLink size={14} className="text-gray-300 group-hover:text-gray-900 transition-colors" />
                </a>
              )}

              {product.shopeeUrl && (
                <a 
                  href={product.shopeeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white text-gray-900 px-6 py-4 rounded-2xl font-black border border-gray-200 hover:border-[#EE4D2D] hover:bg-[#EE4D2D]/10 transition-all flex items-center justify-between group shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">🛍️</span>
                    <span className="text-[10px] uppercase tracking-widest">Shopee</span>
                  </div>
                  <ExternalLink size={14} className="text-gray-300 group-hover:text-gray-900 transition-colors" />
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-4 p-5 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="bg-amber-50 p-2.5 rounded-xl text-amber-500">
                <Truck size={20} />
              </div>
              <div>
                <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest block">Envio Rápido</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Logística Premium</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-5 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="bg-amber-50 p-2.5 rounded-xl text-amber-500">
                <ShieldCheck size={20} />
              </div>
              <div>
                <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest block">Compra Segura</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Certificado SSL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
