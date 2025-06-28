import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  name: string;
  university_id: string;
  mobile: string;
  gender: 'Male' | 'Female';
  role: 'student' | 'teacher' | 'admin';
  created_at: string;
}

export interface BusScheduleDB {
  id: string;
  time: string;
  starting_point: string;
  route: string;
  end_point: string;
  direction: string;
  gender?: 'Male' | 'Female';
  bus_type?: string;
  remarks?: string;
  description?: string;
  schedule_type: 'Regular' | 'Friday';
  created_at: string;
}

export interface Feedback {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  user?: User;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  published_at: string;
}