
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, CheckCircle2, Loader2, Lock, ArrowRight, ShieldCheck, AlertCircle, UserCheck, HelpCircle, FlaskConical } from 'lucide-react';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';

const MP_PUBLIC_KEY = 'TEST-871d0708-7da1-4d38-b0cd-67d1e1af3485'; 

const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, clearCart, selectedShipping } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  const [form, setForm] = useState({ 
    nome: user?.name || '', 
    email: user?.email || '', 
    endereco: '' 
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    }
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [isAuthenticated, cart, navigate]);

  const handleSimulatedSuccess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      clearCart();
      navigate('/dashboard');
      alert("🎉 Compra simulada com sucesso! Em um ambiente de produção com o server.js rodando, você seria levado ao Mercado Pago.");
    }, 2000);
  };

  const handleRealPaymentFlow = async () => {
    if (!form.nome || !form.endereco) {
      alert("Por favor, preencha o endereço de entrega.");
      return;
    }

    setIsProcessing(true);

    try {
      // O endpoint abaixo deve estar rodando via node server.js
      const backendUrl = 'http://localhost:3000';
      
      const response = await fetch(`${backendUrl}/criar-pagamento`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({
            title: item.name,
            unit_price: item.price,
            quantity: item.quantity
          })),
          shippingPrice: selectedShipping?.price || 0,
          customer: {
            name: form.nome,
            email: form.email
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        // @ts-ignore
        const mp = new window.MercadoPago(MP_PUBLIC_KEY, { locale: 'pt-BR' });
        mp.checkout({
          preference: { id: data.preferenceId },
          autoOpen: true,
        });
      } else {
        throw new Error("Servidor Off");
      }
    } catch (error) {
      console.warn("Servidor local não detectado. Ativando modo de simulação.");
      setIsDemoMode(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const totalGeral = cartTotal + (selectedShipping?.price || 0);

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="lg:grid lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-8 space-y-8">
          {isDemoMode && (
            <div className="bg-amber-50 border-2 border-amber-200 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-6 animate-zoom-in shadow-xl shadow-amber-100/50">
              <div className="bg-amber-400 p-4 rounded-3xl text-white shadow-lg shrink-0">
                <HelpCircle size={32} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Fluxo Automático Ativado</h4>
                <p className="text-sm text-gray-600 font-medium mt-1">
                  O sistema de pagamento real requer o `server.js` ativo. Deseja simular a finalização automática agora?
                </p>
                <button 
                  onClick={handleSimulatedSuccess}
                  className="mt-4 bg-gray-900 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 mx-auto md:mx-0"
                >
                  <FlaskConical size={14} />
                  <span>Finalizar Teste</span>
                </button>
              </div>
            </div>
          )}

          <section className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-gray-900">
              <MapPin className="text-amber-500" /> Entrega do Pedido
            </h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Quem recebe?</label>
                <input 
                  className="w-full bg-gray-50 p-5 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-amber-400 font-bold"
                  value={form.nome}
                  onChange={e => setForm({...form, nome: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Endereço Completo</label>
                <input 
                  placeholder="Rua, Número, Bairro, Cidade - UF" 
                  className="w-full bg-gray-50 p-5 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-amber-400 font-bold"
                  value={form.endereco}
                  onChange={e => setForm({...form, endereco: e.target.value})}
                />
              </div>
            </div>
          </section>

          <section className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-gray-900">
              <CreditCard className="text-blue-600" /> Pagamento
            </h2>
            
            <div className="bg-gray-50 rounded-[2.5rem] p-10 border-2 border-dashed border-gray-200 flex flex-col items-center text-center">
              <img src="https://logodeposito.com/wp-content/uploads/2021/07/mercado-pago-logo.png" className="h-10 mb-6" alt="MP" />
              <p className="text-gray-500 text-sm font-medium mb-8 max-w-sm">
                Ao clicar abaixo, você será levado ao ambiente seguro para pagar com Pix, Cartão ou Boleto.
              </p>
              
              <button 
                onClick={handleRealPaymentFlow}
                disabled={isProcessing}
                className="w-full max-w-md bg-blue-600 text-white py-6 rounded-3xl font-black text-xl uppercase tracking-[0.2em] hover:bg-blue-700 shadow-2xl transition-all flex items-center justify-center gap-4 disabled:opacity-50 active:scale-95 group"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    <span>Pagar R$ {totalGeral.toFixed(2)}</span>
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-[#12141d] text-white p-10 rounded-[3.5rem] sticky top-28 shadow-2xl border border-white/5 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <h3 className="text-xl font-black mb-8 uppercase tracking-tighter border-b border-white/10 pb-4">Itens da Cesta</h3>
            <div className="space-y-4 mb-10 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm items-center">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-200 truncate max-w-[150px]">{item.name}</span>
                    <span className="text-[10px] text-gray-500 uppercase font-black">{item.quantity} un.</span>
                  </div>
                  <span className="font-black text-amber-400">R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm text-gray-400 pt-4 border-t border-white/10">
                <span className="font-bold">Logística</span>
                <span className="font-black text-white">R$ {selectedShipping?.price.toFixed(2) || '0.00'}</span>
              </div>
            </div>
            <div className="text-center pt-6 border-t border-white/10">
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest leading-none">Total a Pagar</span>
              <p className="text-5xl font-black mt-3 tracking-tighter">R$ {totalGeral.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
