import {
  LayoutDashboard,
  Video,
  Wand2,
  Image as ImageIcon,
  Palette,
  BarChart3,
  Users,
  Settings,
  BookOpen,
  Globe
} from 'lucide-react';
import { NavItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', icon: LayoutDashboard, id: 'dashboard' },
  { label: 'AI Video Studio', icon: Video, id: 'video' },
  { label: 'Website Analyzer', icon: Globe, id: 'analyzer' },
  { label: 'Prompt Library', icon: BookOpen, id: 'prompts' },
  { label: 'Project Visualizer', icon: Palette, id: 'visualizer' },
  { label: 'Photo Enhancer', icon: Wand2, id: 'enhancer' },
  { label: 'Campaigns', icon: BarChart3, id: 'campaigns' },
  { label: 'Leads', icon: Users, id: 'leads' },
  { label: 'Settings', icon: Settings, id: 'settings' },
];
