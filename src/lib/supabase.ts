import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Auth helpers
export const signUp = async (email: string, password: string, metadata: { full_name: string; phone: string }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Reservation helpers
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
    .order('date', { ascending: true });
  return { data, error };
};

export const cancelReservation = async (reservationId: string) => {
  const { error } = await supabase
    .from('reservations')
    .delete()
    .eq('id', reservationId);
  return { error };
};
