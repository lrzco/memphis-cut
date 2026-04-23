import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, ChevronRight, ChevronLeft, Check, Loader2 } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
  isLoggedIn: boolean;
  onAuthRequired: () => void;
}

const services = [
  { id:'coupe-etudiant', name:'Coupe étudiant (-25 ans)', price:18, dur:'30 min', cat:'Coupe' },
  { id:'coupe-adulte', name:'Coupe adulte (+25 ans)', price:20, dur:'30 min', cat:'Coupe' },
  { id:'coupe-shampoing', name:'Coupe & Shampoing & Coiffage', price:24, dur:'30 min', cat:'Coupe', pop:true },
  { id:'coupe-transfo', name:'Coupe transformation', price:24, dur:'40 min', cat:'Coupe' },
  { id:'cb-etudiant', name:'Coupe & Barbe étudiant (-25 ans)', price:25, dur:'30 min', cat:'Coupe & Barbe' },
  { id:'cb-adulte', name:'Coupe & Barbe adulte (+25 ans)', price:30, dur:'30 min', cat:'Coupe & Barbe', pop:true },
  { id:'cbs-etudiant', name:'Coupe & Barbe & Shampoing étudiant', price:30, dur:'30 min', cat:'Coupe & Barbe' },
  { id:'cbs-adulte', name:'Coupe & Barbe & Shampoing adulte', price:35, dur:'30 min', cat:'Coupe & Barbe' },
  { id:'barbe-sculpt', name:'Taille de barbe sculptée', price:15, dur:'30 min', cat:'Barbe' },
  { id:'barbe-soins', name:'Taille de barbe avec soins', price:18, dur:'30 min', cat:'Barbe', pop:true },
  { id:'van-demi', name:'Vanilles Simples Demi-tête', price:40, dur:'1h30', cat:'Tresses' },
  { id:'van-full', name:'Vanilles Full Head', price:80, dur:'2h', cat:'Tresses' },
  { id:'locks', name:'Invisible Locks', price:50, dur:'2h', cat:'Tresses' },
  { id:'barrel-s', name:'Barrel Twist Simple', price:50, dur:'2h', cat:'Tresses' },
  { id:'barrel-d', name:'Barrel Twist Design', price:60, dur:'2h', cat:'Tresses' },
];

const barbers = [
  { id:'seventy', name:'Seventy', role:'Barbier Senior' },
  { id:'brayan', name:'Brayan', role:'Barbier Styliste' },
  { id:'barcola', name:'Barcola', role:'Barbière & Tresses' },
  { id:'toyfia', name:'Toyfia', role:'Barbier' },
];

const slots = ['09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00'];

