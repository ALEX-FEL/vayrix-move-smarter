import { createClient } from '@supabase/supabase-js';

const getSupabaseConfig = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not configured. Using fallback values for SSR build.');
    return {
      url: 'https://placeholder.supabase.co',
      key: 'placeholder-key',
    };
  }

  return { url: supabaseUrl, key: supabaseAnonKey };
};

const config = getSupabaseConfig();

export const supabase = createClient(config.url, config.key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Profile = {
  id: string;
  phone: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  language: 'fr' | 'en';
  created_at: string;
  updated_at: string;
};

export type Trip = {
  id: string;
  user_id: string;
  driver_name: string;
  driver_rating: number;
  vehicle_plate: string;
  origin_address: string;
  origin_lat: number;
  origin_lng: number;
  destination_address: string;
  destination_lat: number;
  destination_lng: number;
  price: number;
  status: 'completed' | 'cancelled';
  created_at: string;
  completed_at?: string;
};
