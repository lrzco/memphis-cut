import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Phone, Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { signUp, signIn } from '../lib/supabase';
import { checkRateLimit } from '../utils/security';
import { registrationSchema, loginSchema } from '../utils/validation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

type AuthMode = 'login' | 'register';

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const reset = () => { setFullName(''); setEmail(''); setPhone(''); setPassword(''); setConfirmPassword(''); setErrors({}); setGeneralError(''); setSuccessMessage(''); };
  const handleClose = () => { reset(); onClose(); };
  const switchMode = () => { reset(); setMode(m => m === 'login' ? 'register' : 'login'); };

  const handleLogin = async () => {
    if (!checkRateLimit('login', 5, 60000)) { setGeneralError('Trop de tentatives. Réessayez dans 1 minute.'); return; }
    const r = loginSchema.safeParse({ email, password });
    if (!r.success) { const e: Record<string,string> = {}; r.error.issues.forEach(i => e[i.path[0] as string] = i.message); setErrors(e); return; }
    setIsLoading(true); setErrors({}); setGeneralError('');
    try {
      const { data, error } = await signIn(email, password);
      if (error) { setGeneralError(error.message.includes('Invalid') ? 'Email ou mot de passe incorrect' : error.message); return; }
      setSuccessMessage('Connexion réussie !');
      setTimeout(() => { onSuccess(data.user); handleClose(); }, 800);
    } catch { setGeneralError('Erreur serveur.'); }
    finally { setIsLoading(false); }
  };

  const handleRegister = async () => {
    if (!checkRateLimit('register', 3, 60000)) { setGeneralError('Trop de tentatives. Réessayez dans 1 minute.'); return; }
    const r = registrationSchema.safeParse({ fullName, email, phone, password, confirmPassword });
    if (!r.success) { const e: Record<string,string> = {}; r.error.issues.forEach(i => e[i.path[0] as string] = i.message); setErrors(e); return; }
    setIsLoading(true); setErrors({}); setGeneralError('');
    try {
      const { data, error } = await signUp(email, password, { full_name: fullName, phone });
      if (error) { setGeneralError(error.message.includes('already') ? 'Cet email est déjà utilisé' : error.message); return; }
      if (data.user?.identities?.length === 0) { setGeneralError('Cet email est déjà utilisé'); return; }
      setSuccessMessage('Compte créé ! Vérifiez votre email pour confirmer.');
      setTimeout(() => { if (data.user) onSuccess(data.user); handleClose(); }, 1500);
    } catch { setGeneralError('Erreur serveur.'); }
    finally { setIsLoading(false); }
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); mode === 'login' ? handleLogin() : handleRegister(); };

  const Field = ({ icon: I, label, type='text', value, onChange, placeholder, error, name }: any) => (
    <div>
      <label className="text-ink-muted text-sm mb-1.5 block font-medium">{label}</label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle"><I className="w-4 h-4" /></div>
        <input type={type === 'password' ? (showPassword ? 'text' : 'password') : type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-2.5 bg-surface-alt border rounded-xl text-ink placeholder-ink-subtle text-sm transition-all ${error ? 'border-red-400' : 'border-border hover:border-ink/20'}`}
          autoComplete={name} maxLength={type === 'password' ? 128 : 255} />
        {type === 'password' && <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>}
      </div>
      {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-4" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
          <motion.div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
          <motion.div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-border-light"
            initial={{ opacity:0, scale:0.96, y:16 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.96, y:16 }}
            transition={{ type:'spring', damping:25, stiffness:300 }}>
            {/* Header */}
            <div className="relative px-6 pt-8 pb-5 text-center border-b border-border-light">
              <button onClick={handleClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-alt flex items-center justify-center hover:bg-surface transition-colors"><X className="w-4 h-4 text-ink-muted" /></button>
              <img src="/images/logo.png" alt="Memphis Cut" className="h-14 w-14 object-contain mx-auto mb-3" />
              <h2 className="font-display text-2xl text-ink">{mode === 'login' ? 'Connexion' : 'Créer un compte'}</h2>
              <p className="text-ink-subtle text-sm mt-1">{mode === 'login' ? 'Connectez-vous pour gérer vos réservations' : 'Créez votre compte pour réserver en ligne'}</p>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-3.5">
              {generalError && <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" /><p className="text-red-600 text-sm">{generalError}</p></div>}
              {successMessage && <div className="p-3 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" /><p className="text-green-700 text-sm">{successMessage}</p></div>}

              {mode === 'register' && <>
                <Field icon={User} label="Nom complet" value={fullName} onChange={setFullName} placeholder="Jean Dupont" error={errors.fullName} name="name" />
                <Field icon={Phone} label="Téléphone" type="tel" value={phone} onChange={setPhone} placeholder="06 12 34 56 78" error={errors.phone} name="tel" />
              </>}
              <Field icon={Mail} label="Email" type="email" value={email} onChange={setEmail} placeholder="jean@exemple.fr" error={errors.email} name="email" />
              <Field icon={Lock} label="Mot de passe" type="password" value={password} onChange={setPassword} placeholder="••••••••" error={errors.password} name="password" />
              {mode === 'register' && <Field icon={Lock} label="Confirmer le mot de passe" type="password" value={confirmPassword} onChange={setConfirmPassword} placeholder="••••••••" error={errors.confirmPassword} name="confirmPassword" />}

              {mode === 'register' && (
                <div className="p-3 rounded-xl bg-surface-alt border border-border-light">
                  <p className="text-ink-subtle text-xs mb-1.5">Le mot de passe doit contenir :</p>
                  <div className="grid grid-cols-2 gap-1">
                    {[{l:'8 caractères min',c:password.length>=8},{l:'Une majuscule',c:/[A-Z]/.test(password)},{l:'Une minuscule',c:/[a-z]/.test(password)},{l:'Un chiffre',c:/[0-9]/.test(password)}].map(r => (
                      <div key={r.l} className={`text-xs flex items-center gap-1 ${r.c?'text-green-600':'text-ink-subtle'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${r.c?'bg-green-500':'bg-ink-subtle/30'}`} />{r.l}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button type="submit" disabled={isLoading} className="w-full btn-primary py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2">
                {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" />{mode==='login'?'Connexion...':'Création...'}</> : mode==='login'?'Se connecter':'Créer mon compte'}
              </button>

              <p className="text-center text-ink-subtle text-sm">
                {mode === 'login' ? <>Pas encore de compte ? <button type="button" onClick={switchMode} className="text-warm font-medium hover:underline">Créer un compte</button></>
                  : <>Déjà un compte ? <button type="button" onClick={switchMode} className="text-warm font-medium hover:underline">Se connecter</button></>}
              </p>
              {mode === 'register' && <p className="text-ink-subtle/60 text-xs text-center">En créant un compte, vous acceptez nos conditions d'utilisation et politique de confidentialité.</p>}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
