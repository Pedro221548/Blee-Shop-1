
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, Truck, ExternalLink, ArrowLeft, MessageSquare, User, CheckCircle2, X, Loader2 } from 'lucide-react';
import { useProducts } from '../ProductContext';
import { useAuth } from '../AuthContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addProductReview } = useProducts();
  const { user, isAuthenticated } = useAuth();
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

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
          <div className="aspect-square overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-gray-100 shadow-sm border border-gray-100">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {/* Seção de Feedback (Otimizada Mobile) */}
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <div className="flex items-center space-x-3">
                <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
                  <MessageSquare size={18} />
                </div>
                <h3 className="text-lg md:text-xl font-black text-gray-900 tracking-tight">Avaliações</h3>
              </div>
              <button 
                onClick={() => isAuthenticated ? setShowReviewForm(!showReviewForm) : navigate('/login')}
                className="text-[10px] font-black text-amber-600 uppercase tracking-widest hover:text-amber-700"
              >
                {showReviewForm ? 'Cancelar' : 'Avaliar'}
              </button>
            </div>

            {showReviewForm ? (
              <form onSubmit={handleReviewSubmit} className="space-y-5 animate-zoom-in">
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Qual sua nota?</p>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className={`transition-all transform hover:scale-110 ${star <= newRating ? 'text-amber-400' : 'text-gray-200'}`}
                      >
                        <Star size={22} fill={star <= newRating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  required
                  rows={3}
                  placeholder="Conte-nos o que achou..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all font-medium resize-none"
                />

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 shadow-xl shadow-gray-100"
                >
                  {submittingReview ? <Loader2 className="animate-spin" size={18} /> : <span>Enviar Avaliação</span>}
                </button>
              </form>
            ) : (
              <div className="space-y-5">
                {product.reviewsList && product.reviewsList.length > 0 ? (
                  <div className="space-y-5 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {product.reviewsList.map((review) => (
                      <div key={review.id} className="border-b border-gray-50 pb-5 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center text-[10px] font-black text-amber-600">
                              {review.userName.charAt(0)}
                            </div>
                            <span className="text-xs font-bold text-gray-900">{review.userName}</span>
                          </div>
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={8} fill={i < review.rating ? 'currentColor' : 'none'} />
                            ))}
                          </div>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed font-medium pl-9">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-xs text-gray-400 font-bold italic">Sem avaliações por enquanto...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Informações e Compra */}
        <div className="mt-10 lg:mt-0">
          <div className="mb-3">
            <span className="text-amber-600 font-black tracking-widest uppercase text-[10px] bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">{product.category}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight leading-tight">{product.name}</h1>
          
          <div className="flex items-center space-x-4 mb-8">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
              ))}
            </div>
            <span className="text-gray-400 text-xs font-bold">({product.reviews} feedbacks)</span>
          </div>

          <div className="mb-8">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] block mb-1">Preço Hoje</span>
            <span className="text-4xl md:text-5xl font-black text-gray-900">
              R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <p className="text-gray-500 text-base md:text-lg mb-10 leading-relaxed font-medium">{product.description}</p>

          <div className="space-y-4 mb-10">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-2">Compre com Segurança:</h3>
            
            {product.mlUrl && (
              <a 
                href={product.mlUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-[#FFF159] text-gray-900 px-8 py-4.5 rounded-2xl font-black hover:brightness-95 transition-all shadow-md flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <span className="bg-white p-1 rounded-lg text-lg">📦</span>
                  <span className="text-sm">Ver no Mercado Livre</span>
                </div>
                <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
            )}

            {product.shopeeUrl && (
              <a 
                href={product.shopeeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-[#EE4D2D] text-white px-8 py-4.5 rounded-2xl font-black hover:brightness-95 transition-all shadow-md flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <span className="bg-white/20 p-1 rounded-lg text-lg">🛍️</span>
                  <span className="text-sm">Ver na Shopee</span>
                </div>
                <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <Truck size={18} className="text-amber-500" />
              <span className="text-[10px] font-bold text-gray-600 uppercase">Frete conforme loja oficial</span>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <ShieldCheck size={18} className="text-amber-500" />
              <span className="text-[10px] font-bold text-gray-600 uppercase">Link 100% verificado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
