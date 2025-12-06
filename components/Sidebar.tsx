import React from 'react';
import { NAV_ITEMS } from '../constants';
import { LogOut } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isMobileOpen }) => {
  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-50 w-24 bg-slate-950 text-white flex flex-col items-center py-8 transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        md:rounded-r-3xl md:my-4 md:ml-4 md:h-[calc(100vh-2rem)] shadow-2xl
      `}
    >
      <div className="mb-12">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-glow">
          <span className="font-bold text-xl text-white">Av</span>
        </div>
      </div>

      <nav className="flex-1 w-full flex flex-col items-center space-y-6">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                group relative p-3 rounded-xl transition-all duration-200
                ${isActive ? 'bg-blue-600 shadow-glow text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}
              `}
              aria-label={item.label}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              
              {/* Tooltip */}
              <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <button className="mt-auto p-3 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors">
        <LogOut size={24} />
      </button>
    </aside>
  );
};