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
        fixed z-50 w-24 bg-[#1c1917] text-white flex flex-col items-center py-8 transition-transform duration-300 ease-in-out font-sans
        /* Island Positioning (Mobile & Desktop) */
        top-4 bottom-4 left-4 h-[calc(100vh-2rem)] rounded-[2.5rem] shadow-2xl ring-1 ring-white/5 overflow-hidden
        
        /* Slide Logic: -translate-x-[120%] ensures it hides completely including the left margin */
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-[150%] md:translate-x-0'}
      `}
    >
      <div className="mb-8 relative group cursor-pointer mt-2 flex-shrink-0">
        {/* Logo */}
        <div className="relative w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-glow transform group-hover:rotate-12 transition-transform duration-500">
          <Hexagon className="w-6 h-6 text-stone-900 fill-stone-900" strokeWidth={2.5} />
        </div>
      </div>

      {/* Scrollable Nav Area */}
      <nav className="flex-1 w-full flex flex-col items-center space-y-4 px-2 overflow-y-auto no-scrollbar min-h-0">
        <style>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="group relative w-full flex justify-center py-2 flex-shrink-0"
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
              <span className="absolute left-20 top-1/2 -translate-y-1/2 bg-stone-900 text-white text-xs font-bold px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border border-white/10 shadow-xl translate-x-2 group-hover:translate-x-0 transition-transform hidden md:block">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-4 flex-shrink-0 mb-2 px-2 w-full flex justify-center">
        <button className="p-3.5 text-stone-600 hover:text-rose-400 hover:bg-white/5 rounded-2xl transition-colors">
          <LogOut size={24} />
        </button>
      </div>
    </aside>
  );
};