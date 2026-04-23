import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Shield, Heart, Star } from 'lucide-react';

const feats = [
  { icon:Shield, t:'Hygiène irréprochable', d:'Matériel stérilisé et protocoles stricts.' },
  { icon:Heart, t:'Ambiance unique', d:'Un cadre moderne et chaleureux.' },
  { icon:Star, t:'Expertise reconnue', d:'Barbiers formés aux dernières tendances.' },
];

export default function About() {
  return (
    <section id="apropos" className="py-24 lg:py-32 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          {/* Text */}
          <motion.div initial={{ opacity:0, x:-24 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}>
            <span className="text-warm text-sm font-semibold tracking-[0.2em] uppercase mb-3 block">Notre Histoire</span>
            <h2 className="font-display text-4xl sm:text-5xl text-ink mb-5 leading-tight">Plus qu'un barber,<br />une expérience</h2>
            <p className="text-ink-muted text-lg leading-relaxed mb-5">
              Situé au cœur de Saint-Étienne, Memphis Cut est bien plus qu'un simple Barber Shop.
              C'est un espace dédié à l'homme moderne, soucieux de son apparence et en quête de soins de qualité.
            </p>
            <p className="text-ink-subtle leading-relaxed mb-8">
              En franchissant la porte, c'est toute une atmosphère qui se dévoile : une décoration
              à la fois moderne et traditionnelle, un doux mélange qui crée une ambiance accueillante
              et propice à la détente. Chez Memphis Cut, chaque homme est unique, chaque coupe l'est aussi.
            </p>
            <div className="space-y-4">
              {feats.map((f, i) => (
                <motion.div key={f.t} className="flex items-start gap-3" initial={{ opacity:0, x:-16 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}>
                  <div className="w-9 h-9 rounded-lg bg-surface-alt border border-border flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-4 h-4 text-warm" />
                  </div>
                  <div><h4 className="text-ink font-semibold text-sm mb-0.5">{f.t}</h4><p className="text-ink-subtle text-sm">{f.d}</p></div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — real info cards */}
          <motion.div className="space-y-5" initial={{ opacity:0, x:24 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:0.15 }}>
            {/* Storefront photo */}
            <div className="rounded-2xl overflow-hidden bg-white border border-border-light shadow-sm">
              <img
                src="/images/storefront.jpg"
                alt="Devanture Memphis Cut — 6 Rue Camille Colard, Saint-Étienne"
                className="w-full h-64 sm:h-72 object-cover object-center rounded-t-2xl"
                loading="lazy"
              />
              <div className="p-5">
                <div className="flex items-center gap-2 mb-1"><MapPin className="w-4 h-4 text-warm" /><h3 className="text-ink font-semibold">Adresse</h3></div>
                <p className="text-ink-muted text-sm mb-2">6 Rue Camille Colard, 42000 Saint-Étienne</p>
                <a href="https://maps.google.com/?q=6+Rue+Camille+Colard+42000+Saint-Etienne" target="_blank" rel="noopener noreferrer" className="text-warm text-sm font-medium hover:underline">Itinéraire Google Maps →</a>
              </div>
            </div>

            {/* Hours */}
            <div className="p-5 rounded-2xl bg-white border border-border-light">
              <div className="flex items-center gap-2 mb-3"><Clock className="w-4 h-4 text-warm" /><h3 className="text-ink font-semibold">Horaires</h3></div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-ink-muted">Lun - Mar</span><span className="text-ink font-medium">Fermé</span></div>
                <div className="flex justify-between"><span className="text-ink-muted">Mer - Dim</span><span className="text-ink font-medium">10:00 - 20:00</span></div>
              </div>
            </div>

            {/* Phone */}
            <div className="p-5 rounded-2xl bg-warm-bg border border-warm-light/40">
              <div className="flex items-center gap-2 mb-2"><Phone className="w-4 h-4 text-warm" /><h3 className="text-ink font-semibold">Contact</h3></div>
              <p className="text-warm text-lg font-semibold">04 77 95 75 59</p>
              <p className="text-ink-subtle text-sm">Appelez-nous ou réservez en ligne</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
