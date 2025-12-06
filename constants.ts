import { 
  LayoutDashboard, 
  Video, 
  Image as ImageIcon, 
  Box, 
  Library, 
  Settings, 
  Users,
  Briefcase
} from 'lucide-react';
import { NavItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
  { label: 'Video Creator', icon: Video, id: 'video' },
  { label: 'Visualizer', icon: Box, id: 'visualizer' },
  { label: 'Enhancer', icon: ImageIcon, id: 'enhancer' },
  { label: 'Prompts', icon: Library, id: 'prompts' },
  { label: 'Team', icon: Users, id: 'team' },
  { label: 'Settings', icon: Settings, id: 'settings' },
];

export const MOCK_ACTIVITIES = [
  { id: '1', title: 'Kitchen Remodel Video', time: '10 mins ago', type: 'video', status: 'completed' },
  { id: '2', title: 'Master Bath Visualization', time: '1 hour ago', type: 'visualization', status: 'completed' },
  { id: '3', title: 'Living Room Photos', time: '3 hours ago', type: 'photo', status: 'processing' },
  { id: '4', title: 'Exterior Facade Walkthrough', time: 'Yesterday', type: 'video', status: 'completed' },
];

export const CHART_DATA = [
  { name: 'Mon', leads: 4, views: 240 },
  { name: 'Tue', leads: 7, views: 398 },
  { name: 'Wed', leads: 5, views: 500 },
  { name: 'Thu', leads: 9, views: 420 },
  { name: 'Fri', leads: 12, views: 650 },
  { name: 'Sat', leads: 15, views: 800 },
  { name: 'Sun', leads: 10, views: 700 },
];
