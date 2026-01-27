
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, MapPin, CheckCircle2, Clock, Loader2, Wallet } from 'lucide-react';
import { useCart } from '../CartContext';

const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
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

  if (cart.length === 0 && !success) {
    navigate('/');
    return null;
  }

  const calcularFrete = async () => {
    const rawCep = form.cep.replace(/\D/g, '');
    if (rawCep.length < 8) {
      alert("Por favor, digite um CEP válido com 8 dígitos.");
      return;
    }

    setIsCalculating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      const isMetropolitan = rawCep.startsWith('0');
      const cost = isMetropolitan ? 14.90 : 28.50;
      const days = isMetropolitan ? "2 a 4 dias úteis" : "5 a 10 dias úteis";
      setShippingInfo({ cost, days });
    } catch (error) {
      console.error("Erro ao calcular frete:", error);
      alert("Erro ao calcular o frete.");
    } finally {
      setIsCalculating(false);
    }
  };

  /**
   * Função principal de finalização de compra integrada com a API dinâmica.
   */
  const finalizarCompra = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!shippingInfo) {
      alert("Por favor, calcule o frete antes de finalizar.");
      return;
    }

    setIsProcessingPayment(true);
    try {
      // Envia os itens do carrinho e o frete para o servidor criar a preferência real
      const response = await fetch("/api/criar-pagamento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
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

      if (data.link) {
        // Redireciona o usuário para o Checkout Pro do Mercado Pago com os itens REAIS
        window.location.href = data.link;
      } else {
        alert("Erro ao gerar link de pagamento. Verifique o console.");
        console.error("Resposta da API sem link:", data);
      }
    } catch (error) {
      console.error("Erro na conexão com a API de pagamento:", error);
      alert("Erro ao conectar com o servidor de pagamento. Verifique se o token MP_ACCESS_TOKEN está configurado.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-in zoom-in duration-500">
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 max-w-lg mx-auto">
          <div className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">Pedido Realizado!</h2>
          <p className="text-gray-500 mb-10">Obrigado por comprar na Blee Shop. Processaremos seu pedido assim que o pagamento for confirmado.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-amber-400 text-gray-900 px-10 py-4 rounded-xl font-bold hover:bg-amber-500 transition-all shadow-lg"
          >
            Voltar para a Home
          </button>
        </div>
      </div>
    );
  }

  const finalTotal = cartTotal + (shippingInfo?.cost || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-black text-gray-900 mb-10 text-center uppercase tracking-tight">Finalizar Compra</h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-start">
        <form onSubmit={finalizarCompra} className="lg:col-span-8 space-y-12">
          {/* Entrega */}
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <MapPin className="text-amber-500" />
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Informações de Entrega</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Nome Completo</label>
                <input required type="text" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium" placeholder="Ex: João Silva" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">E-mail</label>
                <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium" placeholder="exemplo@email.com" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">CEP</label>
                <div className="flex space-x-2">
                  <input required type="text" maxLength={9} value={form.cep} onChange={e => setForm({...form, cep: e.target.value})} className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold" placeholder="00000-000" />
                  <button type="button" onClick={calcularFrete} disabled={isCalculating || form.cep.length < 8} className="bg-gray-900 text-white px-4 py-3 rounded-xl font-black text-[10px] uppercase hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center justify-center min-w-[120px] shadow-md">
                    {isCalculating ? <Loader2 className="animate-spin" size={16} /> : "Calcular Frete"}
                  </button>
                </div>
              </div>

              {shippingInfo && (
                <div className="md:col-span-2 bg-amber-50 border border-amber-100 p-4 rounded-2xl flex flex-wrap gap-6 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center space-x-2">
                    <Truck className="text-amber-600" size={18} />
                    <span className="text-sm font-black text-amber-900 uppercase">Frete: R$ {shippingInfo.cost.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="text-amber-600" size={18} />
                    <span className="text-sm font-bold text-amber-800">Prazo: {shippingInfo.days}</span>
                  </div>
                </div>
              )}

              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Endereço Completo</label>
                <input required type="text" value={form.endereco} onChange={e => setForm({...form, endereco: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium" placeholder="Rua, número, complemento e bairro" />
              </div>
            </div>
          </section>

          {/* Pagamento */}
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <CreditCard className="text-amber-500" />
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Pagamento</h2>
            </div>
            
            <div className="space-y-4">
              <label className={`flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all ${form.payment === 'mercadopago' ? 'border-amber-400 bg-amber-50' : 'border-gray-50 hover:border-amber-100'}`}>
                <input type="radio" name="payment" checked={form.payment === 'mercadopago'} onChange={() => setForm({...form, payment: 'mercadopago'})} className="hidden" />
                <div className="flex-1 flex items-center">
                  <div className={`p-3 rounded-xl mr-4 ${form.payment === 'mercadopago' ? 'bg-amber-400 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <Wallet size={20} />
                  </div>
                  <div>
                    <p className="font-black text-gray-900 text-sm">Mercado Pago</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Cartão, Pix ou Saldo (Checkout Pro)</p>
                  </div>
                </div>
                {form.payment === 'mercadopago' && <CheckCircle2 size={24} className="text-amber-500" />}
              </label>

              <label className={`flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all ${form.payment === 'pix' ? 'border-amber-400 bg-amber-50' : 'border-gray-50 hover:border-amber-100'}`}>
                <input type="radio" name="payment" checked={form.payment === 'pix'} onChange={() => setForm({...form, payment: 'pix'})} className="hidden" />
                <div className="flex-1 flex items-center">
                  <div className={`p-3 rounded-xl mr-4 font-black text-sm flex items-center justify-center ${form.payment === 'pix' ? 'bg-amber-400 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    PIX
                  </div>
                  <div>
                    <p className="font-black text-gray-900 text-sm">Pix Direto</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Pagamento instantâneo via QR Code</p>
                  </div>
                </div>
                {form.payment === 'pix' && <CheckCircle2 size={24} className="text-amber-500" />}
              </label>
            </div>
          </section>

          <div className="sticky bottom-4 lg:hidden">
             <button type="submit" disabled={!shippingInfo || isProcessingPayment} className="w-full bg-amber-400 text-gray-900 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-amber-200/50 disabled:opacity-50 active:scale-95 transition-all">
                {isProcessingPayment ? <Loader2 className="animate-spin mx-auto" /> : "FAZER PEDIDO"}
             </button>
          </div>
        </form>

        {/* Resumo */}
        <div className="lg:col-span-4 mt-12 lg:mt-0">
          <div className="bg-gray-900 text-white rounded-[2.5rem] p-8 sticky top-24 shadow-2xl shadow-gray-200">
            <h3 className="text-xl font-black mb-8 uppercase tracking-widest text-amber-400">Resumo</h3>
            
            <div className="space-y-5 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <img src={item.image} alt="" className="w-12 h-12 rounded-xl object-cover mr-4 border border-gray-800" />
                    <div className="min-w-0">
                      <p className="font-bold text-gray-100 truncate w-32">{item.name}</p>
                      <p className="text-gray-500 text-[10px] font-black uppercase">Qtd: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-black text-gray-100">R$ {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-800 pt-6 space-y-4 mb-8">
              <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-gray-500">
                <span>Subtotal</span>
                <span>R$ {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-gray-500">
                <span>Frete</span>
                <span>{shippingInfo ? `R$ ${shippingInfo.cost.toFixed(2)}` : '--'}</span>
              </div>
              <div className="flex justify-between text-2xl font-black text-white pt-2 border-t border-gray-800/50">
                <span className="text-lg">TOTAL</span>
                <span className="text-amber-400">R$ {finalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <button 
              onClick={() => finalizarCompra()}
              disabled={!shippingInfo || isProcessingPayment}
              className={`w-full py-5 rounded-2xl font-black text-base transition-all flex items-center justify-center space-x-3 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed bg-amber-400 hover:bg-amber-500 text-gray-900 active:scale-95`}
            >
              {isProcessingPayment ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <span>FAZER PEDIDO</span>
              )}
            </button>
            <p className="text-center text-[9px] text-gray-500 mt-6 font-black uppercase tracking-[0.2em] opacity-50">Checkout Seguro via SSL</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
