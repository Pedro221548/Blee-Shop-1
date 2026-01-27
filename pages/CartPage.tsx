
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ArrowRight, Truck, Loader2, Box, CreditCard, Search, ShieldCheck } from 'lucide-react';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';
import { calculateShippingRates } from '../shippingService';
import { ShippingOption } from '../types';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart, setSelectedShipping, selectedShipping, cep, setCep } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [calculating, setCalculating] = useState(false);

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

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="bg-white rounded-[4rem] p-16 border border-gray-100 max-w-2xl mx-auto shadow-2xl">
          <div className="bg-amber-100 w-32 h-32 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-amber-500 shadow-xl rotate-12">
            <Box size={56} />
          </div>
          <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tighter uppercase">Cesta Vazia</h2>
          <button onClick={() => navigate('/')} className="bg-[#12141d] text-white px-12 py-6 rounded-2xl font-black hover:bg-amber-400 hover:text-gray-900 transition-all flex items-center justify-center space-x-4 mx-auto uppercase tracking-widest text-sm">
            <ArrowLeft size={20} />
            <span>Voltar para a Vitrine</span>
          </button>
        </div>
      </div>
    );
  }

  const totalComFrete = cartTotal + (selectedShipping?.price || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in pb-32 lg:pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase leading-none">Minha <span className="text-amber-500">Cesta</span></h1>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.3em] mt-4">{cart.length} itens prontos para o voo</p>
        </div>
        <button onClick={clearCart} className="text-gray-400 hover:text-red-500 font-black text-[10px] uppercase tracking-widest flex items-center space-x-2 transition-all">
          <Trash2 size={16} />
          <span>Limpar Tudo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-8 space-y-6">
          {cart.map(item => (
            <div key={item.id} className="bg-white rounded-[2.5rem] p-6 flex flex-col sm:flex-row items-center border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-28 h-28 bg-gray-50 rounded-2xl overflow-hidden shrink-0 mb-4 sm:mb-0 border border-gray-100">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="sm:ml-8 flex-1 w-full">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">{item.name}</h3>
                    <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-widest">{item.category}</span>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2"><Trash2 size={20}/></button>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-1 border border-gray-100">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-white rounded-lg transition-all"><Minus size={14}/></button>
                    <span className="w-6 text-center font-black text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-white rounded-lg transition-all"><Plus size={14}/></button>
                  </div>
                  <span className="text-2xl font-black text-gray-900">R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Truck size={18} className="text-amber-500" /> Calcular Entrega
            </h3>
            <div className="flex gap-3 mb-6">
              <input 
                type="text" 
                placeholder="00000000"
                value={cep}
                onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-amber-400 outline-none"
                maxLength={8}
              />
              <button onClick={handleCalculateShipping} disabled={calculating || cep.length < 8} className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-400 hover:text-gray-900 transition-all disabled:opacity-50">
                {calculating ? <Loader2 size={18} className="animate-spin" /> : "Calcular"}
              </button>
            </div>
            
            {options.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {options.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedShipping(opt)}
                    className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all text-left ${selectedShipping?.id === opt.id ? 'border-amber-400 bg-amber-50' : 'border-gray-50 bg-white hover:border-amber-200'}`}
                  >
                    <div>
                      <p className="text-[10px] font-black text-gray-900 uppercase">{opt.company} — {opt.name}</p>
                      <p className="text-[8px] text-gray-400 font-bold uppercase">{opt.delivery_time} dias</p>
                    </div>
                    <span className="font-black text-amber-600">R$ {opt.price.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="hidden lg:block lg:col-span-4 sticky top-28">
          <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-2xl">
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-8">Resumo do Pedido</h3>
            <div className="space-y-4 border-b border-gray-100 pb-8 mb-8">
              <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span>Subtotal</span>
                <span className="text-gray-900">R$ {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span>Frete</span>
                <span className={selectedShipping ? 'text-amber-600' : 'text-gray-300'}>
                  {selectedShipping ? `R$ ${selectedShipping.price.toFixed(2)}` : 'A calcular'}
                </span>
              </div>
            </div>
            <div className="mb-10">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Total do Voo</span>
              <p className="text-4xl font-black text-gray-900 tracking-tighter">R$ {totalComFrete.toFixed(2)}</p>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={!selectedShipping}
              className={`w-full py-6 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center space-x-3 ${selectedShipping ? 'bg-amber-400 text-gray-900 hover:bg-gray-900 hover:text-white' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
            >
              <span>Finalizar Compra</span>
              <ArrowRight size={20} />
            </button>
            <div className="mt-6 flex items-center justify-center gap-4 grayscale opacity-40">
              <img src="https://logodeposito.com/wp-content/uploads/2021/07/mercado-pago-logo.png" className="h-4" alt="MP" />
              <ShieldCheck size={18} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
