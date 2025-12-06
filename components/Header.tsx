import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Menu, CheckCircle2, AlertCircle, Sparkles, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { CreditDisplay } from './CreditDisplay';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, title }) => {
  const { user, profile, signOut } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 1,
      title: "Video Render Complete",
      message: "The 'Sunset Blvd Kitchen' walkthrough is ready.",
      time: "2m ago",
      type: "success"
    },
    {
      id: 2,
      title: "New High-Value Lead",
      message: "Sarah Jenkins requested a quote.",
      time: "1h ago",
      type: "alert"
    },
    {
      id: 3,
      title: "Weekly Report",
      message: "Your ad campaigns generated 45% more views.",
      time: "4h ago",
      type: "info"
    },
  ];

  return (
    <header className="flex items-center justify-between py-4 px-4 md:px-8 mb-4 relative z-30">
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
      <div className="flex items-center gap-3">

        {/* Credit Display */}
        <CreditDisplay variant="header" />
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-3 rounded-2xl border transition-all shadow-sm hover:shadow-md ${showNotifications
              ? 'bg-stone-100 border-stone-300 text-stone-900'
              : 'bg-white border-stone-200/60 text-stone-500 hover:text-emerald-600 hover:border-emerald-100'
              }`}
          >
            <Bell size={20} />
            <span className="absolute top-2.5 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white ring-1 ring-rose-100 animate-pulse"></span>
          </button>

          {/* Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-3 w-80 sm:w-96 bg-white rounded-[2rem] shadow-2xl border border-stone-100 p-2 transform origin-top-right animate-in fade-in zoom-in-95 duration-200 z-50">
              <div className="px-5 py-3 flex justify-between items-center border-b border-stone-50">
                <h3 className="font-extrabold text-stone-900">Notifications</h3>
                <button
                  className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded-full transition-colors"
                  onClick={() => setShowNotifications(false)}
                >
                  Mark all read
                </button>
              </div>

              <div className="max-h-[320px] overflow-y-auto py-2 space-y-1 custom-scrollbar">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 mx-1 rounded-2xl hover:bg-stone-50 cursor-pointer flex gap-4 group transition-all relative">
                    {/* Icon Indicator */}
                    <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${n.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                      n.type === 'alert' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                        'bg-blue-50 border-blue-100 text-blue-600'
                      }`}>
                      {n.type === 'success' && <CheckCircle2 size={16} strokeWidth={3} />}
                      {n.type === 'alert' && <AlertCircle size={16} strokeWidth={3} />}
                      {n.type === 'info' && <Sparkles size={16} strokeWidth={3} />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pr-4">
                      <div className="flex justify-between items-start mb-0.5">
                        <h4 className="text-sm font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">{n.title}</h4>
                        <span className="text-[10px] font-bold text-stone-400 whitespace-nowrap ml-2">{n.time}</span>
                      </div>
                      <p className="text-xs text-stone-500 font-medium leading-relaxed">{n.message}</p>
                    </div>

                    {/* Unread Dot */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>

              <div className="p-2 border-t border-stone-50 mt-1">
                <button className="w-full py-3 rounded-xl bg-stone-50 text-stone-500 text-xs font-bold uppercase tracking-wider hover:bg-stone-100 hover:text-stone-900 transition-all flex items-center justify-center gap-2">
                  View Activity Log
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-12 h-12 rounded-2xl border-2 border-white ring-1 ring-stone-200 overflow-hidden shadow-sm hover:ring-emerald-200 transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-3 w-72 bg-white rounded-[2rem] shadow-2xl border border-stone-100 p-2 transform origin-top-right animate-in fade-in zoom-in-95 duration-200 z-50">
              <div className="px-5 py-4 border-b border-stone-50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg">
                    {profile?.firstName?.[0] || user?.email?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-stone-900">
                      {profile ? `${profile.firstName} ${profile.lastName}` : 'User'}
                    </h4>
                    <p className="text-xs text-stone-500 font-medium">{user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="p-2">
                <button
                  onClick={async () => {
                    await signOut();
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 font-medium transition-colors"
                >
                  <LogOut size={18} />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};