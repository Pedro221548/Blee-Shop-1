
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, Loader2, ArrowRight, ShieldCheck, 
  CheckCircle2, Mail, ChevronRight, Tag, Info, 
  Truck, Check, Wallet, Banknote, MapPin, AlertCircle
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
    
    try {
      console.log("🐝 Iniciando integração com Mercado Pago via Python...");

      const response = await fetch('http://localhost:3000/criar-pagamento', {
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
            name: address.destinatario, 
            email: user?.email || '' 
          }
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Erro ao conectar com o backend.");
      }

      const data = await response.json();
      console.log("✅ Preferência criada com sucesso:", data.preferenceId);

      // REDIRECIONAMENTO PARA O MERCADO PAGO
      // Damos preferência ao sandbox_init_point se estivermos em modo teste, 
      // mas o init_point também funciona se as credenciais forem de produção.
      const redirectUrl = data.sandbox_init_point || data.init_point;

      if (redirectUrl) {
        console.log("🔗 Redirecionando para:", redirectUrl);
        window.location.href = redirectUrl;
      } else {
        throw new Error("O link de pagamento não foi retornado pelo servidor.");
      }

    } catch (err: any) {
      console.error("❌ Falha no Processo:", err);
      setErrorMessage(`Não foi possível iniciar o pagamento. Erro: ${err.message}. Certifique-se que o backend Python (main.py) está rodando na porta 3000.`);
      setIsProcessing(false);
    }
  };

  const totalGeral = cartTotal + (selectedShipping?.price || 0);

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-24 font-['Inter']">
      <div className="bg-white border-b border-gray-100 py-8 mb-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center">
          <div className="flex items-center space-x-4 md:space-x-12">
            <div className="flex flex-col items-center gap-2 opacity-40">
              <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-[11px] font-bold"><Check size={14}/></div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Carrinho</span>
            </div>
            <div className="w-16 h-px bg-gray-200 mt-[-20px]"></div>
            <div className={`flex flex-col items-center gap-2 ${step === 1 ? 'text-[#c4a678]' : 'opacity-40'}`}>
              <div className={`w-8 h-8 rounded-full border ${step === 1 ? 'border-[#c4a678] bg-[#fdfaf5]' : 'border-gray-300'} flex items-center justify-center text-[11px] font-bold`}>2</div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Entrega</span>
            </div>
            <div className="w-16 h-px bg-gray-200 mt-[-20px]"></div>
            <div className={`flex flex-col items-center gap-2 ${step === 2 ? 'text-[#c4a678]' : 'opacity-40'}`}>
              <div className={`w-8 h-8 rounded-full border ${step === 2 ? 'border-[#c4a678] bg-[#fdfaf5]' : 'border-gray-300'} flex items-center justify-center text-[11px] font-bold`}>3</div>
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

            <div className="bg-[#fff1f6] border border-[#ffecf2] p-6 rounded-2xl flex items-start space-x-4">
              <Info className="text-[#ff79b0] shrink-0 mt-0.5" size={20} />
              <p className="text-[11px] text-[#ff79b0] font-bold leading-relaxed uppercase tracking-tight">
                ⚠️ Atenção: Recesso até 05/01. Pedidos serão processados no retorno.
              </p>
            </div>

            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Mail className="text-[#c4a678]" size={20} />
                  <span className="text-gray-900 font-bold text-lg">Dados de Entrega</span>
                </div>
                {step === 2 && (
                  <button onClick={() => setStep(1)} className="text-[11px] font-bold text-[#c4a678] uppercase tracking-widest">Editar</button>
                )}
              </div>

              {step === 1 ? (
                <div className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">E-mail</label>
                      <input className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm font-bold text-gray-400" value={user?.email || ''} readOnly />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Destinatário</label>
                      <input 
                        className="w-full bg-[#f9f9f9] p-4 rounded-xl border border-gray-100 outline-none font-medium" 
                        value={address.destinatario} 
                        onChange={e => setAddress({...address, destinatario: e.target.value})} 
                        placeholder="Quem irá receber?"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">CEP</label>
                        <div className="relative">
                          <input 
                            className="w-full bg-[#f9f9f9] p-4 rounded-xl border border-gray-100 outline-none font-bold" 
                            value={cep} 
                            maxLength={8}
                            onChange={e => {
                              const val = e.target.value.replace(/\D/g, '');
                              setCep(val);
                              if (val.length === 8) buscarEndereco(val);
                            }}
                          />
                          {isSearchingCep && <Loader2 className="absolute right-4 top-4 animate-spin text-[#c4a678]" size={16} />}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Logradouro</label>
                        <input className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs font-bold text-gray-500" value={address.logradouro} readOnly />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Número</label>
                        <input 
                          ref={numeroRef}
                          className="w-full bg-white p-4 rounded-xl border-2 border-[#c4a678] outline-none font-black text-gray-900" 
                          value={address.numero} 
                          onChange={e => setAddress({...address, numero: e.target.value})} 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Complemento</label>
                        <input className="w-full bg-[#f9f9f9] p-4 rounded-xl border border-gray-100" value={address.complemento} onChange={e => setAddress({...address, complemento: e.target.value})} />
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setStep(2)} disabled={!address.numero} className="w-full bg-[#ff79b0] text-white py-5 rounded-full font-black text-xs uppercase tracking-widest shadow-xl disabled:opacity-50 transition-all">Continuar para o Pagamento</button>
                </div>
              ) : (
                <div className="p-8">
                   <div className="flex items-start space-x-4">
                    <MapPin className="text-[#c4a678] mt-1" size={18} />
                    <div className="flex flex-col">
                      <p className="text-sm font-black text-gray-900">{address.logradouro}, {address.numero}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{address.bairro}, {address.localidade}</p>
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section className={`bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all ${step === 1 ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
              <div className="p-8 border-b border-gray-50 flex items-center space-x-4">
                <CreditCard className="text-[#c4a678]" size={20} />
                <span className="text-gray-900 font-bold text-lg">Pagamento Seguro</span>
              </div>
              <div className="p-8 space-y-6 text-center">
                <div className="flex justify-center space-x-6 mb-4 opacity-50 grayscale">
                  <div className="flex flex-col items-center gap-1">
                    <CheckCircle2 size={32} className="text-green-500" />
                    <span className="text-[8px] font-black uppercase">Pix</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Wallet size={32} className="text-blue-500" />
                    <span className="text-[8px] font-black uppercase">Cartão</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Banknote size={32} className="text-gray-400" />
                    <span className="text-[8px] font-black uppercase">Boleto</span>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 font-medium px-8">Você será redirecionado para o Checkout Pro do Mercado Pago para escolher sua forma de pagamento preferida.</p>
                <button 
                  onClick={handleFinishOrder}
                  disabled={isProcessing}
                  className="w-full bg-[#ff79b0] text-white py-6 rounded-full font-black text-sm uppercase tracking-widest shadow-2xl hover:brightness-105 active:scale-95 transition-all flex items-center justify-center space-x-3"
                >
                  {isProcessing ? <Loader2 className="animate-spin" /> : <><span>PAGAR COM MERCADO PAGO</span> <ArrowRight size={20}/></>}
                </button>
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-3xl border border-gray-100 p-8 sticky top-28 shadow-sm">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Resumo</h3>
              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-bold">{item.quantity}x {item.name}</span>
                    <span className="font-black">R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-50 pt-6 space-y-3">
                <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                  <span>Subtotal</span>
                  <span>R$ {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                  <span>Frete</span>
                  <span className="text-green-600 font-black">R$ {selectedShipping?.price.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <span className="text-sm font-black text-gray-900">Total</span>
                  <span className="text-3xl font-black text-[#ff79b0] tracking-tighter">R$ {totalGeral.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-center space-x-4 opacity-30 grayscale">
                <ShieldCheck size={18} />
                <span className="text-[9px] font-black uppercase tracking-widest">Garantia Blee Shop</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
