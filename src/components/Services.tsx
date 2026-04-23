import { motion } from 'framer-motion';
import { Scissors, Sparkles, Crown, Users, Clock, Check } from 'lucide-react';

interface ServicesProps { onBookingClick: (service?: string) => void; }

const cats = [
  { id:'coupe', icon:Scissors, title:'Coupe', emoji:'✂️', desc:'Coupes personnalisées adaptées à votre style', services:[
    { name:'Coupe étudiant (-25 ans)', desc:'Tarif avantageux pour les moins de 25 ans. Service personnalisé.', dur:'30 min', price:18, badge:'Étudiant' },
    { name:'Coupe adulte (+25 ans)', desc:'Technique personnalisée adaptée à la morphologie et au type de cheveu.', dur:'30 min', price:20 },
    { name:'Coupe & Shampoing & Coiffage', desc:'Coupe, shampoing et après-shampoing adapté, coiffage final.', dur:'30 min', price:24, popular:true },
    { name:'Coupe transformation', desc:'Étude stylistique et restructuration complète pour un changement radical.', dur:'40 min', price:24, badge:'Nouveau' },
  ]},
  { id:'coupe-barbe', icon:Crown, title:'Coupe & Barbe', emoji:'🧔🏻', desc:'La formule complète pour un look impeccable', services:[
    { name:'Coupe & Barbe étudiant (-25 ans)', desc:'Formule intégrale réservée au public scolaire et universitaire.', dur:'30 min', price:25, badge:'Étudiant' },
    { name:'Coupe & Barbe adulte (+25 ans)', desc:'Design capillaire et architecture de la barbe.', dur:'30 min', price:30, popular:true },
    { name:'Coupe & Barbe & Shampoing étudiant', desc:'La formule complète pour les étudiants avec shampoing.', dur:'30 min', price:30, badge:'Étudiant' },
    { name:'Coupe & Barbe & Shampoing adulte', desc:'L\'expérience premium complète : coupe, barbe et shampoing.', dur:'30 min', price:35, badge:'Premium' },
  ]},
  { id:'barbe', icon:Sparkles, title:'Barbe & Soins', emoji:'💈', desc:'Prenez soin de votre barbe', services:[
    { name:'Taille de barbe sculptée', desc:'Nettoyage, dégradé des tempes et traçage des contours à la tondeuse.', dur:'30 min', price:15 },
    { name:'Taille de barbe avec soins', desc:'Sculpture, rituel serviette chaude, extraction à la cire et finition à la lame.', dur:'30 min', price:18, popular:true },
  ]},
  { id:'tresses', icon:Users, title:'Tresses & Locks', emoji:'✨', desc:'Styles créatifs et protecteurs', services:[
    { name:'Vanilles Simples Demi-tête', desc:'Vanilles simples sur la moitié de la tête.', dur:'1h30', price:40 },
    { name:'Vanilles Full Head', desc:'Vanilles sur toute la tête.', dur:'2h', price:80 },
    { name:'Invisible Locks', desc:'Locks invisibles pour un style naturel.', dur:'2h', price:50 },
    { name:'Barrel Twist Simple', desc:'Twists barrel pour un look tendance.', dur:'2h', price:50 },
    { name:'Barrel Twist Design', desc:'Twists barrel avec design personnalisé.', dur:'2h', price:60, popular:true },
  ]},
];

const cv = { hidden:{}, visible:{ transition:{ staggerChildren:0.08 } } };
const iv = { hidden:{ opacity:0, y:16 }, visible:{ opacity:1, y:0 } };

