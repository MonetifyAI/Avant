import { LucideIcon } from 'lucide-react';
import { User, Session, AuthError } from '@supabase/supabase-js';


export interface NavItem {
  label: string;
  icon: LucideIcon;
  id: string;
}

export interface Stat {
  label: string;
  value: string | number;
  trend?: number; // percentage
  icon?: LucideIcon;
}

export interface ActivityItem {
  id: string;
  title: string;
  time: string;
  type: 'video' | 'photo' | 'visualization';
  status: 'completed' | 'processing' | 'failed';
}

export interface Project {
  id: string;
  name: string;
  client: string;
  status: 'Planning' | 'In Progress' | 'Completed';
  image: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  credits: number;
  created_at?: string;
  updated_at?: string;
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string, company: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}
