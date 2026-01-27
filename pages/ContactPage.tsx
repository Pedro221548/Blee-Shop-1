
import React from 'react';
import { MessageSquare, Instagram, ShoppingBag, ExternalLink, Globe, Heart, Smartphone } from 'lucide-react';
import { useProducts } from '../ProductContext';
import BeeLogo from '../components/BeeLogo';

const ContactPage: React.FC = () => {
  const { settings } = useProducts();

  const contactMethods = [
    {
      id: 'whatsapp',
      title: 'WhatsApp Oficial',
      description: 'Fale direto com o George para orçamentos e dúvidas técnicas.',
      value: 'Iniciar Conversa',
      link: `https://wa.me/${settings.whatsapp?.replace(/\D/g, '')}`,
      icon: <MessageSquare size={28} />,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      lightBg: 'bg-green-50'
    },
    {
      id: 'instagram',
      title: 'Instagram',
      description: 'Acompanhe os bastidores e novos projetos da nossa oficina.',
      value: '@bleeshop',
      link: settings.instagram || 'https://instagram.com',
      icon: <Instagram size={28} />,
      color: 'bg-pink-500',
      textColor: 'text-pink-600',
      lightBg: 'bg-pink-50'
    },
    {
      id: 'ml',
      title: 'Mercado Livre',
      description: 'Nossa loja oficial com envios Full e garantia Mercado Pago.',
      value: 'Ver Catálogo ML',
      link: settings.mercadolivre || 'https://mercadolivre.com.br',
      icon: <ShoppingBag size={28} />,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      lightBg: 'bg-blue-50'
    },
    {
      id: 'shopee',
      title: 'Shopee',
      description: 'Aproveite cupons de frete grátis na nossa loja Shopee.',
      value: 'Ver Catálogo Shopee',
      link: settings.shopee || 'https://shopee.com.br',
      icon: <Globe size={28} />,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      lightBg: 'bg-orange-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <section className="bg-white pt-20 pb-16 border-b border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 rounded-2xl bg-amber-400 text-gray-900 shadow-xl shadow-amber-200/50 mb-8 animate-bounce-slow">
            <BeeLogo size={32} />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-6 leading-none">
            Entre em Contato <br className="hidden md:block"/>
            com a <span className="text-amber-500 italic">Colmeia.</span>
          </h1>
          <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Estamos prontos para tirar sua ideia do papel. Seja via WhatsApp para orçamentos personalizados ou através de nossas lojas oficiais.
          </p>
        </div>
      </section>

      {/* Contact Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {contactMethods.map((method) => (
            <a 
              key={method.id}
              href={method.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-[3rem] border border-gray-100 p-10 flex flex-col md:flex-row items-center text-center md:text-left gap-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
            >
              <div className={`${method.lightBg} ${method.textColor} p-6 rounded-[2rem] shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                {method.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">{method.title}</h3>
                  <ExternalLink size={16} className="text-gray-300 group-hover:text-gray-900 transition-colors" />
                </div>
                <p className="text-gray-500 font-medium mb-6 text-sm leading-relaxed max-w-xs md:max-w-none">
                  {method.description}
                </p>
                <span className={`inline-flex items-center font-black text-xs uppercase tracking-widest ${method.textColor}`}>
                  {method.value}
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Direct Call to Action */}
      <section className="max-w-5xl mx-auto px-4 pb-24 text-center">
        <div className="bg-gray-900 rounded-[3.5rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-64 h-64 bg-amber-400/5 rounded-full blur-[80px] -ml-32 -mt-32"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 text-amber-400 text-[10px] font-black uppercase tracking-[0.4em] mb-8">
              <Smartphone size={14} />
              <span>Atendimento Direto</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">Dúvidas sobre o seu projeto 3D?</h2>
            <p className="text-gray-400 font-medium mb-12 max-w-xl mx-auto">
              Se você tem um arquivo pronto para imprimir ou quer criar algo do zero, o George pode te ajudar a escolher o melhor material e escala.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href={`https://wa.me/${settings.whatsapp?.replace(/\D/g, '')}`}
                className="bg-amber-400 text-gray-900 px-10 py-5 rounded-2xl font-black text-sm hover:bg-white transition-all shadow-xl shadow-amber-900/20 active:scale-95 flex items-center justify-center gap-3"
              >
                <MessageSquare size={18} />
                FALAR COM O GEORGE
              </a>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-white/10 text-white px-10 py-5 rounded-2xl font-black text-sm hover:bg-white/20 transition-all border border-white/10"
              >
                VER REDES SOCIAIS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Quote */}
      <section className="max-w-7xl mx-auto px-4 pb-12 text-center">
        <p className="text-gray-300 font-black italic flex items-center justify-center gap-3">
          <Heart size={16} className="text-red-400" /> 
          Feito com carinho na oficina Blee Shop
        </p>
      </section>
    </div>
  );
};

export default ContactPage;
