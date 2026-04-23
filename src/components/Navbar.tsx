import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, Calendar, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  onAuthClick: () => void;
  onBookingClick: () => void;
  onDashboardClick: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export default function Navbar({ onAuthClick, onBookingClick, onDashboardClick, isLoggedIn, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const navLinks = [
    { label: 'Accueil', href: '#accueil' },
    { label: 'Services', href: '#services' },
    { label: 'L\'équipe', href: '#equipe' },
    { label: 'À propos', href: '#apropos' },
    { label: 'Contact', href: '#contact' },
  ];

  const goTo = (href: string) => {
    setIsOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-border' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button onClick={() => goTo('#accueil')} className="flex items-center gap-2.5">
            <img
              src={scrolled ? '/images/logo-dark.png' : '/images/logo.png'}
              alt="Memphis Cut"
              className="h-9 w-9 object-contain"
            />
            <div>
              <span className={`font-display text-lg font-normal ${scrolled ? 'text-ink' : 'text-white'}`}>Memphis</span>
              <span className={`font-display text-lg font-normal ml-1 ${scrolled ? 'text-warm' : 'text-warm-light'}`}>Cut</span>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(l => (
              <button key={l.label} onClick={() => goTo(l.href)} className={`text-sm font-medium transition-colors tracking-wide uppercase ${scrolled ? 'text-ink-muted hover:text-ink' : 'text-white/70 hover:text-white'}`}>
                {l.label}
              </button>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <button onClick={onDashboardClick} className={`flex items-center gap-1.5 text-sm transition-colors ${scrolled ? 'text-ink-muted hover:text-ink' : 'text-white/70 hover:text-white'}`}>
                  <LayoutDashboard className="w-4 h-4" /> Mon espace
                </button>
                <button onClick={onLogout} className={`text-sm transition-colors ${scrolled ? 'text-ink-muted hover:text-ink' : 'text-white/70 hover:text-white'}`}>Déconnexion</button>
              </>
            ) : (
              <button onClick={onAuthClick} className={`flex items-center gap-2 text-sm transition-colors ${scrolled ? 'text-ink-muted hover:text-ink' : 'text-white/70 hover:text-white'}`}>
                <User className="w-4 h-4" /> Connexion
              </button>
            )}
            <button onClick={onBookingClick} className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Réserver
            </button>
          </div>

          {/* Mobile toggle */}
          <button className="lg:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className={`w-6 h-6 ${scrolled ? 'text-ink' : 'text-white'}`} /> : <Menu className={`w-6 h-6 ${scrolled ? 'text-ink' : 'text-white'}`} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-white border-b border-border overflow-hidden">
            <div className="px-4 py-6 space-y-1">
              {navLinks.map(l => (
                <button key={l.label} onClick={() => goTo(l.href)} className="block w-full text-left text-sm font-medium text-ink-muted hover:text-ink py-2.5 tracking-wide uppercase">{l.label}</button>
              ))}
              <div className="pt-4 border-t border-border space-y-3">
                {isLoggedIn ? (
                  <>
                    <button onClick={() => { setIsOpen(false); onDashboardClick(); }} className="block w-full text-left text-sm text-ink-muted py-2 flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" /> Mon espace
                    </button>
                    <button onClick={() => { setIsOpen(false); onLogout(); }} className="block w-full text-left text-sm text-ink-muted py-2">Déconnexion</button>
                  </>
                ) : (
                  <button onClick={() => { setIsOpen(false); onAuthClick(); }} className="block w-full text-left text-sm text-ink-muted py-2">Connexion / Inscription</button>
                )}
                <button onClick={() => { setIsOpen(false); onBookingClick(); }} className="btn-primary w-full py-3 text-sm">Réserver maintenant</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
