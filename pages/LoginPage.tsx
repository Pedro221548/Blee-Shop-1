
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { User, ShieldCheck, Mail, Lock, ArrowRight, AlertCircle, Fingerprint } from 'lucide-react';
import BeeLogo from '../components/BeeLogo';

type LoginMode = 'login' | 'signup' | 'responsible';

const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<LoginMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup') {
      if (!name || !email || !password || !confirmPassword) {
        setError('Por favor, preencha todos os campos da sua nova conta.');
        return;
      }
      if (password !== confirmPassword) {
        setError('As senhas não coincidem.');
        return;
      }
      login(email, 'client');
      navigate('/');
      return;
    }

    if (mode === 'responsible') {
      const validEmail = 'George.ciqueira@gmail.com';
      const validPass = 'Pe102030';

      if (email.toLowerCase() === validEmail.toLowerCase() && password === validPass) {
        login(email, 'responsible');
        navigate('/admin');
      } else {
        setError('Credenciais de administrador incorretas.');
      }
    } else {
      if (!email || !password) {
        setError('E-mail e senha são obrigatórios.');
        return;
      }
      login(email, 'client');
      navigate('/');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gray-50/50">
      <div className="max-w-md w-full">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-block bg-amber-400 p-3 rounded-[1.25rem] shadow-xl shadow-amber-200/50 mb-6">
            <BeeLogo size={48} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
            {mode === 'signup' ? 'Nova Conta' : mode === 'responsible' ? 'Painel de Gestão' : 'Acesse a Colmeia'}
          </h1>
          <p className="text-gray-400 font-medium text-sm">
            {mode === 'signup' ? 'Inicie sua jornada conosco' : 'Sua vitrine de tecnologia favorita'}
          </p>
        </div>

        {/* Tab Selector - Simplified to Entrar | Gestão */}
        <div className="flex bg-gray-200/50 p-1.5 rounded-2xl mb-8">
          <button 
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-bold text-xs transition-all duration-300 ${mode === 'login' || mode === 'signup' ? 'bg-white text-gray-900 shadow-lg shadow-gray-200/50' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <User size={16} />
            <span>Entrar</span>
          </button>
          <button 
            type="button"
            onClick={() => { setMode('responsible'); setError(null); }}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-bold text-xs transition-all duration-300 ${mode === 'responsible' ? 'bg-white text-gray-900 shadow-lg shadow-gray-200/50' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <ShieldCheck size={16} />
            <span>Gestão</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/40">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center space-x-2 bg-red-50 border border-red-100 p-4 rounded-2xl text-red-600 text-xs font-bold animate-zoom-in">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {mode === 'signup' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-300">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome Completo</label>
                <div className="relative">
                  <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    type="text" 
                    required
                    placeholder="João Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none transition-all font-medium"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none transition-all font-medium"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-300">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirmar Senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none transition-all font-medium"
                  />
                </div>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-[#12141d] text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95 group mt-4"
            >
              <span className="text-sm">
                {mode === 'signup' ? 'Criar minha Conta' : mode === 'responsible' ? 'Acessar Gestão' : 'Entrar na Loja'}
              </span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            {mode === 'login' ? (
              <p className="text-xs text-gray-400 font-bold">
                Ainda não voa com a gente? <button onClick={() => setMode('signup')} className="text-amber-500 hover:text-amber-600 ml-1">Criar conta</button>
              </p>
            ) : mode === 'signup' ? (
              <p className="text-xs text-gray-400 font-bold">
                Já tem um registro? <button onClick={() => setMode('login')} className="text-amber-500 hover:text-amber-600 ml-1">Fazer login</button>
              </p>
            ) : (
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 py-2 px-4 rounded-full inline-block">
                Acesso Restrito ao Administrador
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
