
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ArrowRight, Truck, Info } from 'lucide-react';
import { useCart } from '../CartContext';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [cep, setCep] = useState('');
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [calculating, setCalculating] = useState(false);

  const calculateShipping = () => {
    if (cep.length < 8) return;
    setCalculating(true);
    setTimeout(() => {
      // Mock de cálculo baseado em dígitos do CEP
      const price = cep.startsWith('0') ? 15.00 : 25.00;
      setShippingCost(price);
      setCalculating(false);
    }, 800);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 max-w-lg mx-auto">
          <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
            <Trash2 size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Seu carrinho está vazio</h2>
          <p className="text-gray-500 mb-8">Parece que você ainda não adicionou nenhum item incrível. Vamos mudar isso?</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all inline-flex items-center space-x-2 shadow-lg shadow-indigo-100"
          >
            <ArrowLeft size={18} />
            <span>Ver Produtos</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Meu Carrinho</h1>
        <button 
          onClick={clearCart}
          className="text-red-500 hover:text-red-700 font-bold text-sm flex items-center space-x-2 transition-colors"
        >
          <Trash2 size={16} />
          <span>Limpar Carrinho</span>
        </button>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-start">
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map(item => (
            <div key={item.id} className="bg-white rounded-2xl p-5 flex items-center border border-gray-100 hover:shadow-md transition-all">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl shadow-sm" />
              <div className="ml-6 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                    <p className="text-gray-400 text-xs mb-3">{item.category}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-1.5 border border-gray-100">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-white rounded-lg transition-colors text-gray-600 shadow-sm"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-white rounded-lg transition-colors text-gray-600 shadow-sm"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">R$ {item.price.toFixed(2)} / un</p>
                    <span className="text-lg font-extrabold text-indigo-600">
                      R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-6">
            <Link to="/" className="text-indigo-600 font-bold flex items-center space-x-2 hover:translate-x-[-4px] transition-transform">
              <ArrowLeft size={18} />
              <span>Continuar comprando</span>
            </Link>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-4 mt-12 lg:mt-0">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-100 space-y-6 sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 border-b border-gray-50 pb-4">Resumo</h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Subtotal</span>
                <span>R$ {cartTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              
              <div className="space-y-3 bg-gray-50 p-4 rounded-2xl">
                <div className="flex justify-between text-gray-600 text-xs font-bold uppercase tracking-wider">
                  <span>Simular Frete</span>
                  <Truck size={14} className="text-indigo-600" />
                </div>
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    placeholder="CEP: 00000-000"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button 
                    onClick={calculateShipping}
                    className="bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-black transition-colors disabled:opacity-50"
                    disabled={calculating || cep.length < 8}
                  >
                    {calculating ? '...' : 'OK'}
                  </button>
                </div>
                {shippingCost !== null && (
                  <div className="flex justify-between items-center text-indigo-700 font-bold animate-in fade-in duration-300">
                    <span className="text-xs">Valor do frete:</span>
                    <span className="text-sm">R$ {shippingCost.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-6 flex justify-between text-2xl font-extrabold text-gray-900">
                <span>Total</span>
                <span className="text-indigo-600">R$ {(cartTotal + (shippingCost || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center space-x-3 shadow-lg shadow-indigo-100 active:scale-95"
            >
              <span>Fechar Pedido</span>
              <ArrowRight size={20} />
            </button>
            
            <div className="flex items-center justify-center space-x-2 text-gray-400">
              <Info size={14} />
              <span className="text-[10px] uppercase font-bold tracking-widest text-center">Checkout 100% Seguro</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
