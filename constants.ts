import { 
  LayoutDashboard, 
  Video, 
  Wand2, 
  Image as ImageIcon, 
  Palette, 
  BarChart3,
  Users,
  Settings
} from 'lucide-react';
import { NavItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', icon: LayoutDashboard, id: 'dashboard' },
  { label: 'AI Video Studio', icon: Video, id: 'video' },
  { label: 'Project Visualizer', icon: Palette, id: 'visualizer' },
  { label: 'Photo Enhancer', icon: Wand2, id: 'enhancer' },
  { label: 'Campaigns', icon: BarChart3, id: 'campaigns' },
  { label: 'Leads', icon: Users, id: 'leads' },
  { label: 'Settings', icon: Settings, id: 'settings' },
];

export const MOCK_ACTIVITIES = [
  { id: '1', title: 'Modern Kitchen • Video Ad', time: 'Rendering (85%)', type: 'video', status: 'processing' },
  { id: '2', title: 'Master Bath • 3D Walkthrough', time: 'Completed 2m ago', type: 'visualization', status: 'completed' },
  { id: '3', title: 'Lake House • Exterior Fix', time: 'Completed 1h ago', type: 'photo', status: 'completed' },
  { id: '4', title: 'Downtown Loft • Before/After', time: 'Failed', type: 'video', status: 'failed' },
];

export const CHART_DATA = [
  { name: 'Mon', leads: 4, views: 2400 },
  { name: 'Tue', leads: 7, views: 3980 },
  { name: 'Wed', leads: 5, views: 5100 },
  { name: 'Thu', leads: 9, views: 4200 },
  { name: 'Fri', leads: 12, views: 6500 },
  { name: 'Sat', leads: 15, views: 8100 },
  { name: 'Sun', leads: 10, views: 7200 },
];

export const RECENT_PROJECTS = [
  { id: 1, name: "Sunset Blvd Kitchen", type: "Full Remodel", image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", status: "Active" },
  { id: 2, name: "Highland Bath", type: "Renovation", image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", status: "Review" },
];