import { motion } from 'framer-motion';
import { Calendar, MapPin, Star, ChevronDown } from 'lucide-react';

interface HeroProps {
  onBookingClick: () => void;
}

export default function Hero({ onBookingClick }: HeroProps) {
  return (
    <section id="accueil" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Real Google Street View photo of Memphis Cut storefront */}
      <div className="absolute inset-0">
        <img
          src="https://lh3.googleusercontent.com/p/AF1QipOGyrwjaW3K5sZ4No9e0j3IJFdls81Qdh3Pek-E=w1920-h1080-p-k-no"
          alt="Memphis Cut — 6 Rue Camille Colard, Saint-Étienne"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 mb-8">
            <Star className="w-4 h-4 text-warm fill-warm" />
            <span className="text-sm text-white/90 font-medium">Barbier Premium — Saint-Étienne</span>
          </div>

          {/* Title */}
          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white leading-[0.85] mb-6 tracking-tight">
            Memphis<br />
            <span className="text-warm-light">Cut</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-white/70 max-w-xl mx-auto mb-4 font-light leading-relaxed">
            L'art de la coupe masculine.<br className="hidden sm:block" />
            Savoir-faire, expertise et style unique.
          </p>

          <div className="flex items-center justify-center gap-2 text-white/40 mb-10">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">6 Rue Camille Colard, 42000 Saint-Étienne</span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button onClick={onBookingClick} className="btn-primary px-10 py-4 text-base flex items-center gap-3" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Calendar className="w-5 h-5" />
              RÉSERVER MAINTENANT
            </motion.button>
            <motion.button onClick={() => document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })} className="px-10 py-4 rounded-full text-base font-medium text-white/80 border border-white/25 hover:bg-white/10 transition-all" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              Voir les services
            </motion.button>
          </div>

          {/* Trust */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-8 text-white/40 text-sm">
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-warm fill-warm" />)}
              <span className="ml-1">5.0 (279 avis)</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-white/20" />
            <span>Réservation gratuite</span>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-white/20" />
            <span>Confirmation immédiate</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <ChevronDown className="w-6 h-6 text-white/30" />
      </motion.div>
    </section>
  );
}
