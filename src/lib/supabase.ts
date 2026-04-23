import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key' &&
  supabaseUrl.includes('.supabase.co');

if (!isConfigured) {
  console.error(
    '⚠️ Supabase non configuré. Ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans vos variables d\'environnement.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

export const isSupabaseConfigured = () => isConfigured;

// ─── Auth ────────────────────────────────────────────────────────────────────

export const signUp = async (
  email: string,
  password: string,
  metadata: { full_name: string; phone: string }
) => {
  if (!isConfigured) {
    return {
      data: { user: null, session: null },
      error: { message: 'Service indisponible : la base de données n\'est pas encore configurée. Merci de contacter l\'administrateur.' } as any,
    };
  }
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });
    return { data, error };
  } catch (err: any) {
    return {
      data: { user: null, session: null },
      error: {
        message: err?.message?.includes('fetch')
          ? 'Impossible de joindre le serveur. Vérifiez votre connexion internet.'
          : err?.message || 'Erreur inconnue',
      } as any,
    };
  }
};

export const signIn = async (email: string, password: string) => {
  if (!isConfigured) {
    return {
      data: { user: null, session: null },
      error: { message: 'Service indisponible : la base de données n\'est pas encore configurée.' } as any,
    };
  }
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  } catch (err: any) {
    return {
      data: { user: null, session: null },
      error: {
        message: err?.message?.includes('fetch')
          ? 'Impossible de joindre le serveur. Vérifiez votre connexion internet.'
          : err?.message || 'Erreur inconnue',
      } as any,
    };
  }
};

export const signOut = async () => {
  if (!isConfigured) return { error: null };
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  if (!isConfigured) return null;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
};

// ─── Reservations (client) ───────────────────────────────────────────────────

export const createReservation = async (reservation: {
  user_id: string;
  service: string;
  barber: string;
  date: string;
  time: string;
  price: number;
}) => {
  const { data, error } = await supabase
    .from('reservations')
    .insert([reservation])
    .select()
    .single();
  return { data, error };
};

export const getUserReservations = async (userId: string) => {
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true })
    .order('time', { ascending: true });
  return { data, error };
};

export const cancelReservation = async (reservationId: string) => {
  const { error } = await supabase
    .from('reservations')
    .delete()
    .eq('id', reservationId);
  return { error };
};

// ─── Availability ────────────────────────────────────────────────────────────

/** Returns list of already-booked time strings for a given barber + date */
export const getBookedSlots = async (date: string, barber: string) => {
  const { data, error } = await supabase
    .from('reservations')
    .select('time')
    .eq('date', date)
    .eq('barber', barber);
  return { data: (data ?? []).map((r: { time: string }) => r.time), error };
};

// ─── Admin ───────────────────────────────────────────────────────────────────

/** Admin: fetch all reservations joined with client profile (name + phone) */
export const getAllReservations = async () => {
  const { data, error } = await supabase
    .from('reservations')
    .select(`
      *,
      profiles (
        full_name,
        phone
      )
    `)
    .order('date', { ascending: true })
    .order('time', { ascending: true });
  return { data, error };
};

/** Admin: reschedule a reservation */
export const updateReservation = async (
  reservationId: string,
  updates: { date?: string; time?: string; barber?: string; service?: string }
) => {
  const { data, error } = await supabase
    .from('reservations')
    .update(updates)
    .eq('id', reservationId)
    .select()
    .single();
  return { data, error };
};
