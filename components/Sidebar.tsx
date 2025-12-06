import React from 'react';
import { NAV_ITEMS } from '../constants';
import { LogOut, Hexagon } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isMobileOpen }) => {
  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-50 w-24 bg-[#1c1917] text-white flex flex-col items-center py-8 transition-transform duration-300 ease-in-out font-sans
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        md:my-4 md:ml-4 md:h-[calc(100vh-2rem)] md:rounded-[2.5rem] shadow-2xl ring-1 ring-white/5
      `}
    >
      <div className="mb-12 relative group cursor-pointer mt-4">
        {/* Logo */}
        <div className="relative w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-glow transform group-hover:rotate-12 transition-transform duration-500">
          <Hexagon className="w-6 h-6 text-stone-900 fill-stone-900" strokeWidth={2.5} />
        </div>
      </div>

      <nav className="flex-1 w-full flex flex-col items-center space-y-4 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="group relative w-full flex justify-center py-2"
              aria-label={item.label}
            >
              {/* Active Indicator Pill */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-emerald-500 rounded-r-full shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-in fade-in slide-in-from-left-2 duration-300" />
              )}

              <div className={`
                p-3.5 rounded-2xl transition-all duration-300
                ${isActive 
                  ? 'bg-white/10 text-emerald-400' 
                  : 'text-stone-500 hover:text-stone-200 hover:bg-white/5'}
              `}>
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} className="transition-transform group-hover:scale-110" />
              </div>
              
              {/* Tooltip */}
              <span className="absolute left-20 top-1/2 -translate-y-1/2 bg-stone-900 text-white text-xs font-bold px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border border-white/10 shadow-xl translate-x-2 group-hover:translate-x-0 transition-transform">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <button className="mt-auto p-3.5 text-stone-600 hover:text-rose-400 hover:bg-white/5 rounded-2xl transition-colors mb-4">
        <LogOut size={24} />
      </button>
    </aside>
  );
};