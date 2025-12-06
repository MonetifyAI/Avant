import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, title }) => {
  return (
    <header className="flex items-center justify-between py-4 px-4 md:px-8 mb-4">
      {/* Mobile Title / Menu */}
      <div className="flex items-center gap-4 md:hidden">
        <button 
          onClick={onMenuClick}
          className="p-2.5 rounded-xl bg-white text-stone-600 shadow-sm"
        >
          <Menu size={20} />
        </button>
        <span className="font-bold text-lg text-stone-900">{title}</span>
      </div>

      {/* Desktop Search (Centered-ish) */}
      <div className="hidden md:flex items-center bg-white px-5 py-3 rounded-2xl border border-stone-200/60 focus-within:border-emerald-500/50 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all shadow-sm w-96 ml-auto mr-6">
          <Search size={18} className="text-stone-400" />
          <input 
              type="text" 
              placeholder="Search assets, projects, or commands..." 
              className="ml-3 bg-transparent outline-none text-sm text-stone-700 w-full placeholder:text-stone-400 font-medium"
          />
          <div className="hidden lg:flex gap-1">
              <span className="text-xs px-1.5 py-0.5 bg-stone-100 text-stone-500 rounded border border-stone-200">⌘</span>
              <span className="text-xs px-1.5 py-0.5 bg-stone-100 text-stone-500 rounded border border-stone-200">K</span>
          </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <button className="relative p-3 bg-white rounded-2xl border border-stone-200/60 text-stone-500 hover:text-emerald-600 hover:border-emerald-100 transition-all shadow-sm hover:shadow-md">
            <Bell size={20} />
            <span className="absolute top-2.5 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white ring-1 ring-rose-100"></span>
        </button>

        <button className="w-12 h-12 rounded-2xl border-2 border-white ring-1 ring-stone-200 overflow-hidden shadow-sm hover:ring-emerald-200 transition-all">
            <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="Profile" 
                className="w-full h-full object-cover"
            />
        </button>
      </div>
    </header>
  );
};