export default function BookingModal({ isOpen, onClose, initialService, isLoggedIn, onAuthRequired }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [svc, setSvc] = useState('');
  const [barber, setBarber] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errs, setErrs] = useState<Record<string,string>>({});

  useEffect(() => {
    if (initialService) { const f = services.find(s => s.name === initialService); if (f) { setSvc(f.id); setStep(2); } }
  }, [initialService]);

  useEffect(() => { document.body.style.overflow = isOpen ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [isOpen]);

  const reset = () => { setStep(1); setSvc(''); setBarber(''); setDate(''); setTime(''); setErrs({}); setSuccess(false); };
  const handleClose = () => { reset(); onClose(); };
  const getSvc = () => services.find(s => s.id === svc);

  const getDates = () => {
    const d = []; const t = new Date();
    for (let i = 1; i <= 14; i++) { const dd = new Date(t); dd.setDate(t.getDate()+i); if (dd.getDay()!==0) d.push(dd); }
    return d;
  };
  const fmtDate = (d: Date) => ({ day:['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'][d.getDay()], date:d.getDate(), month:['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'][d.getMonth()], full:`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` });

  const next = () => {
    if (step===1&&!svc) { setErrs({svc:'Sélectionnez un service'}); return; }
    if (step===2&&!barber) { setErrs({barber:'Sélectionnez un barbier'}); return; }
    if (step===3&&(!date||!time)) { setErrs({date:'Sélectionnez une date et un horaire'}); return; }
    setErrs({}); if (step<4) setStep(step+1);
  };

  const handleSubmit = async () => {
    if (!isLoggedIn) { onAuthRequired(); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setSubmitting(false); setSuccess(true);
  };

  const cats = [...new Set(services.map(s => s.cat))];

  const selBg = 'bg-ink text-white';
  const unSelBg = 'bg-surface-alt hover:bg-surface border-border-light';
  const selText = 'text-white';
  const unSelText = 'text-ink';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-4" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
          <motion.div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
          <motion.div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-border-light"
            initial={{ opacity:0, scale:0.96, y:16 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.96, y:16 }}
            transition={{ type:'spring', damping:25, stiffness:300 }}>
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-xl border-b border-border-light px-6 py-3 flex items-center justify-between">
              <div><h2 className="font-display text-lg text-ink">Réservation</h2><p className="text-ink-subtle text-xs">Étape {step} sur 4</p></div>
              <button onClick={handleClose} className="w-8 h-8 rounded-full bg-surface-alt flex items-center justify-center hover:bg-surface"><X className="w-4 h-4 text-ink-muted" /></button>
            </div>

            {/* Progress */}
            <div className="px-6 pt-3"><div className="flex gap-1.5">{[1,2,3,4].map(s => <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s<=step?'bg-ink':'bg-surface-alt'}`} />)}</div></div>

            <div className="p-6">
              {success ? (
                <motion.div className="text-center py-10" initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}>
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5"><Check className="w-8 h-8 text-green-600" /></div>
                  <h3 className="font-display text-2xl text-ink mb-2">Réservation confirmée !</h3>
                  <p className="text-ink-muted mb-6 text-sm">Vous recevrez un email de confirmation.</p>
                  <div className="p-4 rounded-xl bg-surface-alt border border-border-light text-left space-y-2 mb-6 text-sm">
                    <div className="flex justify-between"><span className="text-ink-muted">Service</span><span className="text-ink font-medium">{getSvc()?.name}</span></div>
                    <div className="flex justify-between"><span className="text-ink-muted">Barbier</span><span className="text-ink font-medium">{barbers.find(b=>b.id===barber)?.name}</span></div>
                    <div className="flex justify-between"><span className="text-ink-muted">Date</span><span className="text-ink font-medium">{date}</span></div>
                    <div className="flex justify-between"><span className="text-ink-muted">Heure</span><span className="text-ink font-medium">{time}</span></div>
                    <div className="flex justify-between pt-2 border-t border-border"><span className="text-ink-muted">Prix</span><span className="text-warm font-bold text-lg">{getSvc()?.price}€</span></div>
                  </div>
                  <button onClick={handleClose} className="btn-primary px-8 py-3 text-sm">Fermer</button>
                </motion.div>
              ) : (
                <>
                  {/* Step 1: Service */}
                  {step===1 && <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }}>
                    <h3 className="font-display text-lg text-ink mb-3 flex items-center gap-2"><Calendar className="w-5 h-5 text-warm" /> Choisissez votre prestation</h3>
                    {errs.svc && <p className="text-red-500 text-sm mb-3">{errs.svc}</p>}
                    <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                      {cats.map(c => (
                        <div key={c}>
                          <p className="text-warm text-xs font-semibold tracking-wider uppercase mb-1.5 mt-3">{c}</p>
                          {services.filter(s=>s.cat===c).map(s => (
                            <button key={s.id} onClick={() => { setSvc(s.id); setErrs({}); }}
                              className={`w-full p-3.5 rounded-xl text-left transition-all mb-1.5 ${svc===s.id ? 'ring-2 ring-ink bg-surface-alt' : 'bg-surface-alt/50 hover:bg-surface-alt border border-transparent'}`}>
                              <div className="flex justify-between items-center">
                                <div><p className="text-ink font-medium text-sm">{s.name}</p><p className="text-ink-subtle text-xs">{s.dur}</p></div>
                                <div className="text-right"><p className="text-ink font-bold">{s.price}€</p>{s.pop && <span className="text-[10px] text-warm bg-warm-bg px-2 py-0.5 rounded-full font-medium">Populaire</span>}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </motion.div>}

                  {/* Step 2: Barber */}
                  {step===2 && <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }}>
                    <h3 className="font-display text-lg text-ink mb-3 flex items-center gap-2"><User className="w-5 h-5 text-warm" /> Choisissez votre barbier</h3>
                    {errs.barber && <p className="text-red-500 text-sm mb-3">{errs.barber}</p>}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {barbers.map(b => (
                        <button key={b.id} onClick={() => { setBarber(b.id); setErrs({}); }}
                          className={`p-5 rounded-xl text-center transition-all ${barber===b.id ? 'ring-2 ring-ink bg-surface-alt' : 'bg-surface-alt/50 hover:bg-surface-alt border border-transparent'}`}>
                          <div className="w-12 h-12 rounded-full bg-warm-bg flex items-center justify-center mx-auto mb-2">
                            <span className="text-lg font-display text-warm">{b.name[0]}</span>
                          </div>
                          <p className="text-ink font-semibold text-sm">{b.name}</p>
                          <p className="text-ink-subtle text-xs">{b.role}</p>
                        </button>
                      ))}
                    </div>
                  </motion.div>}

                  {/* Step 3: Date & Time */}
                  {step===3 && <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }}>
                    <h3 className="font-display text-lg text-ink mb-3 flex items-center gap-2"><Clock className="w-5 h-5 text-warm" /> Date et heure</h3>
                    {errs.date && <p className="text-red-500 text-sm mb-3">{errs.date}</p>}
                    <p className="text-ink-muted text-xs mb-2 font-medium">Date</p>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 mb-5">
                      {getDates().slice(0,14).map(d => { const f = fmtDate(d); return (
                        <button key={f.full} onClick={() => { setDate(f.full); setErrs({}); }}
                          className={`p-2.5 rounded-xl text-center transition-all ${date===f.full ? selBg : unSelBg}`}>
                          <p className={`text-xs ${date===f.full ? 'text-white/60' : 'text-ink-subtle'}`}>{f.day}</p>
                          <p className={`text-base font-bold ${date===f.full ? selText : unSelText}`}>{f.date}</p>
                          <p className={`text-xs ${date===f.full ? 'text-white/60' : 'text-ink-subtle'}`}>{f.month}</p>
                        </button>
                      );})}
                    </div>
                    <p className="text-ink-muted text-xs mb-2 font-medium">Horaire</p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                      {slots.map(t => (
                        <button key={t} onClick={() => { setTime(t); setErrs({}); }}
                          className={`p-2.5 rounded-xl text-center transition-all ${time===t ? selBg : unSelBg}`}>
                          <p className={`text-sm font-medium ${time===t ? selText : unSelText}`}>{t}</p>
                        </button>
                      ))}
                    </div>
                  </motion.div>}

                  {/* Step 4: Confirm */}
                  {step===4 && <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }}>
                    <h3 className="font-display text-lg text-ink mb-5 flex items-center gap-2"><Check className="w-5 h-5 text-warm" /> Confirmez votre réservation</h3>
                    <div className="space-y-3">
                      <div className="p-4 rounded-xl bg-surface-alt border border-border-light"><p className="text-ink-subtle text-xs uppercase tracking-wider mb-0.5">Service</p><p className="text-ink font-semibold text-sm">{getSvc()?.name}</p></div>
                      <div className="p-4 rounded-xl bg-surface-alt border border-border-light"><p className="text-ink-subtle text-xs uppercase tracking-wider mb-0.5">Barbier</p><p className="text-ink font-semibold text-sm">{barbers.find(b=>b.id===barber)?.name}</p></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 rounded-xl bg-surface-alt border border-border-light"><p className="text-ink-subtle text-xs uppercase tracking-wider mb-0.5">Date</p><p className="text-ink font-semibold text-sm">{date}</p></div>
                        <div className="p-4 rounded-xl bg-surface-alt border border-border-light"><p className="text-ink-subtle text-xs uppercase tracking-wider mb-0.5">Heure</p><p className="text-ink font-semibold text-sm">{time}</p></div>
                      </div>
                      <div className="p-4 rounded-xl bg-warm-bg border border-warm-light/40 flex justify-between items-center">
                        <span className="text-ink-muted text-sm">Total à payer sur place</span>
                        <span className="text-warm font-bold text-2xl font-display">{getSvc()?.price}€</span>
                      </div>
                    </div>
                    <p className="text-ink-subtle text-xs mt-3 text-center">Paiement sur place · Annulation gratuite jusqu'à 24h avant</p>
                  </motion.div>}

                  {/* Nav */}
                  <div className="flex items-center justify-between mt-6 pt-5 border-t border-border-light">
                    {step > 1 ? <button onClick={() => setStep(step-1)} className="flex items-center gap-1.5 text-ink-muted hover:text-ink text-sm transition-colors"><ChevronLeft className="w-4 h-4" /> Retour</button> : <div />}
                    {step < 4 ? (
                      <button onClick={next} className="btn-primary px-6 py-2.5 text-sm flex items-center gap-1.5">Suivant <ChevronRight className="w-4 h-4" /></button>
                    ) : (
                      <button onClick={handleSubmit} disabled={submitting} className="btn-primary px-7 py-2.5 text-sm flex items-center gap-2 disabled:opacity-50">
                        {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Confirmation...</> : <>{isLoggedIn ? 'Confirmer' : 'Se connecter pour réserver'} <Check className="w-4 h-4" /></>}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
