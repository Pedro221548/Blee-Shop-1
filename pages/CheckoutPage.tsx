
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, MapPin, CheckCircle2, Clock, Loader2, Wallet, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useCart } from '../CartContext';

const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isCalculating, setIsCalculating] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<{ cost: number; days: string } | null>(null);
  
  const [form, setForm] = useState({
    nome: '',
    email: '',
    endereco: '',
    cidade: '',
    cep: '',
    payment: 'mercadopago'
  });

  // Gatilho automático para busca de CEP
  useEffect(() => {
    const rawCep = form.cep.replace(/\D/g, '');
    if (rawCep.length === 8) {
      buscarDadosCep(rawCep);
    }
  }, [form.cep]);

  const buscarDadosCep = async (cep: string) => {
    setIsCalculating(true);
    try {
      const cepResponse = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const cepData = await cepResponse.json();

      if (cepData.erro) {
        alert("CEP não encontrado.");
        setIsCalculating(false);
        return;
      }

      setForm(prev => ({
        ...prev,
        endereco: `${cepData.logradouro}${cepData.bairro ? `, ${cepData.bairro}` : ''}`,
        cidade: `${cepData.localidade} - ${cepData.uf}`
      }));

      await new Promise(resolve => setTimeout(resolve, 800));
      const isMetropolitan = cep.startsWith('0');
      const cost = isMetropolitan ? 14.90 : 28.50;
      const days = isMetropolitan ? "2 a 4 dias úteis" : "5 a 10 dias úteis";
      setShippingInfo({ cost, days });

    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      alert("Erro ao processar dados do CEP.");
    } finally {
      setIsCalculating(false);
    }
  };

  const finalizarCompra = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!shippingInfo) {
      alert("Por favor, informe um CEP válido para calcular o frete.");
      return;
    }

    setIsProcessingPayment(true);
    try {
      const response = await fetch("/api/criar-pagamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          shipping: shippingInfo,
          customer: {
            name: form.nome,
            email: form.email
          }
        })
      });

      const data = await response.json();

      if (response.ok && data.link) {
        window.location.href = data.link;
      } else {
        // Exibe o erro retornado pelo backend
        console.error("Erro retornado pelo backend:", data);
        alert(`Erro no Pagamento: ${data.error || "Ocorreu um erro inesperado."}`);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Não foi possível conectar ao servidor de pagamento. Verifique sua conexão.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (cart.length === 0) {
    navigate('/');
    return null;
  }

  const finalTotal = cartTotal + (shippingInfo?.cost || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-10">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-amber-500 transition-colors flex items-center space-x-2 font-bold">
          <ArrowLeft size={18} />
          <span className="text-xs uppercase tracking-widest">Voltar</span>
        </button>
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Checkout</h1>
        <div className="w-20"></div>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-start">
        <form onSubmit={finalizarCompra} className="lg:col-span-8 space-y-10">
          <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-amber-100 p-2.5 rounded-2xl text-amber-600">
                <MapPin size={22} />
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Endereço de Entrega</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Nome Completo</label>
                <input required type="text" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none font-bold" placeholder="Seu nome completo" />
              </div>
              
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">CEP (Busca Automática)</label>
                <div className="relative">
                  <input required type="text" maxLength={9} value={form.cep} onChange={e => setForm({...form, cep: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none font-black" placeholder="00000-000" />
                  {isCalculating && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-amber-500" size={18} />}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">E-mail para Rastreio</label>
                <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none font-bold" placeholder="seu@email.com" />
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Rua e Bairro</label>
                <input required type="text" value={form.endereco} onChange={e => setForm({...form, endereco: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none font-bold" placeholder="Digite seu CEP..." />
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Cidade e UF</label>
                <input required type="text" value={form.cidade} readOnly className="w-full bg-gray-100 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-500 outline-none" placeholder="Carregando..." />
              </div>
            </div>

            {shippingInfo && (
              <div className="mt-8 bg-amber-50 border border-amber-100 p-6 rounded-[1.5rem] flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center space-x-4">
                  <div className="bg-amber-400 p-3 rounded-xl text-white shadow-sm">
                    <Truck size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-amber-900 uppercase tracking-widest block">Frete Calculado</span>
                    <span className="text-sm font-bold text-amber-800">{shippingInfo.days}</span>
                  </div>
                </div>
                <span className="text-lg font-black text-amber-900">R$ {shippingInfo.cost.toFixed(2)}</span>
              </div>
            )}
          </section>

          <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-amber-100 p-2.5 rounded-2xl text-amber-600">
                <Wallet size={22} />
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Pagamento Seguro</h2>
            </div>
            
            <div className="bg-amber-50 border-2 border-amber-400 p-6 rounded-3xl flex items-center justify-between shadow-lg shadow-amber-100">
              <div className="flex items-center space-x-4">
                <div className="bg-white p-3 rounded-2xl shadow-sm">
                  <img src="https://logodownload.org/wp-content/uploads/2019/06/mercado-pago-logo-0.png" alt="Mercado Pago" className="h-6 object-contain" />
                </div>
                <div>
                  <p className="font-black text-gray-900 text-sm">Mercado Pago Checkout Pro</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Cartão, Pix, Boleto ou Saldo</p>
                </div>
              </div>
              <CheckCircle2 size={28} className="text-amber-500" />
            </div>
          </section>

          <button type="submit" disabled={!shippingInfo || isProcessingPayment} className="lg:hidden w-full bg-amber-400 text-gray-900 py-6 rounded-2xl font-black text-lg shadow-2xl shadow-amber-200/50 disabled:opacity-50 active:scale-95 transition-all">
            {isProcessingPayment ? <Loader2 className="animate-spin mx-auto" /> : "FINALIZAR E PAGAR"}
          </button>
        </form>

        <div className="lg:col-span-4 mt-12 lg:mt-0">
          <div className="bg-gray-900 text-white rounded-[3rem] p-8 md:p-10 sticky top-24 shadow-2xl shadow-gray-200">
            <h3 className="text-xl font-black mb-10 uppercase tracking-widest text-amber-400 border-b border-gray-800 pb-6">Meu Pedido</h3>
            
            <div className="space-y-6 mb-10 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img src={item.image} alt="" className="w-14 h-14 rounded-2xl object-cover border border-gray-800" />
                      <span className="absolute -top-2 -right-2 bg-amber-500 text-gray-900 text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-gray-900">{item.quantity}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-100 text-sm truncate w-32">{item.name}</p>
                      <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest">{item.category}</p>
                    </div>
                  </div>
                  <p className="font-black text-gray-100 text-sm">R$ {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-800 pt-8 space-y-5 mb-10">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                <span>Itens</span>
                <span>R$ {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                <span>Frete</span>
                <span>{shippingInfo ? `R$ ${shippingInfo.cost.toFixed(2)}` : '--'}</span>
              </div>
              <div className="flex justify-between text-3xl font-black text-white pt-4 border-t border-gray-800">
                <span className="text-sm self-center">TOTAL</span>
                <span className="text-amber-400">R$ {finalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <button 
              onClick={() => finalizarCompra()}
              disabled={!shippingInfo || isProcessingPayment}
              className="w-full py-6 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center space-x-3 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed bg-amber-400 hover:bg-white text-gray-900 active:scale-95"
            >
              {isProcessingPayment ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <CreditCard size={18} />
                  <span>Pagar Agora</span>
                </>
              )}
            </button>
            <div className="flex items-center justify-center space-x-2 mt-8 opacity-40 grayscale">
               <ShieldCheck size={14} />
               <p className="text-[9px] font-black uppercase tracking-[0.2em]">Compra 100% Protegida</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;