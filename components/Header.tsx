import React from 'react';
import { Search, Bell, Menu, Settings } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, title }) => {
  return (
    <header className="flex items-center justify-between py-6 px-2 md:px-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-200"
        >
          <Menu size={24} />
        </button>
        
        {/* Breadcrumb / Title style */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-100 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
            <span className="text-sm font-semibold text-slate-800">Crextio</span>
            <span className="text-slate-300">/</span>
            <span className="text-sm text-slate-500">{title}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Tabs style from design */}
        <div className="hidden lg:flex bg-white rounded-full p-1 border border-slate-100 shadow-sm">
            {['Dashboard', 'People', 'Hiring', 'Devices', 'Apps'].map((tab, i) => (
                <button 
                    key={tab}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${i === 0 ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                >
                    {tab}
                </button>
            ))}
        </div>

        <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-white pl-4 pr-2 py-2 rounded-full border border-slate-100 shadow-sm">
                 <Settings size={18} className="text-slate-400" />
                 <span className="text-sm font-medium text-slate-600 mr-2">Setting</span>
            </div>
            
            <button className="relative p-2 bg-white rounded-full border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <Bell size={20} className="text-slate-600" />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>

            <button className="w-10 h-10 rounded-full border border-slate-200 overflow-hidden shadow-sm">
                <img 
                    src="https://picsum.photos/100/100?grayscale" 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                />
            </button>
        </div>
      </div>
    </header>
  );
};