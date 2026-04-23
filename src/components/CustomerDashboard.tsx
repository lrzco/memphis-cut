import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, Scissors, Trash2, Loader2, AlertCircle, CalendarX } from 'lucide-react';
import { getUserReservations, cancelReservation } from '../lib/supabase';

interface Reservation {
  id: string;
  service: string;
  barber: string;
  date: string;
  time: string;
  price: number;
  created_at?: string;
}

interface CustomerDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

function fmtDisplayDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-');
  const months = ['jan', 'fév', 'mar', 'avr', 'mai', 'jun', 'jul', 'aoû', 'sep', 'oct', 'nov', 'déc'];
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
}

function isPast(dateStr: string, timeStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const [h, min] = timeStr.split(':').map(Number);
  const rdv = new Date(y, m - 1, d, h, min);
  return rdv < new Date();
}

export default function CustomerDashboard({ isOpen, onClose, user }: CustomerDashboardProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user) loadReservations();
  }, [isOpen, user]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const loadReservations = async () => {
    setLoading(true);
    setError('');
    const { data, error: err } = await getUserReservations(user.id);
    if (err) {
      setError('Impossible de charger vos réservations.');
    } else {
      setReservations((data as Reservation[]) || []);
    }
    setLoading(false);
  };

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    const { error: err } = await cancelReservation(id);
    if (err) {
      setError('Erreur lors de l\'annulation. Veuillez réessayer.');
    } else {
      setReservations(prev => prev.filter(r => r.id !== id));
    }
    setCancellingId(null);
    setConfirmId(null);
  };

  const upcoming = reservations.filter(r => !isPast(r.date, r.time));
  const past = reservations.filter(r => isPast(r.date, r.time));
  const clientName = user?.user_metadata?.full_name || user?.email || 'Client';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <motion.div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-border-light"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-xl border-b border-border-light px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-warm-bg flex items-center justify-center">
                  <span className="font-display text-warm text-sm">{clientName[0].toUpperCase()}</span>
                </div>
                <div>
                  <h2 className="font-display text-lg text-ink">Mon espace</h2>
                  <p className="text-ink-subtle text-xs">{clientName}</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-surface-alt flex items-center justify-center hover:bg-surface">
                <X className="w-4 h-4 text-ink-muted" />
              </button>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-warm" />
                  <p className="text-ink-subtle text-sm">Chargement de vos réservations...</p>
                </div>
              ) : error ? (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              ) : (
                <>
                  {/* Upcoming */}
                  <div className="mb-8">
                    <h3 className="font-display text-base text-ink mb-4 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-warm" />
                      Prochains rendez-vous
                      {upcoming.length > 0 && (
                        <span className="ml-1 px-2 py-0.5 rounded-full bg-ink text-white text-xs">{upcoming.length}</span>
                      )}
                    </h3>

                    {upcoming.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 rounded-xl bg-surface-alt border border-border-light">
                        <CalendarX className="w-10 h-10 text-ink-subtle mb-3" />
                        <p className="text-ink-muted text-sm font-medium">Aucun rendez-vous à venir</p>
                        <p className="text-ink-subtle text-xs mt-1">Réservez dès maintenant !</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {upcoming.map(r => (
                          <motion.div
                            key={r.id}
                            layout
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="p-4 rounded-xl border border-border-light bg-white shadow-sm"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <Scissors className="w-3.5 h-3.5 text-warm shrink-0" />
                                  <p className="text-ink font-semibold text-sm truncate">{r.service}</p>
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-1">
                                  <span className="flex items-center gap-1.5 text-ink-muted text-xs">
                                    <User className="w-3 h-3" /> {r.barber}
                                  </span>
                                  <span className="flex items-center gap-1.5 text-ink-muted text-xs">
                                    <Calendar className="w-3 h-3" /> {fmtDisplayDate(r.date)}
                                  </span>
                                  <span className="flex items-center gap-1.5 text-ink-muted text-xs">
                                    <Clock className="w-3 h-3" /> {r.time}
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2 shrink-0">
                                <span className="text-warm font-bold text-base font-display">{r.price}€</span>
                                {confirmId === r.id ? (
                                  <div className="flex gap-1.5">
                                    <button
                                      onClick={() => setConfirmId(null)}
                                      className="px-2.5 py-1 text-xs rounded-lg border border-border-light text-ink-muted hover:text-ink transition-colors"
                                    >
                                      Garder
                                    </button>
                                    <button
                                      onClick={() => handleCancel(r.id)}
                                      disabled={cancellingId === r.id}
                                      className="px-2.5 py-1 text-xs rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-1 disabled:opacity-50"
                                    >
                                      {cancellingId === r.id ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                                      Confirmer
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setConfirmId(r.id)}
                                    className="flex items-center gap-1 text-xs text-ink-subtle hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" /> Annuler
                                  </button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Past */}
                  {past.length > 0 && (
                    <div>
                      <h3 className="font-display text-base text-ink-muted mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Historique
                      </h3>
                      <div className="space-y-2">
                        {past.map(r => (
                          <div key={r.id} className="p-4 rounded-xl border border-border-light bg-surface-alt/50 opacity-60">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <p className="text-ink font-medium text-sm truncate mb-1">{r.service}</p>
                                <div className="flex flex-wrap gap-x-4 gap-y-1">
                                  <span className="flex items-center gap-1.5 text-ink-muted text-xs">
                                    <User className="w-3 h-3" /> {r.barber}
                                  </span>
                                  <span className="flex items-center gap-1.5 text-ink-muted text-xs">
                                    <Calendar className="w-3 h-3" /> {fmtDisplayDate(r.date)}
                                  </span>
                                  <span className="flex items-center gap-1.5 text-ink-muted text-xs">
                                    <Clock className="w-3 h-3" /> {r.time}
                                  </span>
                                </div>
                              </div>
                              <span className="text-ink-muted font-medium text-sm shrink-0">{r.price}€</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
