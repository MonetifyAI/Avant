import React, { useState, useRef, useEffect } from 'react';
import { Menu, LogOut, User, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { CreditDisplay } from './CreditDisplay';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, title }) => {
  const { user, profile, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get user initials for avatar
  const getInitials = () => {
    if (profile?.firstname && profile?.lastname) {
      return `${profile.firstname[0]}${profile.lastname[0]}`.toUpperCase();
    }
    if (profile?.firstname) {
      return profile.firstname[0].toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  // Get display name
  const getDisplayName = () => {
    if (profile?.firstname && profile?.lastname) {
      return `${profile.firstname} ${profile.lastname}`;
    }
    if (profile?.firstname) {
      return profile.firstname;
    }
    return 'User';
  };

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

      {/* Spacer for desktop */}
      <div className="hidden md:block flex-1" />

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Credit Display */}
        <CreditDisplay variant="header" />

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-12 h-12 rounded-2xl border-2 border-white ring-1 ring-stone-200 overflow-hidden shadow-sm hover:ring-emerald-200 transition-all bg-emerald-100 flex items-center justify-center"
          >
            <span className="text-emerald-700 font-bold text-lg">
              {getInitials()}
            </span>
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-3 w-72 bg-white rounded-[2rem] shadow-2xl border border-stone-100 p-2 transform origin-top-right animate-in fade-in zoom-in-95 duration-200 z-50">
              <div className="px-5 py-4 border-b border-stone-50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg">
                    {getInitials()}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-stone-900">
                      {getDisplayName()}
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