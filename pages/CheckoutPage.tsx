
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
  const [statusText, setStatusText] = useState('Processando seu pedido...');
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
      alert("Ops! George precisa do destinatário e do número da residência.");
      setStep(1);
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setStatusText('George está buscando o link oficial do Mercado Pago...');
    
    try {
      // Tenta conectar ao servidor Python local
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
        throw new Error(errData.error || "O servidor de pagamentos não está respondendo.");
      }

      const data = await response.json();
      
      // Obtém o init_point retornado pelo backend
      const redirectUrl = data.init_point || data.sandbox_init_point;

      if (redirectUrl) {
        setStatusText('Redirecionando para o Mercado Pago...');
        
        // FORNECENDO O INIT POINT NO CONSOLE CONFORME SOLICITADO
        console.log("-----------------------------------------");
        console.log("SEU LINK DE PAGAMENTO (INIT_POINT):");
        console.log(redirectUrl);
        console.log("-----------------------------------------");

        // Redireciona o usuário para o pagamento
        window.location.href = redirectUrl;
      } else {
        throw new Error("Link de pagamento não retornado pela API.");
      }

    } catch (err: any) {
      console.error("Erro Checkout:", err);
      
      // Tratamento específico para o erro "Failed to fetch"
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setErrorMessage("Erro de Conexão: Não foi possível acessar o servidor local na porta 3000. Certifique-se de que o arquivo 'main.py' está rodando (python main.py).");
      } else {
        setErrorMessage(`Ocorreu um erro: ${err.message}`);
      }
      
      setIsProcessing(false);
    }
  };

  const totalGeral = cartTotal + (selectedShipping?.price || 0);

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-24 font-['Inter']">
      {/* Overlay de Processamento */}
      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 animate-fade-in">
          <div className="relative mb-8">
            <Loader2 className="text-[#ff79b0] animate-spin" size={72} />
            <Sparkles className="absolute -top-3 -right-3 text-[#ff79b0]/50 animate-pulse" size={28} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">{statusText}</h2>
          <div className="flex items-center space-x-3 text-gray-400 bg-gray-50 px-6 py-2 rounded-full border border-gray-100">
             <ShieldCheck size={18} className="text-green-500" />
             <span className="text-[10px] font-black uppercase tracking-widest">Plataforma Segura Mercado Pago</span>
          </div>
        </div>
      )}

      {/* Header com Stepper conforme mockup rosa */}
      <div className="bg-white border-b border-gray-100 py-6 mb-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center">
          <div className="flex items-center space-x-4 md:space-x-12">
            <div className="flex flex-col items-center gap-1.5 opacity-30">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Carrinho</span>
            </div>
            <div className="w-12 h-px bg-gray-100"></div>
            <div className={`flex flex-col items-center gap-1.5 ${step === 1 ? 'text-[#ff79b0]' : 'opacity-30'}`}>
              <span className="text-[10px] font-black uppercase tracking-widest">Entrega</span>
            </div>
            <div className="w-12 h-px bg-gray-100"></div>
            <div className={`flex flex-col items-center gap-1.5 ${step === 2 ? 'text-[#ff79b0]' : 'opacity-30'}`}>
              <span className="text-[10px] font-black uppercase tracking-widest">Pagamento</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-start">
          
          <div className="lg:col-span-8 space-y-6">
            {/* Banner de Recesso conforme mockup */}
            <div className="bg-[#fff1f6] border border-[#ffecf2] p-5 rounded-xl flex items-start space-x-3 animate-fade-in shadow-sm">
              <AlertCircle className="text-[#ff79b0] shrink-0 mt-0.5" size={18} />
              <p className="text-[10px] md:text-[11px] text-[#ff79b0] font-black leading-relaxed uppercase tracking-tight">
                ⚠️ ATENÇÃO: nossa equipe se encontra em recesso até o dia 05/01. Pedidos realizados nesse período terão início assim que retornarmos. Ignorar os prazos abaixo.
              </p>
            </div>

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 p-6 rounded-2xl flex items-start space-x-4 animate-zoom-in">
                <AlertCircle className="text-red-500 shrink-0" size={20} />
                <p className="text-xs text-red-700 font-bold leading-relaxed">{errorMessage}</p>
              </div>
            )}

            <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Mail className="text-[#ff79b0]" size={20} />
                  <span className="text-gray-900 font-black text-lg uppercase tracking-tight">Entrega do Pedido</span>
                </div>
                {step === 2 && (
                  <button onClick={() => setStep(1)} className="text-[10px] font-black text-[#ff79b0] uppercase tracking-widest bg-[#fff5f8] px-5 py-2.5 rounded-full hover:bg-[#ff79b0] hover:text-white transition-all">Alterar</button>
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
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Quem recebe?</label>
                      <input 
                        className="w-full bg-[#fcfcfc] p-4 rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ff79b0]/20 font-bold text-gray-900 transition-all" 
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
                            className="w-full bg-[#fcfcfc] p-4 rounded-xl border border-gray-100 outline-none font-black" 
                            value={cep} 
                            maxLength={8}
                            onChange={e => {
                              const val = e.target.value.replace(/\D/g, '');
                              setCep(val);
                              if (val.length === 8) buscarEndereco(val);
                            }}
                          />
                          {isSearchingCep && <Loader2 className="absolute right-4 top-4 animate-spin text-[#ff79b0]" size={16} />}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Logradouro</label>
                        <input className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs font-bold text-gray-400" value={address.logradouro} readOnly />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Número</label>
                        <input 
                          ref={numeroRef}
                          className="w-full bg-white p-4 rounded-xl border-2 border-[#ff79b0]/20 outline-none focus:border-[#ff79b0] font-black text-gray-900 transition-all" 
                          value={address.numero} 
                          onChange={e => setAddress({...address, numero: e.target.value})} 
                          placeholder="Ex: 123"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Complemento</label>
                        <input className="w-full bg-[#fcfcfc] p-4 rounded-xl border border-gray-100 font-bold text-sm" value={address.complemento} onChange={e => setAddress({...address, complemento: e.target.value})} placeholder="Apto, Bloco..." />
                      </div>
                    </div>
                  </div>
                  
                  {selectedShipping && (
                    <div className="flex items-center justify-between p-5 bg-[#fffcfd] border border-[#ff79b0]/10 rounded-2xl">
                      <div className="flex items-center space-x-4">
                        <Truck className="text-[#ff79b0]" size={20} />
                        <div>
                          <p className="text-[10px] font-black text-gray-900 uppercase tracking-tighter">{selectedShipping.company} — R$ {selectedShipping.price.toFixed(2)}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Entrega estimada em {selectedShipping.delivery_time} dias</p>
                        </div>
                      </div>
                      <CheckCircle2 className="text-green-500" size={18} />
                    </div>
                  )}

                  <button 
                    onClick={() => setStep(2)}
                    disabled={!address.numero || !address.destinatario}
                    className="w-full bg-[#ff79b0] text-white py-5 rounded-full font-black text-xs uppercase tracking-widest shadow-xl hover:brightness-105 active:scale-95 transition-all disabled:opacity-50"
                  >
                    Ir para o Pagamento
                  </button>
                </div>
              ) : (
                <div className="p-8 flex items-center justify-between animate-fade-in">
                  <div className="flex items-start space-x-4">
                    <MapPin className="text-[#ff79b0] mt-1" size={18} />
                    <div className="flex flex-col">
                      <p className="text-sm font-black text-gray-900">{address.logradouro}, {address.numero}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{address.bairro}, {address.localidade} - {address.uf}</p>
                    </div>
                  </div>
                  <CheckCircle2 className="text-green-500" size={24} />
                </div>
              )}
            </section>

            <section className={`bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden transition-all ${step === 1 ? 'opacity-40 grayscale pointer-events-none' : 'animate-slide-up'}`}>
              <div className="p-8 border-b border-gray-50 flex items-center space-x-4">
                <div className="bg-[#fff5f8] p-2.5 rounded-2xl text-[#ff79b0]">
                  <CreditCard size={20} />
                </div>
                <span className="text-gray-900 font-black text-lg uppercase tracking-tight">Forma de Pagamento</span>
              </div>
              <div className="p-10 space-y-6 text-center">
                <div className="flex justify-center space-x-8 mb-4">
                   <div className="flex flex-col items-center gap-2">
                     <div className="w-16 h-16 bg-[#fff5f8] rounded-2xl flex items-center justify-center text-[#ff79b0]">
                        <CheckCircle2 size={32} />
                     </div>
                     <span className="text-[9px] font-black uppercase text-gray-400">Pix</span>
                   </div>
                   <div className="flex flex-col items-center gap-2">
                     <div className="w-16 h-16 bg-[#fff5f8] rounded-2xl flex items-center justify-center text-[#ff79b0]">
                        <Wallet size={32} />
                     </div>
                     <span className="text-[9px] font-black uppercase text-gray-400">Cartão</span>
                   </div>
                   <div className="flex flex-col items-center gap-2">
                     <div className="w-16 h-16 bg-[#fff5f8] rounded-2xl flex items-center justify-center text-[#ff79b0]">
                        <Banknote size={32} />
                     </div>
                     <span className="text-[9px] font-black uppercase text-gray-400">Boleto</span>
                   </div>
                </div>

                <p className="text-xs text-gray-500 font-medium px-6 leading-relaxed">
                  O George utiliza o **Mercado Pago** para garantir que sua transação seja 100% segura. Ao clicar no botão abaixo, você será redirecionado para concluir o pagamento.
                </p>

                <button 
                  onClick={handleFinishOrder}
                  disabled={isProcessing}
                  className="w-full bg-[#ff79b0] text-white py-6 rounded-full font-black text-sm uppercase tracking-widest shadow-2xl hover:brightness-105 active:scale-95 transition-all flex items-center justify-center space-x-4 group"
                >
                  {isProcessing ? <Loader2 className="animate-spin" /> : <span>FAZER PEDIDO</span>}
                </button>
                
                <div className="flex items-center justify-center space-x-3 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                  <ShieldCheck size={16} />
                  <span>Ambiente Seguro Mercado Pago</span>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 sticky top-28 shadow-sm">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-8 border-b border-gray-50 pb-4">Resumo</h3>
              <div className="space-y-5 mb-8 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between group">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 overflow-hidden shrink-0 border border-gray-50 group-hover:scale-105 transition-transform">
                        <img src={item.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-black text-gray-900 truncate max-w-[140px] leading-tight">{item.name}</span>
                        <span className="text-[9px] font-bold text-[#ff79b0] uppercase tracking-widest">{item.quantity}un.</span>
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
                  <span className="text-gray-900">R$ {selectedShipping?.price.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-end pt-6">
                  <span className="text-xs font-black text-gray-900 uppercase tracking-[0.2em]">Total</span>
                  <span className="text-4xl font-black text-[#ff79b0] tracking-tighter">
                    R$ {totalGeral.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
              
              <div className="mt-8 space-y-4">
                <div className="bg-[#fff1f6] text-[#ff79b0] px-4 py-4 rounded-2xl flex items-center justify-between cursor-pointer border border-[#ffecf2] hover:brightness-105 transition-all">
                  <div className="flex items-center space-x-3">
                    <Tag size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Cupons Ativos</span>
                  </div>
                  <ChevronRight size={16} />
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-gray-50 flex items-center justify-center space-x-3 opacity-20 grayscale">
                <ShieldCheck size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Checkout Seguro</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
