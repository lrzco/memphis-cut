import { motion } from 'framer-motion';

const teamMembers = [
  {
    name: 'Seventy',
    role: 'Barbier Senior',
    image: 'https://res.cloudinary.com/planity/image/upload/c_crop,x_648,y_0,w_2592,h_2592/h_600,w_600,q_auto,f_auto/v1771426722/businesses/-OkTPtzsoCcrbriIRmH1/calendars/MEMPHISCUT173_1_t6fmps.jpg',
    specialties: ['Coupes dégradées', 'Design barbe', 'Styles modernes'],
  },
  {
    name: 'Brayan',
    role: 'Barbier Styliste',
    image: 'https://res.cloudinary.com/planity/image/upload/c_crop,x_0,y_40,w_2262,h_2262/h_600,w_600,q_auto,f_auto/v1771427113/businesses/-OkTPtzsoCcrbriIRmH1/calendars/MEMPHISCUT283_yljutk.jpg',
    specialties: ['Tresses & Locks', 'Coupe afro', 'Barber classique'],
  },
  {
    name: 'Barcola',
    role: 'Barbière & Tresses',
    image: 'https://res.cloudinary.com/planity/image/upload/c_crop,x_0,y_0,w_948,h_948/h_600,w_600,q_auto,f_auto/v1773678215/businesses/-OkTPtzsoCcrbriIRmH1/calendars/WhatsApp_Image_2026-03-16_at_17.19.44_spn2kq.jpg',
    specialties: ['Vanilles', 'Barrel Twist', 'Invisible Locks'],
  },
  {
    name: 'Toyfia',
    role: 'Barbier',
    image: '',
    specialties: ['Coupes Homme', 'Dégradés', 'Contours'],
  },
];

const containerV = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const itemV = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

export default function Team() {
  return (
    <section id="equipe" className="py-24 lg:py-32 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="text-warm text-sm font-semibold tracking-[0.2em] uppercase mb-3 block">Notre Équipe</span>
          <h2 className="font-display text-4xl sm:text-5xl text-ink mb-4">Les Artisans</h2>
          <p className="text-ink-muted max-w-lg mx-auto">Des professionnels passionnés qui font de chaque visite une expérience unique.</p>
        </motion.div>

        {/* Grid */}
        <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-5" variants={containerV} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
          {teamMembers.map(m => (
            <motion.div key={m.name} variants={itemV} className="group">
              <div className="rounded-2xl overflow-hidden bg-surface-card border border-border-light hover:shadow-lg transition-shadow duration-300">
                {/* Photo or Initial */}
                <div className="relative aspect-[3/4] overflow-hidden bg-surface-alt">
                  {m.image ? (
                    <img src={m.image} alt={m.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-warm-bg to-surface-alt">
                      <span className="text-6xl font-display text-warm/40">{m.name[0]}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {/* Info */}
                <div className="p-5">
                  <h3 className="font-display text-xl text-ink mb-0.5">{m.name}</h3>
                  <p className="text-warm text-sm font-medium mb-3">{m.role}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {m.specialties.map(s => (
                      <span key={s} className="px-2.5 py-1 rounded-full text-xs bg-surface-alt text-ink-muted border border-border-light">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
