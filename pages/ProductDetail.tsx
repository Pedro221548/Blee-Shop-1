
/* ... imports permanecem iguais ... */
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, Truck, ExternalLink, ArrowLeft, MessageSquare, User, CheckCircle2, X, Loader2, ShoppingCart, ShoppingBag, Plus, Minus, CreditCard, Box, Search } from 'lucide-react';
import { useProducts } from '../ProductContext';
import { useAuth } from '../AuthContext';
import { useCart } from '../CartContext';
import { calculateShippingRates } from '../shippingService';
import { ShippingOption } from '../types';

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

  const [cep, setCep] = useState('');
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

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

  const handleCalculateShipping = async () => {
    if (cep.length < 8) return;
    setIsCalculating(true);
    try {
      // Passa as dimensões reais do produto para o cálculo
      const rates = await calculateShippingRates(cep, [{
        id: product.id.toString(),
        width: product.width || 15,
        height: product.height || 15,
        length: product.length || 15,
        weight: product.weight || 0.3,
        insurance_value: product.price,
        quantity: quantity
      }]);
      setShippingOptions(rates);
    } catch (error) {
      console.error(error);
    } finally {
      setIsCalculating(false);
    }
  };

  /* ... restante do componente permanece igual ... */
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

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 md:mb-8 flex items-center space-x-2 text-gray-400 hover:text-amber-600 font-bold transition-colors group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm">Voltar</span>
      </button>

      <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
        {/* Imagem Principal */}
        <div className="space-y-6 md:space-y-8 animate-fade-in">
          <div className="aspect-square overflow-hidden rounded-[3rem] bg-gray-50 shadow-sm border border-gray-100 group">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>

          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-6 md:p-10 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="bg-amber-100 p-2.5 rounded-2xl text-amber-600">
                  <MessageSquare size={20} />
                </div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Avaliações</h3>
              </div>
              <button 
                onClick={() => isAuthenticated ? setShowReviewForm(!showReviewForm) : navigate('/login')}
                className="text-[10px] font-black text-amber-600 uppercase tracking-widest hover:text-amber-700 bg-amber-50 px-4 py-2 rounded-full"
              >
                {showReviewForm ? 'CANCELAR' : 'AVALIAR'}
              </button>
            </div>

            {showReviewForm ? (
              <form onSubmit={handleReviewSubmit} className="space-y-5 animate-zoom-in">
                <div className="bg-gray-50 p-6 rounded-[1.5rem] border border-gray-100 text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Qual sua nota para a colmeia?</p>
                  <div className="flex justify-center space-x-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className={`transition-all transform hover:scale-125 ${star <= newRating ? 'text-amber-400' : 'text-gray-200'}`}
                      >
                        <Star size={32} fill={star <= newRating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  required
                  rows={3}
                  placeholder="Conte-nos o que achou da sua experiência..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] px-6 py-5 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all font-medium resize-none shadow-inner"
                />

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-2 shadow-xl active:scale-95 transition-all"
                >
                  {submittingReview ? <Loader2 className="animate-spin" size={18} /> : <span>Enviar Feedback</span>}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                {product.reviewsList && product.reviewsList.length > 0 ? (
                  <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {product.reviewsList.map((review) => (
                      <div key={review.id} className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 hover:bg-white transition-colors">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xs font-black text-amber-600 shadow-sm">
                              {review.userName.charAt(0)}
                            </div>
                            <div>
                                <span className="text-sm font-black text-gray-900 block">{review.userName}</span>
                                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Verificado</span>
                            </div>
                          </div>
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={10} fill={i < review.rating ? 'currentColor' : 'none'} />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed font-medium pl-1">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-xs text-gray-400 font-bold italic">Nenhum rastro de feedback por aqui ainda...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 lg:mt-0 lg:sticky lg:top-28 animate-fade-in delay-100">
          <div className="mb-4">
            <span className="text-amber-600 font-black tracking-[0.3em] uppercase text-[10px] bg-amber-50 px-4 py-2 rounded-full border border-amber-100">{product.category}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter leading-[1.1]">{product.name}</h1>
          
          <div className="flex items-center space-x-6 mb-10">
            <div className="flex items-center bg-amber-400/10 px-3 py-1.5 rounded-xl border border-amber-400/20">
              <div className="flex items-center text-amber-500 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-[11px] font-black text-amber-600">{product.rating}</span>
            </div>
            <span className="text-gray-400 text-[11px] font-black uppercase tracking-widest">({product.reviews} feedbacks na colmeia)</span>
          </div>

          <div className="mb-10 space-y-6">
            <div className="p-8 bg-[#12141d] rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <span className="text-[10px] text-amber-400 font-black uppercase tracking-[0.4em] block mb-2">Oferta Exclusiva Blee</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-5xl md:text-6xl font-black">
                  R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-gray-500 font-bold line-through">R$ {(product.price * 1.2).toFixed(2)}</span>
              </div>
              <p className="text-xs text-amber-400/60 font-black mt-4 uppercase tracking-widest">Em até 10x sem juros no checkout pro</p>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center space-x-2">
                  <Truck size={18} className="text-amber-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Logística de Entrega</span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <input 
                  type="text" 
                  maxLength={8}
                  placeholder="Seu CEP (00000000)"
                  value={cep}
                  onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                />
                <button 
                  onClick={handleCalculateShipping}
                  disabled={isCalculating || cep.length < 8}
                  className="bg-gray-900 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-400 hover:text-gray-900 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isCalculating ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                  <span className="hidden sm:inline">Calcular</span>
                </button>
              </div>

              {shippingOptions.length > 0 && (
                <div className="mt-4 space-y-2 animate-zoom-in">
                  {shippingOptions.map(option => (
                    <div key={option.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-amber-200 transition-colors">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-900 uppercase">{option.company} — {option.name}</span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Entrega em {option.delivery_time} dias</span>
                      </div>
                      <span className="font-black text-amber-600 text-sm">R$ {option.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <p className="text-gray-500 text-base md:text-lg mb-12 leading-relaxed font-medium">{product.description}</p>

          <div className="bg-white p-8 rounded-[3rem] border-4 border-gray-50 mb-10 space-y-6 shadow-xl shadow-gray-100/50">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex items-center space-x-4 bg-gray-100 p-2 rounded-2xl border border-gray-200 shadow-inner shrink-0">
                <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-white rounded-xl transition-all text-gray-400 hover:text-gray-900 shadow-sm"
                >
                    <Minus size={18} />
                </button>
                <span className="w-10 text-center font-black text-xl">{quantity}</span>
                <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-white rounded-xl transition-all text-gray-400 hover:text-gray-900 shadow-sm"
                >
                    <Plus size={18} />
                </button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                className="flex-1 w-full bg-amber-400 text-gray-900 py-6 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-900 hover:text-white transition-all shadow-xl shadow-amber-100 flex items-center justify-center space-x-3 active:scale-95"
              >
                <ShoppingCart size={20} />
                <span>Adicionar à Colmeia</span>
              </button>
            </div>
            
            <button 
                onClick={handleBuyNow}
                className="w-full bg-[#12141d] text-white py-6 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-amber-500 hover:text-gray-900 transition-all shadow-xl flex items-center justify-center space-x-3 active:scale-95"
            >
                <CreditCard size={20} />
                <span>Comprar Agora</span>
            </button>
          </div>

          <div className="space-y-4 mb-10 opacity-60 hover:opacity-100 transition-opacity">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                <span className="bg-gray-200 h-px flex-1 mr-4"></span>
                Outros Canais
                <span className="bg-gray-200 h-px flex-1 ml-4"></span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.mlUrl && (
                  <a 
                    href={product.mlUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-[#FFF159] text-gray-900 p-5 rounded-2xl font-black hover:brightness-95 transition-all shadow-sm flex items-center justify-between group text-[10px] uppercase tracking-widest"
                  >
                    <div className="flex items-center space-x-3">
                      <Box size={18} />
                      <span>Mercado Livre</span>
                    </div>
                    <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                )}

                {product.shopeeUrl && (
                  <a 
                    href={product.shopeeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-[#EE4D2D] text-white p-5 rounded-2xl font-black hover:brightness-95 transition-all shadow-sm flex items-center justify-between group text-[10px] uppercase tracking-widest"
                  >
                    <div className="flex items-center space-x-3">
                      <ShoppingBag size={18} />
                      <span>Shopee</span>
                    </div>
                    <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                )}
            </div>
          </div>
          {/* ... restante do rodapé do detalhe ... */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
