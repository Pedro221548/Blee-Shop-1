
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { HelpCircle, ShieldAlert, Lock, ArrowRight, Zap, Box, Coffee, ShieldCheck, Palette } from 'lucide-react';

const InfoPage: React.FC = () => {
  const { tab } = useParams<{ tab: string }>();
  
  const tabs = [
    { id: 'como-funciona', label: 'Como Funciona', icon: HelpCircle },
    { id: 'aviso-legal', label: 'Aviso Legal', icon: ShieldAlert },
    { id: 'privacidade', label: 'Privacidade', icon: Lock },
  ];

  const currentTab = tab || 'como-funciona';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Navigation */}
        <aside className="lg:w-64 shrink-0">
          <div className="sticky top-24 space-y-2">
            <h1 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 ml-4">Centro de Ajuda</h1>
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = currentTab === t.id;
              return (
                <Link
                  key={t.id}
                  to={`/info/${t.id}`}
                  className={`flex items-center space-x-3 px-6 py-4 rounded-2xl font-bold transition-all ${
                    isActive 
                      ? 'bg-amber-400 text-gray-900 shadow-lg shadow-amber-100 translate-x-2' 
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm">{t.label}</span>
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-[3rem] border border-gray-100 p-8 md:p-12 shadow-sm animate-slide-up">
          {currentTab === 'como-funciona' && (
            <div className="space-y-8">
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-amber-50 p-4 rounded-3xl text-amber-500">
                  <HelpCircle size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Criação & Tecnologia</h2>
                  <p className="text-gray-500 font-medium">Da modelagem 3D direto para sua casa.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
                  <Box className="text-amber-500 mb-4" size={24} />
                  <h3 className="text-lg font-bold mb-3">1. Fabricação Própria em 3D</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Nós somos especialistas em impressão 3D. Cada peça, de miniaturas a protótipos, é modelada e impressa aqui na Blee Shop com acabamento manual de excelência.
                  </p>
                </div>
                <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
                  <Palette className="text-amber-500 mb-4" size={24} />
                  <h3 className="text-lg font-bold mb-3">2. Canecas com sua Cara</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Personalização total. Criamos designs exclusivos para canecas cerâmicas de alta qualidade, garantindo que cada gole tenha o estilo da sua marca ou personalidade.
                  </p>
                </div>
                <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
                  <ShieldCheck className="text-amber-500 mb-4" size={24} />
                  <h3 className="text-lg font-bold mb-3">3. Curadoria Tech Blee</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Além das nossas criações, selecionamos os eletrônicos que usamos no dia a dia. Vendemos nossa curadoria via canais oficiais (ML/Shopee) para sua total segurança.
                  </p>
                </div>
                <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
                  <Zap className="text-amber-500 mb-4" size={24} />
                  <h3 className="text-lg font-bold mb-3">4. Atendimento George</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Precisa de um projeto especial? O George cuida de cada orçamento via WhatsApp para garantir que o seu pedido de 3D ou caneca saia exatamente como imaginou.
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentTab === 'aviso-legal' && (
            <div className="space-y-8">
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-red-50 p-4 rounded-3xl text-red-500">
                  <ShieldAlert size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Aviso Legal</h2>
                  <p className="text-gray-500 font-medium">Compromisso Blee Shop com a transparência.</p>
                </div>
              </div>

              <div className="prose prose-amber max-w-none text-gray-600 space-y-6 font-medium leading-relaxed">
                <p>
                  A <strong>Blee Shop</strong> é um estúdio de fabricação e personalização. Somos os produtores diretos de todos os itens de <strong>Impressão 3D e Canecas</strong> listados no site.
                </p>
                <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-2xl">
                  <p className="text-amber-900 text-sm font-bold">
                    Venda Direta: O faturamento e produção de itens personalizados ocorrem sob nossa responsabilidade direta. O contato via WhatsApp serve para validar orçamentos e detalhes técnicos de fabricação.
                  </p>
                </div>
                <p>
                  Para a nossa linha de <strong>Curadoria</strong>, utilizamos as plataformas Mercado Livre e Shopee como nossos parceiros logísticos e financeiros. Isso garante que você receba seu item com a agilidade do Full e a segurança do Mercado Pago.
                </p>
                <p>
                  Garantimos a originalidade e a qualidade Blee Shop em cada produto que sai da nossa oficina ou que é indicado por nossa equipe técnica.
                </p>
              </div>
            </div>
          )}

          {currentTab === 'privacidade' && (
            <div className="space-y-8">
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-3xl text-blue-500">
                  <Lock size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Privacidade</h2>
                  <p className="text-gray-500 font-medium">Sua criatividade protegida.</p>
                </div>
              </div>

              <div className="space-y-6 text-gray-600 font-medium">
                <section className="space-y-3">
                  <h3 className="text-gray-900 font-black uppercase text-xs tracking-widest">Proteção de Projetos</h3>
                  <p className="text-sm leading-relaxed">
                    Arquivos enviados para impressão 3D ou artes para canecas são de sua propriedade. Não compartilhamos nem utilizamos seus designs personalizados para outros fins sem autorização prévia.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-gray-900 font-black uppercase text-xs tracking-widest">Dados de Atendimento</h3>
                  <p className="text-sm leading-relaxed">
                    Utilizamos seu contato apenas para o processo comercial do seu pedido. Não enviamos spam nem compartilhamos sua lista de contatos com terceiros.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-gray-900 font-black uppercase text-xs tracking-widest">Transações Seguras</h3>
                  <p className="text-sm leading-relaxed">
                    Seja via Pix direto para nossa oficina ou através de nossas lojas oficiais, seu pagamento é processado por sistemas com criptografia de ponta a ponta.
                  </p>
                </section>
              </div>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-gray-50 flex justify-between items-center">
            <Link to="/" className="text-amber-600 font-black flex items-center space-x-2 text-sm hover:translate-x-[-4px] transition-transform">
              <ArrowRight size={18} className="rotate-180" />
              <span>Voltar para a Vitrine</span>
            </Link>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Blee Shop - Oficina de Ideias</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
