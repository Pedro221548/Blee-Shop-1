
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, Loader2, ArrowRight, ShieldCheck, 
  CheckCircle2, Mail, ChevronRight, Tag, Info, 
  Truck, Check, Wallet, Banknote, MapPin, AlertCircle, Sparkles
} from 'lucide-react';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';

const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, clearCart, selectedShipping, cep, setCep, address, setAddress } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const [step, setStep] = useState<1 | 2>(1); 
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('Preparando sua colmeia de pagamento...');
  const numeroRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login', { state: { from: '/checkout' } });
    if (cart.length === 0) navigate('/cart');
    
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
      alert("Ops! George precisa do destinatário e do número da casa.");
      setStep(1);
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setStatusText('George está buscando o link oficial do Mercado Pago...');
    
    try {
      // 1. Enviar dados para o backend Python
      const response = await fetch('http://localhost:3000/criar-pagamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: window.location.origin, // Identifica se é Vercel, localhost, etc.
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
        throw new Error(errData.error || "O servidor de pagamentos não respondeu.");
      }

      const data = await response.json();
      
      // 2. Redirecionamento Direto (Checkout Pro)
      // Usamos init_point (produção) ou sandbox_init_point (testes)
      const redirectUrl = data.init_point || data.sandbox_init_point;

      if (redirectUrl) {
        setStatusText('Redirecionando... Pague e volte para a colmeia!');
        window.location.href = redirectUrl;
      } else {
        throw new Error("Link de pagamento não gerado.");
      }

    } catch (err: any) {
      console.error("Erro no checkout:", err);
      setErrorMessage(`Ocorreu um erro: ${err.message}. Verifique se o main.py está rodando na porta 3000.`);
      setIsProcessing(false);
    }
  };

  const totalGeral = cartTotal + (selectedShipping?.price || 0);

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-24 font-['Inter']">
      {/* Overlay de Processamento com Redirect */}
      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-lg flex flex-col items-center justify-center text-center p-8 animate-fade-in">
          <div className="relative mb-8">
            <Loader2 className="text-amber-500 animate-spin" size={72} />
            <Sparkles className="absolute -top-3 -right-3 text-amber-300 animate-pulse" size={28} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">{statusText}</h2>
          <div className="flex items-center space-x-3 text-gray-400 bg-gray-50 px-6 py-2 rounded-full border border-gray-100">
             <ShieldCheck size={18} className="text-green-500" />
             <span className="text-[10px] font-black uppercase tracking-widest">Plataforma Segura Mercado Pago</span>
          </div>
        </div>
      )}

      <div className="bg-white border-b border-gray-100 py-8 mb-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center">
          <div className="flex items-center space-x-4 md:space-x-12">
            <div className="flex flex-col items-center gap-2 opacity-40">
              <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-[11px] font-bold"><Check size={14}/></div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Carrinho</span>
            </div>
            <div className="w-16 h-px bg-gray-200 mt-[-20px]"></div>
            <div className={`flex flex-col items-center gap-2 ${step === 1 ? 'text-amber-600' : 'opacity-40'}`}>
              <div className={`w-8 h-8 rounded-full border ${step === 1 ? 'border-amber-400 bg-amber-50' : 'border-gray-300'} flex items-center justify-center text-[11px] font-bold`}>2</div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Entrega</span>
            </div>
            <div className="w-16 h-px bg-gray-200 mt-[-20px]"></div>
            <div className={`flex flex-col items-center gap-2 ${step === 2 ? 'text-amber-600' : 'opacity-40'}`}>
              <div className={`w-8 h-8 rounded-full border ${step === 2 ? 'border-amber-400 bg-amber-50' : 'border-gray-300'} flex items-center justify-center text-[11px] font-bold`}>3</div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Pagamento</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-start">
          <div className="lg:col-span-8 space-y-6">
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 p-6 rounded-2xl flex items-start space-x-4 animate-zoom-in">
                <AlertCircle className="text-red-500 shrink-0" size={20} />
                <p className="text-xs text-red-700 font-bold leading-relaxed">{errorMessage}</p>
              </div>
            )}

            <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Mail className="text-amber-600" size={20} />
                  <span className="text-gray-900 font-bold text-lg">Informações de Envio</span>
                </div>
                {step === 2 && (
                  <button onClick={() => setStep(1)} className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-4 py-2 rounded-full">Editar</button>
                )}
              </div>

              {step === 1 ? (
                <div className="p-8 space-y-6 animate-fade-in">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">E-mail de Cadastro</label>
                      <input className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm font-bold text-gray-400 cursor-not-allowed" value={user?.email || ''} readOnly />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Destinatário</label>
                      <input 
                        className="w-full bg-[#f9f9f9] p-4 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-amber-400 font-bold text-gray-900 transition-all" 
                        value={address.destinatario} 
                        onChange={e => setAddress({...address, destinatario: e.target.value})} 
                        placeholder="Nome de quem irá receber"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">CEP</label>
                        <div className="relative">
                          <input 
                            className="w-full bg-[#f9f9f9] p-4 rounded-xl border border-gray-100 outline-none font-black" 
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
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Rua / Logradouro</label>
                        <input className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs font-bold text-gray-500" value={address.logradouro} readOnly />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Número</label>
                        <input 
                          ref={numeroRef}
                          className="w-full bg-white p-4 rounded-xl border-2 border-amber-400 outline-none font-black text-gray-900" 
                          value={address.numero} 
                          onChange={e => setAddress({...address, numero: e.target.value})} 
                          placeholder="Ex: 123"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Complemento</label>
                        <input className="w-full bg-[#f9f9f9] p-4 rounded-xl border border-gray-100 font-bold text-sm" value={address.complemento} onChange={e => setAddress({...address, complemento: e.target.value})} placeholder="Ex: Bloco A" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-5 bg-amber-50 border border-amber-100 rounded-2xl">
                    <div className="flex items-center space-x-4">
                      <Truck className="text-amber-600" size={20} />
                      <div>
                        <p className="text-[10px] font-black text-gray-900 uppercase tracking-tighter">{selectedShipping?.company} — R$ {selectedShipping?.price.toFixed(2)}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Chega em aproximadamente {selectedShipping?.delivery_time} dias</p>
                      </div>
                    </div>
                    <CheckCircle2 className="text-green-500" size={18} />
                  </div>

                  <button 
                    onClick={() => setStep(2)}
                    disabled={!address.numero || !address.destinatario}
                    className="w-full bg-amber-400 text-gray-900 py-5 rounded-full font-black text-xs uppercase tracking-widest shadow-xl hover:bg-amber-500 transition-all disabled:opacity-50 active:scale-95"
                  >
                    Prosseguir para o Pagamento
                  </button>
                </div>
              ) : (
                <div className="p-8 flex items-center justify-between animate-fade-in">
                  <div className="flex items-start space-x-4">
                    <MapPin className="text-amber-500 mt-1" size={18} />
                    <div className="flex flex-col">
                      <p className="text-sm font-black text-gray-900">{address.logradouro}, {address.numero}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{address.bairro}, {address.localidade} - {address.uf}</p>
                    </div>
                  </div>
                  <div className="bg-green-50 p-2 rounded-lg">
                    <CheckCircle2 className="text-green-600" size={20} />
                  </div>
                </div>
              )}
            </section>

            <section className={`bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden transition-all ${step === 1 ? 'opacity-40 grayscale pointer-events-none' : 'animate-slide-up'}`}>
              <div className="p-8 border-b border-gray-50 flex items-center space-x-4">
                <CreditCard className="text-amber-600" size={20} />
                <span className="text-gray-900 font-bold text-lg">Pagamento Checkout Pro</span>
              </div>
              <div className="p-10 space-y-8 text-center">
                <div className="flex justify-center space-x-12 mb-4">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center text-green-500 shadow-sm">
                      <CheckCircle2 size={40} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Pix Instantâneo</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-500 shadow-sm">
                      <Wallet size={40} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Cartão de Crédito</span>
                  </div>
                </div>
                
                <p className="text-[11px] text-gray-500 font-medium px-12 leading-relaxed">
                  Ao clicar abaixo, George abrirá o portal seguro do **Mercado Pago**. Escolha sua forma de pagamento e, após concluir, você voltará automaticamente para o seu dashboard.
                </p>

                <button 
                  onClick={handleFinishOrder}
                  disabled={isProcessing}
                  className="w-full bg-amber-400 text-gray-900 py-6 rounded-full font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-amber-500 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-4 group"
                >
                  {isProcessing ? <Loader2 className="animate-spin" /> : <><span>PAGAR COM MERCADO PAGO</span> <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" /></>}
                </button>
                
                <div className="flex items-center justify-center space-x-3 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
                  <ShieldCheck size={16} />
                  <span>Sua compra está protegida</span>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 sticky top-28 shadow-sm">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-8 border-b border-gray-50 pb-4">Resumo da Compra</h3>
              <div className="space-y-6 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between group">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-2xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100 group-hover:scale-105 transition-transform">
                        <img src={item.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[11px] font-black text-gray-900 truncate max-w-[120px]">{item.name}</span>
                        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">{item.quantity} unidade(s)</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-gray-900">R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-50 pt-6 space-y-4">
                <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>R$ {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  <span>Frete</span>
                  <span className="text-green-600 font-black">R$ {selectedShipping?.price.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-end pt-6">
                  <span className="text-xs font-black text-gray-900 uppercase tracking-[0.2em]">Total Final</span>
                  <span className="text-3xl font-black text-amber-500 tracking-tighter">R$ {totalGeral.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-8 bg-gray-50 p-5 rounded-3xl flex items-center justify-between grayscale opacity-40">
                <div className="flex items-center space-x-3">
                  <img src="https://logodeposito.com/wp-content/uploads/2021/07/mercado-pago-logo.png" className="h-4" alt="MP Logo" />
                  <div className="h-4 w-px bg-gray-300"></div>
                  <span className="text-[8px] font-black uppercase tracking-widest">Oficial</span>
                </div>
                <ShieldCheck size={18} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
