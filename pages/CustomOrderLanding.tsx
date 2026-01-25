
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Box, Coffee, MessageSquare, ShieldCheck, Zap, Palette, Layers } from 'lucide-react';

const CustomOrderLanding: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section with Provided Image 2 (maislaudo) */}
      <section className="relative h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://maislaudo.com.br/wp-content/uploads/2021/07/iStock-656292902.jpg" 
            className="w-full h-full object-cover opacity-30 scale-105"
            alt="Planejamento Tecnológico"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-400 text-gray-900 mb-6">
              Estúdio de Criação Blee
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-6 leading-tight">
              Sua Ideia, <br/>
              <span className="text-amber-500">Nossa Produção.</span>
            </h1>
            <p className="text-lg text-gray-500 font-medium mb-10 max-w-lg">
              De modelagens 3D complexas a canecas personalizadas exclusivas. Transformamos sua imaginação em itens físicos com precisão cirúrgica e tecnologia de ponta.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/login" 
                className="bg-gray-900 text-white px-10 py-5 rounded-2xl font-bold hover:bg-amber-500 transition-all shadow-xl flex items-center justify-center space-x-3 group"
              >
                <span>Entrar e Orçar</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section with Provided Image 1 (mlstatic) */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="absolute -inset-4 border-2 border-amber-100 rounded-[3rem] -rotate-3 z-0"></div>
              <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <img 
                  src="https://http2.mlstatic.com/D_NQ_NP_2X_763785-MLB103725084010_012026-F.webp" 
                  className="w-full h-auto"
                  alt="Processo de Produção Blee"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-amber-400 p-6 rounded-3xl shadow-xl z-20 animate-bounce-slow">
                <Box className="text-gray-900" size={32} />
              </div>
            </div>

            <div className="space-y-12">
              <div>
                <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Como a Mágica Acontece?</h2>
                <p className="text-gray-500 font-medium leading-relaxed">
                  Não somos apenas uma loja, somos uma oficina de precisão. Veja como é simples ter seu produto personalizado:
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 shrink-0">
                    <Layers className="text-amber-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-lg">1. Envie sua Referência</h3>
                    <p className="text-sm text-gray-500 font-medium">Faça o login e anexe fotos ou descreva seu projeto de impressão 3D ou arte de caneca.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 shrink-0">
                    <MessageSquare className="text-amber-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-lg">2. Orçamento via WhatsApp</h3>
                    <p className="text-sm text-gray-500 font-medium">O George analisará seu pedido e entrará em contato direto para validar preços e detalhes técnicos.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 shrink-0">
                    <Zap className="text-amber-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-lg">3. Produção & Envio</h3>
                    <p className="text-sm text-gray-500 font-medium">Após aprovação, colocamos nossas impressoras e prensas para trabalhar. Você recebe fotos do processo!</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                 <Link to="/login" className="text-amber-600 font-black flex items-center space-x-2 hover:translate-x-2 transition-all">
                  <span>Comece seu projeto agora</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-xs font-black text-amber-500 uppercase tracking-[0.3em] mb-4">O que fabricamos</h2>
        <h3 className="text-4xl font-black text-gray-900 tracking-tight mb-16">Especialidades da Colmeia</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 hover:bg-white hover:shadow-2xl transition-all group">
            <div className="bg-white p-5 rounded-3xl inline-block shadow-sm mb-6 group-hover:scale-110 transition-transform">
              <Box className="text-amber-500" size={32} />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Impressão 3D</h4>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">Miniaturas, suportes, protótipos industriais e peças de reposição com materiais premium.</p>
          </div>

          <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 hover:bg-white hover:shadow-2xl transition-all group">
            <div className="bg-white p-5 rounded-3xl inline-block shadow-sm mb-6 group-hover:scale-110 transition-transform">
              <Coffee className="text-amber-500" size={32} />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Canecas Criativas</h4>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">Sua arte, logo ou foto em cerâmica de alta densidade com brilho eterno e resistência a micro-ondas.</p>
          </div>

          <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 hover:bg-white hover:shadow-2xl transition-all group">
            <div className="bg-white p-5 rounded-3xl inline-block shadow-sm mb-6 group-hover:scale-110 transition-transform">
              <Palette className="text-amber-500" size={32} />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Design Gráfico</h4>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">Não tem a arte? Nós criamos para você! Nossa equipe de design modela e vetoriza sua ideia.</p>
          </div>
        </div>

        <div className="mt-20 p-10 bg-gray-900 rounded-[3.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-left">
            <h4 className="text-2xl font-black mb-2 flex items-center gap-3">
              <ShieldCheck className="text-amber-400" /> 
              Pronto para voar alto?
            </h4>
            <p className="text-gray-400 font-medium">Acesse sua conta e fale direto com o George na oficina.</p>
          </div>
          <Link to="/login" className="bg-amber-400 text-gray-900 px-10 py-5 rounded-2xl font-black hover:bg-white transition-all whitespace-nowrap">
            Acessar Área do Cliente
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CustomOrderLanding;
