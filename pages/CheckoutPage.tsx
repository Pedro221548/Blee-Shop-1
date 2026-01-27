
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, Loader2, ArrowRight, ShieldCheck, 
  CheckCircle2, Mail, ChevronRight, Tag, Info, 
  Truck, Check, Wallet, Banknote, MapPin, AlertCircle, Sparkles,
  Smartphone, CreditCard as CardIcon
} from 'lucide-react';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';

const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, selectedShipping, cep, setCep, address, setAddress } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | 'boleto'>('pix');
  
  // Inicia no passo 1 (Entrega) para garantir que o usuário preencha os dados
  const [step, setStep] = useState<1 | 2>(1);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('Processando seu pedido seguro...');
  const numeroRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login', { state: { from: '/checkout' } });
    if (cart.length === 0) navigate('/cart');
    
    // Se o CEP está preenchido mas não temos rua, busca automaticamente
    if (cep.length === 8 && !address.logradouro) {
      buscarEndereco(cep);
    }
  }, [isAuthenticated, cart, navigate, cep]);

  const buscarEndereco = async (codigoPostal: string) => {
    setIsSearchingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${codigoPostal}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setAddress({
          ...address,
          logradouro: data.logradouro,
          bairro: data.bairro,
          localidade: data.localidade,
          uf: data.uf
        });
        // Foca no número após carregar o endereço
        setTimeout(() => numeroRef.current?.focus(), 100);
      }
    } catch (e) {
      console.error("Erro ao buscar CEP", e);
    } finally {
      setIsSearchingCep(false);
    }
  };

  const handleFinishOrder = async () => {
    if (!address.destinatario || !address.numero) {
      alert("Por favor, preencha todos os dados de entrega no Passo 1.");
      setStep(1);
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setStatusText('Conectando ao Mercado Pago...');
    
    try {
      // Tenta conectar ao servidor de pagamento
      const response = await fetch('http://localhost:3000/criar-pagamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: window.location.origin,
          items: cart.map(item => ({ 
            id: item.id.toString(),
            title: item.name, 
            unit_price: item.price, 
            quantity: item.quantity 
          })),
          shippingPrice: selectedShipping?.price || 0,
          customer: { 
            name: address.destinatario, 
            email: user?.email || '' 
          }
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "O servidor de pagamentos está offline.");
      }

      const data = await response.json();
      const redirectUrl = data.init_point || data.sandbox_init_point;

      if (redirectUrl) {
        // FORNECENDO O INIT POINT NO CONSOLE CONFORME SOLICITADO
        console.log("SEU LINK DE PAGAMENTO (init_point):", redirectUrl);
        window.location.href = redirectUrl;
      } else {
        throw new Error("Link de pagamento não retornado pelo servidor.");
      }

    } catch (err: any) {
      console.error("Erro Checkout:", err);
      setErrorMessage(
        err.message.includes('Failed to fetch') 
          ? "Erro de Conexão: O servidor local (main.py) não está ativo na porta 3000. Inicie seu backend para prosseguir."
          : `Ocorreu um erro: ${err.message}`
      );
      setIsProcessing(false);
    }
  };

  const totalGeral = cartTotal + (selectedShipping?.price || 0);

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-24 font-['Inter']">
      {/* Overlay de Carregamento */}
      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 animate-fade-in">
          <Loader2 className="text-amber-500 animate-spin mb-4" size={64} />
          <h2 className="text-2xl font-black text-gray-900 mb-2">{statusText}</h2>
          <div className="flex items-center space-x-3 text-gray-400 bg-gray-50 px-6 py-2 rounded-full border border-gray-100">
             <ShieldCheck size={18} className="text-green-500" />
             <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Checkout 100% Seguro</span>
          </div>
        </div>
      )}

      {/* Stepper Superior (Cores da Blee Shop: Amber) */}
      <div className="bg-white border-b border-gray-100 py-6 mb-10">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center">
          <div className="flex items-center space-x-3 md:space-x-12">
            <div className="flex flex-col items-center gap-1.5 opacity-30">
              <span className="text-[10px] font-black uppercase tracking-widest">Carrinho</span>
            </div>
            <div className="w-10 h-px bg-gray-100"></div>
            <div className={`flex flex-col items-center gap-1.5 ${step === 1 ? 'text-amber-500 font-bold' : 'opacity-30'}`}>
              <span className="text-[10px] font-black uppercase tracking-widest">Entrega</span>
            </div>
            <div className="w-10 h-px bg-gray-100"></div>
            <div className={`flex flex-col items-center gap-1.5 ${step === 2 ? 'text-amber-500 font-bold' : 'opacity-30'}`}>
              <span className="text-[10px] font-black uppercase tracking-widest">Pagamento</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-start">
          
          <div className="lg:col-span-8 space-y-6">
            {/* O aviso de recesso foi removido conforme solicitado */}

            {errorMessage && (
              <div className="bg-red-50 border border-red-100 p-5 rounded-2xl flex items-start space-x-4 animate-zoom-in">
                <AlertCircle className="text-red-500 shrink-0" size={18} />
                <p className="text-[11px] text-red-700 font-bold leading-relaxed">{errorMessage}</p>
              </div>
            )}

            {/* Seção 1: Entrega */}
            <section className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-amber-50 p-2.5 rounded-xl text-amber-500">
                    <Mail size={18} />
                  </div>
                  <h2 className="text-gray-900 font-black text-sm uppercase tracking-widest">Entrega do Pedido</h2>
                </div>
                {step === 2 && (
                  <button 
                    onClick={() => setStep(1)}
                    className="text-[9px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-4 py-2 rounded-full hover:bg-amber-500 hover:text-white transition-all"
                  >
                    Alterar
                  </button>
                )}
              </div>

              {step === 1 ? (
                <div className="p-8 space-y-6 animate-fade-in">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">E-mail de Contato</label>
                      <input className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm font-bold text-gray-400 cursor-not-allowed" value={user?.email || ''} readOnly />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Quem recebe o pedido?</label>
                      <input 
                        className="w-full bg-white p-4 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-amber-400 font-bold text-gray-900 transition-all" 
                        value={address.destinatario} 
                        onChange={e => setAddress({...address, destinatario: e.target.value})} 
                        placeholder="Nome completo do destinatário"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">CEP</label>
                        <div className="relative">
                          <input 
                            className="w-full bg-white p-4 rounded-xl border border-gray-100 outline-none font-black" 
                            value={cep} 
                            maxLength={8}
                            onChange={e => {
                              const val = e.target.value.replace(/\D/g, '');
                              setCep(val);
                              if (val.length === 8) buscarEndereco(val);
                            }}
                          />
                          {isSearchingCep && <Loader2 className="absolute right-4 top-4 animate-spin text-amber-500" size={16} />}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Logradouro</label>
                        <input className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs font-bold text-gray-500" value={address.logradouro} readOnly />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Número</label>
                        <input 
                          ref={numeroRef}
                          className="w-full bg-white p-4 rounded-xl border-2 border-amber-200 outline-none focus:border-amber-400 font-black text-gray-900 transition-all" 
                          value={address.numero} 
                          onChange={e => setAddress({...address, numero: e.target.value})} 
                          placeholder="Ex: 123"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Complemento</label>
                        <input className="w-full bg-white p-4 rounded-xl border border-gray-100 font-bold text-sm" value={address.complemento} onChange={e => setAddress({...address, complemento: e.target.value})} placeholder="Apto, Sala, Bloco..." />
                      </div>
                    </div>
                  </div>
                  
                  {selectedShipping && (
                    <div className="flex items-center justify-between p-5 bg-amber-50 border border-amber-100 rounded-2xl">
                      <div className="flex items-center space-x-4">
                        <Truck className="text-amber-600" size={20} />
                        <div>
                          <p className="text-[10px] font-black text-gray-900 uppercase tracking-tighter">{selectedShipping.company} — R$ {selectedShipping.price.toFixed(2)}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Entrega estimada: {selectedShipping.delivery_time} dias</p>
                        </div>
                      </div>
                      <CheckCircle2 className="text-green-500" size={18} />
                    </div>
                  )}

                  <button 
                    onClick={() => setStep(2)}
                    disabled={!address.numero || !address.destinatario}
                    className="w-full bg-amber-400 text-gray-900 py-5 rounded-full font-black text-xs uppercase tracking-widest shadow-xl hover:brightness-105 active:scale-95 transition-all disabled:opacity-50"
                  >
                    Confirmar Entrega
                  </button>
                </div>
              ) : (
                <div className="p-8 flex items-center justify-between animate-fade-in bg-gray-50/30">
                  <div className="flex items-start gap-4">
                    <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                      <MapPin size={16} className="text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">
                        {address.logradouro}, {address.numero}
                      </p>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                        {address.bairro}, {address.localidade} - {address.uf}
                      </p>
                    </div>
                  </div>
                  <div className="bg-green-100 p-1.5 rounded-full text-green-600">
                    <CheckCircle2 size={16} />
                  </div>
                </div>
              )}
            </section>

            {/* Seção 2: Pagamento */}
            <section className={`bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden transition-all ${step === 1 ? 'opacity-40 grayscale pointer-events-none' : 'animate-slide-up'}`}>
              <div className="p-8 border-b border-gray-50 flex items-center gap-4">
                <div className="bg-amber-50 p-2.5 rounded-xl text-amber-500">
                  <CreditCard size={18} />
                </div>
                <h2 className="text-gray-900 font-black text-sm uppercase tracking-widest">Forma de Pagamento</h2>
              </div>

              <div className="p-10 text-center space-y-10">
                <div className="flex justify-center items-center space-x-12">
                  <div className="flex flex-col items-center gap-3">
                    <button 
                      onClick={() => setPaymentMethod('pix')}
                      className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center transition-all ${paymentMethod === 'pix' ? 'bg-amber-50 text-amber-500 border-2 border-amber-400 shadow-inner' : 'bg-gray-50 text-gray-300 border-2 border-transparent hover:bg-gray-100'}`}
                    >
                      <CheckCircle2 size={32} />
                    </button>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === 'pix' ? 'text-amber-600' : 'text-gray-400'}`}>Pix</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <button 
                      onClick={() => setPaymentMethod('card')}
                      className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center transition-all ${paymentMethod === 'card' ? 'bg-amber-50 text-amber-500 border-2 border-amber-400 shadow-inner' : 'bg-gray-50 text-gray-300 border-2 border-transparent hover:bg-gray-100'}`}
                    >
                      <CardIcon size={32} />
                    </button>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === 'card' ? 'text-amber-600' : 'text-gray-400'}`}>Cartão</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <button 
                      onClick={() => setPaymentMethod('boleto')}
                      className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center transition-all ${paymentMethod === 'boleto' ? 'bg-amber-50 text-amber-500 border-2 border-amber-400 shadow-inner' : 'bg-gray-50 text-gray-300 border-2 border-transparent hover:bg-gray-100'}`}
                    >
                      <Banknote size={32} />
                    </button>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === 'boleto' ? 'text-amber-600' : 'text-gray-400'}`}>Boleto</span>
                  </div>
                </div>

                <div className="max-w-sm mx-auto">
                  <p className="text-[11px] text-gray-500 font-medium leading-relaxed italic">
                    Ao finalizar, George abrirá o ambiente oficial do **Mercado Pago** para sua total segurança.
                  </p>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handleFinishOrder}
                    disabled={isProcessing}
                    className="w-full bg-amber-400 text-gray-900 py-6 rounded-full font-black text-sm uppercase tracking-widest shadow-xl shadow-amber-100 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-4"
                  >
                    {isProcessing ? <Loader2 className="animate-spin" /> : <span>FAZER PEDIDO</span>}
                  </button>
                </div>

                <div className="flex items-center justify-center space-x-3 text-gray-300 opacity-60">
                  <ShieldCheck size={16} />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">Pagamento Garantido Mercado Pago</span>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Resumo */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm sticky top-28">
              <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em] mb-8 pb-4 border-b border-gray-50">RESUMO</h3>
              
              <div className="space-y-6 mb-10 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between group">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                        <img src={item.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[11px] font-black text-gray-900 truncate max-w-[120px] leading-tight">{item.name}</span>
                        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">{item.quantity}un.</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-gray-800">R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-100 mb-8">
                <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>R$ {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <span>Frete</span>
                  <span className="text-gray-900">R$ {selectedShipping?.price.toFixed(2) || '0.00'}</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Total</span>
                <span className="text-4xl font-black text-amber-500 tracking-tighter">
                  R$ {totalGeral.toFixed(2).replace('.', ',')}
                </span>
              </div>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100 hover:bg-amber-400 hover:text-white transition-all group">
                  <div className="flex items-center gap-3">
                    <Tag size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">CUPONS ATIVOS</span>
                  </div>
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="mt-10 pt-6 border-t border-gray-50 flex items-center justify-center space-x-3 text-gray-300">
                <ShieldCheck size={18} />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">CHECKOUT SEGURO</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
