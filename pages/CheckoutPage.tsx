
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
    payment: 'credit'
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
   * Prepara os dados e simula a criação de uma preferência no Mercado Pago.
   * No futuro, esta função fará um POST para o seu backend.
   */
  const handleMercadoPagoCheckout = async () => {
    if (!shippingInfo) {
      alert("Por favor, calcule o frete antes de prosseguir.");
      return;
    }

    setIsProcessingPayment(true);

    const orderData = {
      payer: {
        name: form.nome,
        email: form.email,
        address: {
          zip_code: form.cep,
          street_name: form.endereco
        }
      },
      items: cart.map(item => ({
        id: item.id.toString(),
        title: item.name,
        unit_price: item.price,
        quantity: item.quantity,
        currency_id: 'BRL'
      })),
      shipment_cost: shippingInfo.cost,
      total_amount: cartTotal + shippingInfo.cost
    };

    console.log("Enviando dados para o backend (Mercado Pago):", orderData);

    try {
      // Simulação de chamada de API ao backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      /**
       * TODO: Integração real
       * const response = await fetch('/api/create-preference', {
       *   method: 'POST',
       *   body: JSON.stringify(orderData)
       * });
       * const { init_point } = await response.json();
       * window.location.href = init_point; // Redireciona para o Checkout Pro
       */

      // Para fins de demonstração, simulamos sucesso local
      setSuccess(true);
      setTimeout(() => clearCart(), 500);
    } catch (error) {
      alert("Erro ao iniciar pagamento com Mercado Pago.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.payment === 'mercadopago') {
      handleMercadoPagoCheckout();
      return;
    }

    if (!shippingInfo) {
      alert("Por favor, calcule o frete antes de finalizar.");
      return;
    }
    setSuccess(true);
    setTimeout(() => clearCart(), 500);
  };

  if (success) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-in zoom-in duration-500">
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 max-w-lg mx-auto">
          <div className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Pedido Realizado!</h2>
          <p className="text-gray-500 mb-10">Obrigado por comprar na NovaStyle. Processaremos seu pedido assim que o pagamento for confirmado.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all"
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
      <h1 className="text-3xl font-bold text-gray-900 mb-10 text-center">Finalizar Compra</h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-start">
        <form onSubmit={handleFinish} className="lg:col-span-8 space-y-12">
          {/* Entrega */}
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <MapPin className="text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-900">Informações de Entrega</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Nome Completo</label>
                <input required type="text" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Ex: João Silva" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">E-mail</label>
                <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="exemplo@email.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">CEP</label>
                <div className="flex space-x-2">
                  <input required type="text" maxLength={9} value={form.cep} onChange={e => setForm({...form, cep: e.target.value})} className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="00000-000" />
                  <button type="button" onClick={calcularFrete} disabled={isCalculating || form.cep.length < 8} className="bg-gray-900 text-white px-4 py-3 rounded-xl font-bold text-xs hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center justify-center min-w-[120px]">
                    {isCalculating ? <Loader2 className="animate-spin" size={16} /> : "Calcular Frete"}
                  </button>
                </div>
              </div>

              {shippingInfo && (
                <div className="md:col-span-2 bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex flex-wrap gap-6 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center space-x-2">
                    <Truck className="text-indigo-600" size={18} />
                    <span className="text-sm font-bold text-indigo-900">R$ {shippingInfo.cost.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="text-indigo-600" size={18} />
                    <span className="text-sm font-medium text-indigo-800">Entrega em: {shippingInfo.days}</span>
                  </div>
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Endereço Completo</label>
                <input required type="text" value={form.endereco} onChange={e => setForm({...form, endereco: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Rua, número, complemento e bairro" />
              </div>
            </div>
          </section>

          {/* Pagamento */}
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <CreditCard className="text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-900">Pagamento</h2>
            </div>
            
            <div className="space-y-4">
              <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${form.payment === 'mercadopago' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                <input type="radio" name="payment" checked={form.payment === 'mercadopago'} onChange={() => setForm({...form, payment: 'mercadopago'})} className="hidden" />
                <div className="flex-1 flex items-center">
                  <Wallet className={`mr-3 ${form.payment === 'mercadopago' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <div>
                    <p className="font-bold text-gray-900">Mercado Pago</p>
                    <p className="text-xs text-gray-500">Cartão, Pix ou Saldo MP via Checkout Pro</p>
                  </div>
                </div>
                {form.payment === 'mercadopago' && <CheckCircle2 size={20} className="text-blue-600" />}
              </label>

              <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${form.payment === 'pix' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-200'}`}>
                <input type="radio" name="payment" checked={form.payment === 'pix'} onChange={() => setForm({...form, payment: 'pix'})} className="hidden" />
                <div className="flex-1 flex items-center">
                  <div className={`mr-3 font-bold text-lg ${form.payment === 'pix' ? 'text-indigo-600' : 'text-gray-400'}`}>PX</div>
                  <div>
                    <p className="font-bold text-gray-900">Pix Direto</p>
                    <p className="text-xs text-gray-500">Aprovação imediata com 5% OFF</p>
                  </div>
                </div>
              </label>
            </div>
          </section>

          <div className="sticky bottom-4 lg:hidden">
             <button type="submit" disabled={!shippingInfo || isProcessingPayment} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-indigo-100 disabled:opacity-50">
                {isProcessingPayment ? <Loader2 className="animate-spin mx-auto" /> : (form.payment === 'mercadopago' ? "Pagar com Mercado Pago" : "Confirmar Compra")}
             </button>
          </div>
        </form>

        {/* Resumo */}
        <div className="lg:col-span-4 mt-12 lg:mt-0">
          <div className="bg-gray-900 text-white rounded-3xl p-8 sticky top-24">
            <h3 className="text-xl font-bold mb-8">Resumo do Pedido</h3>
            
            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover mr-3" />
                    <div>
                      <p className="font-medium line-clamp-1">{item.name}</p>
                      <p className="text-gray-400 text-xs">Qtd: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-bold">R$ {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-800 pt-6 space-y-3 mb-8">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Subtotal</span>
                <span>R$ {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>Frete</span>
                <span>{shippingInfo ? `R$ ${shippingInfo.cost.toFixed(2)}` : '--'}</span>
              </div>
              <div className="flex justify-between text-xl font-extrabold text-white pt-2">
                <span>Total</span>
                <span className="text-indigo-400">R$ {finalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <button 
              onClick={handleFinish}
              disabled={!shippingInfo || isProcessingPayment}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed ${form.payment === 'mercadopago' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white'}`}
            >
              {isProcessingPayment ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <span>{form.payment === 'mercadopago' ? "Pagar com Mercado Pago" : "Finalizar Pedido"}</span>
              )}
            </button>
            <p className="text-center text-xs text-gray-500 mt-4">Plataforma segura e certificada.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
