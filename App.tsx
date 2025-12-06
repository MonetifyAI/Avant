import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f1f5f9] font-sans selection:bg-blue-100 text-slate-900">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isMobileOpen={isMobileNavOpen}
      />

      {/* Mobile Overlay */}
      {isMobileNavOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileNavOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-28 min-h-screen transition-all duration-300">
        <Header 
          onMenuClick={() => setIsMobileNavOpen(true)} 
          title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        />

        <main className="flex-1 p-2 md:p-6 pt-0 overflow-y-auto max-w-[1600px] mx-auto w-full">
          {activeTab === 'dashboard' ? (
            <Dashboard />
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
              <div className="w-16 h-16 rounded-2xl bg-slate-200 mb-4 animate-pulse"></div>
              <h2 className="text-xl font-medium text-slate-500">Feature Coming Soon</h2>
              <p>The {activeTab} module is under development.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}