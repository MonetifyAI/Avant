import { LucideIcon } from 'lucide-react';

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