export default function Services({ onBookingClick }: ServicesProps) {
  return (
    <section id="services" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div className="text-center mb-16" initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <span className="text-warm text-sm font-semibold tracking-[0.2em] uppercase mb-3 block">Nos Prestations</span>
          <h2 className="font-display text-4xl sm:text-5xl text-ink mb-4">Services & Tarifs</h2>
          <p className="text-ink-muted max-w-lg mx-auto">Une gamme complète de services pour sublimer votre style.</p>
        </motion.div>

        {/* Duo offer */}
        <motion.div className="mb-14 p-6 sm:p-8 rounded-2xl bg-warm-bg border border-warm-light/40 text-center" initial={{ opacity:0, scale:0.97 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Crown className="w-5 h-5 text-warm" />
            <span className="text-warm font-bold tracking-wider">OFFRE DUO</span>
          </div>
          <p className="text-ink-muted text-sm">Ramène un nouveau client et profitez du tarif privilège :</p>
          <div className="flex items-center justify-center gap-6 mt-3">
            <span className="flex items-center gap-1.5 text-sm font-semibold text-ink"><Check className="w-4 h-4 text-green-600" /> 16€ (Étudiants)</span>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-ink"><Check className="w-4 h-4 text-green-600" /> 18€ (Adultes)</span>
          </div>
          <p className="text-warm/70 text-xs mt-2">Offre valable pour vous deux !</p>
        </motion.div>

        {/* Categories */}
        <motion.div className="space-y-14" variants={cv} initial="hidden" whileInView="visible" viewport={{ once:true, margin:'-60px' }}>
          {cats.map(cat => (
            <motion.div key={cat.id} variants={iv}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-surface-alt border border-border flex items-center justify-center">
                  <cat.icon className="w-5 h-5 text-warm" />
                </div>
                <div>
                  <h3 className="font-display text-2xl text-ink"><span className="mr-2">{cat.emoji}</span>{cat.title}</h3>
                  <p className="text-ink-subtle text-sm">{cat.desc}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cat.services.map((s, i) => (
                  <motion.div key={i} onClick={() => onBookingClick(s.name)} className={`group relative p-5 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md ${s.popular ? 'bg-warm-bg border-warm-light/50 hover:border-warm' : 'bg-white border-border-light hover:border-ink/10'}`} whileHover={{ y:-2 }} whileTap={{ scale:0.99 }}>
                    {s.popular && <div className="absolute -top-2.5 right-4 px-3 py-0.5 bg-warm text-white text-xs font-bold rounded-full">POPULAIRE</div>}
                    {s.badge && !s.popular && <div className="absolute -top-2.5 right-4 px-3 py-0.5 bg-surface-alt text-ink-muted text-xs font-bold rounded-full border border-border">{s.badge}</div>}
                    <div className="flex justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="text-ink font-semibold mb-1 group-hover:text-warm transition-colors">{s.name}</h4>
                        <p className="text-ink-subtle text-sm leading-relaxed mb-2">{s.desc}</p>
                        <div className="flex items-center gap-1.5 text-ink-subtle text-xs"><Clock className="w-3.5 h-3.5" /> {s.dur}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-2xl font-display text-ink">{s.price}€</div>
                        <button className="mt-2 px-4 py-1.5 rounded-full text-xs font-semibold border border-ink/15 text-ink group-hover:bg-ink group-hover:text-white group-hover:border-ink transition-all">Réserver</button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Compass */}
        <motion.div className="mt-14 p-6 rounded-2xl bg-surface-alt border border-border-light" initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🤝</span>
            <h3 className="font-display text-lg text-ink">Partenariat Compass</h3>
          </div>
          <p className="text-ink-subtle text-sm mb-3">Sous présentation de l'abonnement Compass valide</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-white border border-border-light flex justify-between items-center">
              <div><p className="text-ink font-medium text-sm">Coupe étudiant + soin (-25 ans)</p><p className="text-ink-subtle text-xs">40 min</p></div>
              <span className="text-xl font-display text-blue-600">18€</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-border-light flex justify-between items-center">
              <div><p className="text-ink font-medium text-sm">Coupe + Barbe + Soin (-25 ans)</p><p className="text-ink-subtle text-xs">40 min</p></div>
              <span className="text-xl font-display text-blue-600">25€</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
