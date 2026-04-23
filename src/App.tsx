import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Team from './components/Team';
import About from './components/About';
import CTA from './components/CTA';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import AuthModal from './components/AuthModal';
import { supabase } from './lib/supabase';
import { preventClickjacking } from './utils/security';

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [initialService, setInitialService] = useState<string | undefined>();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Security: prevent clickjacking
  useEffect(() => {
    preventClickjacking();
  }, []);

  // Check for existing session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
        }
      } catch (error) {
        // Supabase not configured yet - that's okay
        console.log('Supabase not configured - running in demo mode');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUser(session?.user ?? null);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    } catch {
      // Supabase not configured
      setIsLoading(false);
    }
  }, []);

  const handleBookingClick = (service?: string) => {
    setInitialService(service);
    setIsBookingOpen(true);
  };

  const handleAuthClick = () => {
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    setIsAuthOpen(false);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore errors
    }
    setUser(null);
  };

  const handleAuthRequired = () => {
    setIsBookingOpen(false);
    setIsAuthOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-12 h-12 rounded-full border-2 border-ink border-t-transparent animate-spin" />
          <p className="text-ink-subtle text-sm">Chargement...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Navigation */}
      <Navbar
        onAuthClick={handleAuthClick}
        onBookingClick={() => handleBookingClick()}
        isLoggedIn={!!user}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <Hero onBookingClick={() => handleBookingClick()} />

        {/* Services Section */}
        <Services onBookingClick={handleBookingClick} />

        {/* Team Section */}
        <Team />

        {/* About Section */}
        <About />

        {/* Final CTA Section */}
        <CTA onBookingClick={() => handleBookingClick()} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setInitialService(undefined);
        }}
        initialService={initialService}
        isLoggedIn={!!user}
        onAuthRequired={handleAuthRequired}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Floating Booking Button (Mobile) */}
      <motion.button
        className="fixed bottom-6 right-6 lg:hidden z-40 btn-primary px-6 py-4 shadow-2xl flex items-center gap-2 text-sm"
        onClick={() => handleBookingClick()}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        whileTap={{ scale: 0.9 }}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Réserver
      </motion.button>
    </div>
  );
}
