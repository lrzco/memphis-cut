import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Calendar, Clock, User, Phone, Scissors,
  Loader2, AlertCircle, ChevronDown, ChevronUp,
  Pencil, Trash2, Check, RefreshCw, Search
} from 'lucide-react';
import { getAllReservations, updateReservation, cancelReservation, getBookedSlots } from '../lib/supabase';

interface Reservation {
  id: string;
  user_id: string;
  service: string;
  barber: string;
  date: string;
  time: string;
  price: number;
  created_at: string;
  profiles: {
    full_name: string | null;
    phone: string | null;
  } | null;
}

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const barbers = ['Seventy', 'Brayan', 'Barcola', 'Toyfia'];
const slots = ['09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00'];

const months = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];

function fmtDisplay(dateStr: string) {
  const [y, m, d] = dateStr.split('-');
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
}

function isPast(dateStr: string, timeStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const [h, min] = timeStr.split(':').map(Number);
  return new Date(y, m - 1, d, h, min) < new Date();
}

function getDates(days = 30) {
  const result: { label: string; value: string }[] = [];
  const today = new Date();
  for (let i = 1; i <= days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() === 0) continue;
    const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    result.push({ label: fmtDisplay(val), value: val });
  }
  return result;
}

export default function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterBarber, setFilterBarber] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Reschedule state
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newBarber, setNewBarber] = useState('');
  const [newTime, setNewTime] = useState('');
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) load();
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Fetch booked slots when reschedule date or barber changes
  useEffect(() => {
    if (rescheduleId && newDate && newBarber) {
      setLoadingSlots(true);
      setNewTime('');
      const targetId = rescheduleId;
      getBookedSlots(newDate, newBarber).then(({ data }) => {
        // Exclude the current reservation's own time so it doesn't block itself
        const current = reservations.find(r => r.id === targetId);
        const filtered = (data ?? []).filter(t => !(current?.date === newDate && current?.barber === newBarber && current?.time === t));
        setBookedSlots(filtered);
      }).finally(() => setLoadingSlots(false));
    } else {
      setBookedSlots([]);
    }
  }, [newDate, newBarber, rescheduleId]);

  const load = async () => {
    setLoading(true);
    setError('');
    const { data, error: err } = await getAllReservations();
    if (err) setError('Impossible de charger les réservations.');
    else setReservations((data as Reservation[]) || []);
    setLoading(false);
  };

  const startReschedule = (r: Reservation) => {
    setRescheduleId(r.id);
    setNewDate(r.date);
    setNewBarber(r.barber);
    setNewTime(r.time);
    setExpandedId(r.id);
  };

  const cancelReschedule = () => {
    setRescheduleId(null);
    setNewDate('');
    setNewBarber('');
    setNewTime('');
    setBookedSlots([]);
  };

  const handleReschedule = async () => {
    if (!newDate || !newTime || !newBarber || !rescheduleId) return;
    setSaving(true);
    const { error: err } = await updateReservation(rescheduleId, {
      date: newDate,
      time: newTime,
      barber: newBarber,
    });
    if (err) {
      setError('Erreur lors du déplacement du rendez-vous.');
    } else {
      setReservations(prev => prev.map(r =>
        r.id === rescheduleId ? { ...r, date: newDate, time: newTime, barber: newBarber } : r
      ));
      cancelReschedule();
    }
    setSaving(false);
  };

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    const { error: err } = await cancelReservation(id);
    if (err) {
      setError('Erreur lors de l\'annulation.');
    } else {
      setReservations(prev => prev.filter(r => r.id !== id));
    }
    setCancellingId(null);
    setConfirmCancelId(null);
  };

  // Filtering
  const filtered = reservations.filter(r => {
    const name = r.profiles?.full_name?.toLowerCase() || '';
    const phone = r.profiles?.phone || '';
    const matchSearch = !search || name.includes(search.toLowerCase()) || phone.includes(search) || r.service.toLowerCase().includes(search.toLowerCase());
    const matchBarber = !filterBarber || r.barber === filterBarber;
    const matchDate = !filterDate || r.date === filterDate;
    return matchSearch && matchBarber && matchDate;
  });

  // Group by date
  const grouped: Record<string, Reservation[]> = {};
  filtered.forEach(r => {
    if (!grouped[r.date]) grouped[r.date] = [];
    grouped[r.date].push(r);
  });
  const sortedDates = Object.keys(grouped).sort();

  const upcoming = filtered.filter(r => !isPast(r.date, r.time)).length;

  const dateOptions = getDates(60);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[110] flex"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative ml-auto w-full max-w-3xl h-full bg-white shadow-2xl flex flex-col"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          >
            {/* Header */}
            <div className="border-b border-border-light px-6 py-4 flex items-center justify-between shrink-0">
              <div>
                <h2 className="font-display text-xl text-ink">Panel Admin</h2>
                <p className="text-ink-subtle text-xs mt-0.5">{upcoming} rendez-vous à venir · {filtered.length} au total</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={load} title="Rafraîchir" className="w-8 h-8 rounded-full bg-surface-alt flex items-center justify-center hover:bg-surface transition-colors">
                  <RefreshCw className="w-4 h-4 text-ink-muted" />
                </button>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-surface-alt flex items-center justify-center hover:bg-surface transition-colors">
                  <X className="w-4 h-4 text-ink-muted" />
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="px-6 py-3 border-b border-border-light shrink-0 flex flex-wrap gap-2">
              <div className="flex-1 min-w-40 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-subtle" />
                <input
                  type="text"
                  placeholder="Rechercher client, service..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-border-light bg-surface-alt focus:outline-none focus:ring-1 focus:ring-ink"
                />
              </div>
              <select
                value={filterBarber}
                onChange={e => setFilterBarber(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border border-border-light bg-surface-alt focus:outline-none focus:ring-1 focus:ring-ink"
              >
                <option value="">Tous les barbiers</option>
                {barbers.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <select
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border border-border-light bg-surface-alt focus:outline-none focus:ring-1 focus:ring-ink"
              >
                <option value="">Toutes les dates</option>
                {sortedDates.map(d => <option key={d} value={d}>{fmtDisplay(d)}</option>)}
              </select>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-48 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-warm" />
                  <p className="text-ink-subtle text-sm">Chargement...</p>
                </div>
              ) : error ? (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 gap-2">
                  <Calendar className="w-10 h-10 text-ink-subtle" />
                  <p className="text-ink-muted text-sm">Aucun rendez-vous trouvé</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {sortedDates.map(date => (
                    <div key={date}>
                      {/* Date header */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${isPast(date, '23:59') ? 'bg-surface-alt text-ink-muted' : 'bg-ink text-white'}`}>
                          {fmtDisplay(date)}
                        </div>
                        <span className="text-ink-subtle text-xs">{grouped[date].length} rdv</span>
                        <div className="flex-1 h-px bg-border-light" />
                      </div>

                      {/* Reservations for this date */}
                      <div className="space-y-2">
                        {grouped[date].sort((a, b) => a.time.localeCompare(b.time)).map(r => {
                          const past = isPast(r.date, r.time);
                          const isExpanded = expandedId === r.id;
                          const isRescheduling = rescheduleId === r.id;

                          return (
                            <motion.div
                              key={r.id}
                              layout
                              className={`rounded-xl border transition-all ${past ? 'border-border-light bg-surface-alt/30 opacity-60' : 'border-border-light bg-white shadow-sm'}`}
                            >
                              {/* Main row */}
                              <div className="p-4">
                                <div className="flex items-start gap-3">
                                  {/* Time badge */}
                                  <div className="shrink-0 w-14 text-center">
                                    <span className={`text-sm font-bold ${past ? 'text-ink-muted' : 'text-ink'}`}>{r.time}</span>
                                  </div>

                                  {/* Info */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                      <span className="text-ink font-semibold text-sm truncate">{r.profiles?.full_name || 'Client'}</span>
                                      {r.profiles?.phone && (
                                        <a href={`tel:${r.profiles.phone}`} className="flex items-center gap-1 text-xs text-warm hover:underline">
                                          <Phone className="w-3 h-3" />{r.profiles.phone}
                                        </a>
                                      )}
                                    </div>
                                    <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                                      <span className="flex items-center gap-1 text-xs text-ink-muted">
                                        <Scissors className="w-3 h-3" />{r.service}
                                      </span>
                                      <span className="flex items-center gap-1 text-xs text-ink-muted">
                                        <User className="w-3 h-3" />{r.barber}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Price + actions */}
                                  <div className="shrink-0 flex flex-col items-end gap-2">
                                    <span className="text-warm font-bold text-sm">{r.price}€</span>
                                    {!past && (
                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={() => setExpandedId(isExpanded ? null : r.id)}
                                          className="flex items-center gap-1 text-xs text-ink-muted hover:text-ink transition-colors px-2 py-1 rounded-lg hover:bg-surface-alt"
                                        >
                                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Expanded actions */}
                              <AnimatePresence>
                                {isExpanded && !past && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="px-4 pb-4 pt-0 border-t border-border-light">
                                      {isRescheduling ? (
                                        /* Reschedule form */
                                        <div className="pt-3 space-y-3">
                                          <p className="text-ink text-xs font-semibold uppercase tracking-wider">Déplacer le rendez-vous</p>

                                          {/* Barber */}
                                          <div>
                                            <label className="text-ink-subtle text-xs mb-1 block">Barbier</label>
                                            <div className="flex flex-wrap gap-2">
                                              {barbers.map(b => (
                                                <button key={b}
                                                  onClick={() => setNewBarber(b)}
                                                  className={`px-3 py-1.5 rounded-lg text-xs transition-all ${newBarber === b ? 'bg-ink text-white' : 'bg-surface-alt hover:bg-surface text-ink'}`}
                                                >
                                                  {b}
                                                </button>
                                              ))}
                                            </div>
                                          </div>

                                          {/* Date */}
                                          <div>
                                            <label className="text-ink-subtle text-xs mb-1 block">Date</label>
                                            <select
                                              value={newDate}
                                              onChange={e => setNewDate(e.target.value)}
                                              className="w-full px-3 py-2 text-xs rounded-lg border border-border-light bg-surface-alt focus:outline-none focus:ring-1 focus:ring-ink"
                                            >
                                              <option value="">Choisir une date</option>
                                              {dateOptions.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                                            </select>
                                          </div>

                                          {/* Time slots */}
                                          {newDate && newBarber && (
                                            <div>
                                              <label className="text-ink-subtle text-xs mb-1 block">Horaire</label>
                                              {loadingSlots ? (
                                                <div className="flex items-center gap-2 text-xs text-ink-subtle py-2">
                                                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Vérification...
                                                </div>
                                              ) : (
                                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                                                  {slots.map(t => {
                                                    const isBooked = bookedSlots.includes(t);
                                                    return (
                                                      <button key={t}
                                                        onClick={() => { if (!isBooked) setNewTime(t); }}
                                                        disabled={isBooked}
                                                        className={`py-1.5 rounded-lg text-center text-xs transition-all
                                                          ${isBooked ? 'opacity-30 cursor-not-allowed bg-surface-alt line-through text-ink-subtle'
                                                            : newTime === t ? 'bg-ink text-white'
                                                            : 'bg-surface-alt hover:bg-surface text-ink'}`}
                                                      >
                                                        {t}
                                                      </button>
                                                    );
                                                  })}
                                                </div>
                                              )}
                                            </div>
                                          )}

                                          {/* Actions */}
                                          <div className="flex gap-2 pt-1">
                                            <button onClick={cancelReschedule} className="flex-1 py-2 rounded-lg border border-border-light text-xs text-ink-muted hover:text-ink transition-colors">
                                              Annuler
                                            </button>
                                            <button
                                              onClick={handleReschedule}
                                              disabled={!newDate || !newTime || !newBarber || saving}
                                              className="flex-1 py-2 rounded-lg bg-ink text-white text-xs flex items-center justify-center gap-1.5 disabled:opacity-40 transition-opacity"
                                            >
                                              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                              Confirmer
                                            </button>
                                          </div>
                                        </div>
                                      ) : confirmCancelId === r.id ? (
                                        /* Cancel confirmation */
                                        <div className="pt-3 flex items-center gap-2">
                                          <p className="text-sm text-ink flex-1">Confirmer l'annulation ?</p>
                                          <button onClick={() => setConfirmCancelId(null)} className="px-3 py-1.5 text-xs rounded-lg border border-border-light text-ink-muted hover:text-ink">
                                            Non
                                          </button>
                                          <button
                                            onClick={() => handleCancel(r.id)}
                                            disabled={cancellingId === r.id}
                                            className="px-3 py-1.5 text-xs rounded-lg bg-red-500 text-white hover:bg-red-600 flex items-center gap-1 disabled:opacity-50"
                                          >
                                            {cancellingId === r.id ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                                            Oui, annuler
                                          </button>
                                        </div>
                                      ) : (
                                        /* Default action buttons */
                                        <div className="pt-3 flex gap-2">
                                          <button
                                            onClick={() => startReschedule(r)}
                                            className="flex-1 py-2 rounded-lg bg-surface-alt hover:bg-surface text-xs text-ink flex items-center justify-center gap-1.5 transition-colors"
                                          >
                                            <Pencil className="w-3.5 h-3.5" /> Déplacer
                                          </button>
                                          <button
                                            onClick={() => setConfirmCancelId(r.id)}
                                            className="flex-1 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-xs text-red-600 flex items-center justify-center gap-1.5 transition-colors"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" /> Annuler le RDV
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
