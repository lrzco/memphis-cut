import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';

interface CTAProps { onBookingClick: () => void; }

export default function CTA({ onBookingClick }: CTAProps) {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-surface-alt border border-border mb-6">
            <Sparkles className="w-7 h-7 text-warm" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl text-ink mb-4 leading-tight">Prêt pour un<br />nouveau style ?</h2>
          <p className="text-ink-muted text-lg max-w-xl mx-auto mb-8">Réservez votre créneau en quelques clics. Confirmation immédiate, paiement sur place.</p>
          <motion.button onClick={onBookingClick} className="btn-primary px-10 py-4 text-lg flex items-center gap-3 mx-auto" whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}>
            <Calendar className="w-5 h-5" /> RÉSERVER MAINTENANT <ArrowRight className="w-4 h-4" />
          </motion.button>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-ink-subtle text-sm">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Gratuit</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Confirmation immédiate</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Paiement sur place</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
