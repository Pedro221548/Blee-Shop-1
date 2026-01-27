
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ArrowRight, Truck, Info, Loader2, CheckCircle2, ShieldCheck, Box, AlertCircle, Search, UserCheck, Lock, CreditCard } from 'lucide-react';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';
import { calculateShippingRates } from '../shippingService';
import { ShippingOption } from '../types';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart, setSelectedShipping, selectedShipping } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [cep, setCep] = useState('');
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [calculating, setCalculating] = useState(false);
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    if (cep.length === 8) {
      handleCalculateShipping();
    }
  }, [cep]);

  const handleCalculateShipping = async () => {
    if (cep.length < 8 || cart.length === 0) return;
    setCalculating(true);
    try {
      const shipmentItems = cart.map(item => ({
        id: item.id.toString(),
        width: item.width || 15,
        height: item.height || 15,
        length: item.length || 15,
        weight: item.weight || 0.3,
        insurance_value: item.price,
        quantity: item.quantity
      }));

      const rates = await calculateShippingRates(cep, shipmentItems);
      setOptions(rates);
      if (rates.length > 0 && !selectedShipping) {
        setSelectedShipping(rates[0]);
      }
    } catch (error) {
      console.error("Erro ao calcular frete:", error);
    } finally {
      setCalculating(false);
    }
  };

  const handleCloseOrder = () => {
    if (!selectedShipping) {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      return;
    }

    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="bg-white rounded-[4rem] p-16 border border-gray-100 max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-50 rounded-full blur-3xl"></div>
          <div className="bg-amber-100 w-32 h-32 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-amber-500 shadow-xl rotate-12">
            <Box size={56} />
          </div>
          <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tighter uppercase">A colmeia está<br/> <span className="text-amber-500">vazia.</span></h2>
          <button 
            onClick={() => navigate('/')}
            className="bg-[#12141d] text-white px-12 py-6 rounded-2xl font-black hover:bg-amber-400 hover:text-gray-900 transition-all flex items-center justify-center space-x-4 mx-auto shadow-2xl active:scale-95 group uppercase tracking-widest text-sm"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Explorar Vitrine</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div>
          <h1 className="text-6xl font-black text-gray-900 tracking-tighter uppercase leading-none">Minha <span className="text-amber-500">Cesta</span></h1>
          <div className="flex items-center space-x-3 mt-4">
            <span className="text-gray-400 font-bold text-xs uppercase tracking-[0.3em]">{cart.length} itens prontos para o voo</span>
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
          </div>
        </div>
        <button 
          onClick={clearCart}
          className="text-gray-300 hover:text-red-500 font-black text-[10px] uppercase tracking-[0.3em] flex items-center space-x-3 transition-all border border-gray-100 px-6 py-3 rounded-2xl hover:bg-red-50 hover:border-red-100"
        >
          <Trash2 size={16} />
          <span>Limpar Tudo</span>
        </button>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-start">
        <div className="lg:col-span-7 space-y-6">
          {cart.map(item => (
            <div key={item.id} className="group bg-white rounded-[2.5rem] p-6 flex flex-col sm:flex-row items-center border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-32 h-32 bg-gray-50 rounded-3xl overflow-hidden shrink-0 mb-4 sm:mb-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="sm:ml-8 flex-1 w-full">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight">{item.name}</h3>
                    <p className="text-amber-600 text-[9px] font-black uppercase tracking-widest mt-1 bg-amber-50 px-2 py-0.5 rounded-full inline-block">{item.category}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2"><Trash2 size={20}/></button>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center space-x-3 bg-gray-50 rounded-2xl p-1 border border-gray-100">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-white rounded-lg transition-all"><Minus size={14}/></button>
                    <span className="w-6 text-center font-black">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-white rounded-lg transition-all"><Plus size={14}/></button>
                  </div>
                  <span className="text-2xl font-black text-gray-900">R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-5 mt-12 lg:mt-0">
          <div className={`bg-white rounded-[3rem] p-8 border-4 transition-all sticky top-28 shadow-2xl ${shaking ? 'border-amber-500 animate-shake shadow-amber-100' : 'border-gray-100'}`}>
            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-8 flex items-center gap-3">
              <CreditCard className="text-amber-500" /> Resumo do Pedido
            </h3>
            
            <div className="space-y-6">
              <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest">
                <span>Subtotal dos Itens</span>
                <span className="text-gray-900">R$ {cartTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>

              {/* Seção de Frete */}
              <div className="bg-gray-50 rounded-3xl p-6 space-y-4 border border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cálculo de Entrega</span>
                  <Truck size={16} className="text-amber-500" />
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Seu CEP..."
                    value={cep}
                    onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-amber-400 outline-none"
                    maxLength={8}
                  />
                  <button 
                    onClick={handleCalculateShipping}
                    disabled={calculating || cep.length < 8}
                    className="bg-gray-900 text-white px-4 py-3 rounded-xl font-black text-[10px] uppercase hover:bg-amber-400 hover:text-gray-900 transition-all disabled:opacity-50"
                  >
                    {calculating ? <Loader2 size={16} className="animate-spin" /> : "Calcular"}
                  </button>
                </div>

                {options.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {options.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedShipping(opt)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left ${selectedShipping?.id === opt.id ? 'border-amber-400 bg-white shadow-md' : 'border-transparent bg-white/50 hover:bg-white'}`}
                      >
                        <div>
                          <p className="text-[10px] font-black text-gray-900 uppercase">{opt.company} {opt.name}</p>
                          <p className="text-[8px] text-gray-400 font-bold uppercase">{opt.delivery_time} dias úteis</p>
                        </div>
                        <span className="font-black text-amber-600">R$ {opt.price.toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedShipping && (
                <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest bg-green-50 p-4 rounded-2xl border border-green-100 text-green-700">
                  <span>Frete Selecionado</span>
                  <span>R$ {selectedShipping.price.toFixed(2)}</span>
                </div>
              )}

              <div className="border-t border-gray-100 pt-6 flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Valor Total</span>
                  <p className="text-5xl font-black text-gray-900 tracking-tighter leading-none">
                    R$ {(cartTotal + (selectedShipping?.price || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {!selectedShipping && (
                <div className="bg-amber-50 text-amber-700 p-4 rounded-2xl text-[10px] font-black uppercase text-center border border-amber-100 animate-pulse">
                  Por favor, calcule e escolha o frete para continuar
                </div>
              )}

              <button 
                onClick={handleCloseOrder}
                disabled={!selectedShipping}
                className={`w-full py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-4 shadow-xl active:scale-95 group ${selectedShipping ? 'bg-amber-400 text-gray-900 hover:bg-gray-900 hover:text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                {!isAuthenticated ? (
                  <>
                    <Lock size={18} />
                    <span>Entrar para Pagar</span>
                  </>
                ) : (
                  <>
                    <span>Ir para o Pagamento</span>
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 pt-4 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                <img src="https://logodeposito.com/wp-content/uploads/2021/07/mercado-pago-logo.png" className="h-4 object-contain" alt="MP" />
                <span className="text-[8px] font-black uppercase tracking-widest">Pagamento 100% Seguro</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
