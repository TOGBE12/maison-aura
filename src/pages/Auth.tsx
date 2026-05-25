import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Lock, User, Key, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export const Auth: React.FC = () => {
  const { login, register, navigateTo, showToast, customRoute } = useApp();
  const initialFormType = customRoute.page === 'register' ? 'register' : 'login';
  const [formType, setFormType] = useState<'login' | 'register' | 'forgot'>(initialFormType);
  const [submitting, setSubmitting] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (formType === 'login') {
        if (!email || !password) {
          showToast('Veuillez compléter l\'adresse email et le mot de passe.', 'error');
          setSubmitting(false);
          return;
        }
        const success = await login(email, password);
        if (success) {
          const isAdmin = email.includes('admin') || email.includes('marilyn');
          navigateTo(isAdmin ? 'dashboard' : 'home');
        }
      } else if (formType === 'register') {
        if (!name || !email || !password) {
          showToast('Veuillez compléter l\'intégralité des saisies d\'inscription.', 'error');
          setSubmitting(false);
          return;
        }
        const success = await register(name, email, password);
        if (success) {
          navigateTo('home');
        }
      } else {
        if (!email) {
          showToast('Veuillez indiquer votre adresse email.', 'error');
          setSubmitting(false);
          return;
        }
        showToast(`Instructions de renouvellement de mot de passe transmises à ${email}.`, 'success');
        setFormType('login');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickRolesPreFill = (role: 'admin' | 'buyer') => {
    if (role === 'admin') {
      setEmail('marilyn@maisonaura.com');
      setPassword('password');
      setName('Marilyn Aura');
      showToast('Identifiants administrateur de la boutique pré-remplis.', 'info');
    } else {
      setEmail('acheteuse.luxe@voila.fr');
      setPassword('password');
      setName('Clarisse de Beaupré');
      showToast('Identifiants acheteuse cliente pré-remplis.', 'info');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-32 min-h-screen flex items-center justify-center" id="auth-page-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full bg-white p-6 md:p-8 rounded-2xl border border-neutral-100 shadow-xl"
      >
        
        <div className="text-center mb-8">
          <span className="text-[10px] tracking-[0.3em] font-mono text-[#BF986B] uppercase font-bold">
            CLUB PRIVILEGE MV LUXURY
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-light text-neutral-800 uppercase mt-2">
            {formType === 'login' && 'Se connecter'}
            {formType === 'register' && 'Rejoindre le Club'}
            {formType === 'forgot' && 'Accès Perdu'}
          </h1>
          <p className="text-xs text-neutral-400 mt-2 font-sans">
            {formType === 'login' && 'Connectez-vous avec votre email et mot de passe.'}
            {formType === 'register' && 'Inscrivez-vous pour obtenir les invitations exclusives.'}
            {formType === 'forgot' && 'Indiquez votre adresse pour réinitialiser le mot de passe.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {formType === 'register' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase tracking-widest text-[#BF986B] font-mono font-bold">
                Votre Prénom & Nom
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Hélène de Chancel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-neutral-50 border w-full text-xs px-3.5 py-2.5 pl-9 rounded-xl focus:outline-none focus:border-neutral-900"
                  required
                />
                <User size={13} className="absolute left-3 top-3.5 text-neutral-400" />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] uppercase tracking-widest text-[#BF986B] font-mono font-bold">
              Adresse Électronique
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="helene.chancel@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-neutral-50 border w-full text-xs px-3.5 py-2.5 pl-9 rounded-xl focus:outline-none focus:border-neutral-900"
                required
              />
              <Mail size={13} className="absolute left-3 top-3.5 text-neutral-400" />
            </div>
          </div>

          {formType !== 'forgot' && (
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[9px] uppercase tracking-widest text-[#BF986B] font-mono font-bold">
                  Mot de passe confidentiel
                </label>
                {formType === 'login' && (
                  <button
                    type="button"
                    onClick={() => setFormType('forgot')}
                    className="text-[10px] text-[#BF986B] font-mono uppercase tracking-widest font-semibold hover:text-black"
                  >
                    Oublié ?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-neutral-50 border w-full text-xs px-3.5 py-2.5 pl-9 rounded-xl focus:outline-none focus:border-neutral-900"
                  required
                />
                <Lock size={13} className="absolute left-3 top-3.5 text-neutral-400" />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-3.5 py-3.5 bg-neutral-900 hover:bg-[#BF986B] text-white text-[10px] font-mono uppercase font-bold tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
            id="auth-form-submit"
          >
            {submitting ? 'Connexion...' : formType === 'login' ? 'Entrer dans la Maison' : 'Rejoindre l\'Atelier'}
            <ArrowRight size={12} />
          </button>
        </form>

        <div className="text-center mt-6 pt-5 border-t border-neutral-100 text-[11px] text-neutral-500 font-sans">
          {formType === 'login' && (
            <p>
              Pas de compte ?{' '}
              <button
                onClick={() => setFormType('register')}
                className="font-semibold text-neutral-850 underline hover:text-[#BF986B] transition-colors"
              >
                Inscrivez-vous ici
              </button>
            </p>
          )}

          {formType === 'register' && (
            <p>
              Déjà membre ?{' '}
              <button
                onClick={() => setFormType('login')}
                className="font-semibold text-neutral-850 underline hover:text-[#BF986B] transition-colors"
              >
                Connectez-vous ici
              </button>
            </p>
          )}

          {formType === 'forgot' && (
            <button
              onClick={() => setFormType('login')}
              className="font-semibold text-neutral-850 underline hover:text-[#BF986B]"
            >
              Retourner à la page connexion
            </button>
          )}
        </div>

        <div className="mt-8 bg-[#FAF8F5] border border-neutral-200/50 p-4 rounded-xl">
          <p className="text-[9px] text-neutral-400 font-mono uppercase tracking-widest text-center font-bold mb-3">
            Accès rapide de démonstration
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => handleQuickRolesPreFill('admin')}
              className="flex-1 py-1.5 px-2 bg-neutral-900 text-white rounded-lg text-[9px] font-mono uppercase tracking-widest font-bold transition-all hover:bg-neutral-800"
              id="quick-demo-admin"
            >
              👑 Profil Vendeuse
            </button>
            <button
              type="button"
              onClick={() => handleQuickRolesPreFill('buyer')}
              className="flex-1 py-1.5 px-2 bg-[#BF986B]/10 text-[#BF986B] border border-[#BF986B]/35 rounded-lg text-[9px] font-mono uppercase tracking-widest font-bold transition-all hover:bg-[#BF986B]/20"
              id="quick-demo-client"
            >
              👜 Profil Acheteur
            </button>
          </div>
        </div>

        <div className="flex justify-center items-center gap-1.5 mt-6 text-[10px] text-neutral-400 font-sans font-medium">
          <ShieldCheck size={12} className="text-[#BF986B]" />
          <span>Charte de protection des données SSL activée</span>
        </div>

      </motion.div>
    </div>
  );
};
