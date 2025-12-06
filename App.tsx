
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';

type ViewState = 'landing' | 'login' | 'signup' | 'dashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  
  // Dashboard State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Authentication & Landing Flow
  if (currentView === 'landing') {
    return <LandingPage onNavigate={(page) => setCurrentView(page as ViewState)} />;
  }

  if (currentView === 'login') {
    return <LoginPage onNavigate={(page) => setCurrentView(page as ViewState)} />;
  }

  if (currentView === 'signup') {
    return <SignUpPage onNavigate={(page) => setCurrentView(page as ViewState)} />;
  }

  // Authenticated Dashboard Layout
  return (
    <div className="flex min-h-screen bg-[#fafaf9] font-sans selection:bg-emerald-100 text-stone-900 overflow-hidden">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isMobileOpen={isMobileNavOpen}
      />

      {/* Mobile Overlay */}
      {isMobileNavOpen && (
        <div 
          className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileNavOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-32 h-screen transition-all duration-300">
        <Header 
          onMenuClick={() => setIsMobileNavOpen(true)} 
          title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        />

        <main className="flex-1 p-2 md:pr-8 overflow-y-auto scrollbar-hide">
          {activeTab === 'dashboard' ? (
            <Dashboard />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-stone-400 bg-white rounded-[2.5rem] shadow-soft mx-2 md:mx-0 border border-stone-100 animate-in fade-in zoom-in duration-300">
              <div className="w-24 h-24 rounded-[2rem] bg-stone-50 mb-6 flex items-center justify-center animate-bounce shadow-inner">
                  <span className="text-4xl">🚧</span>
              </div>
              <h2 className="text-3xl font-bold text-stone-900 mb-3 tracking-tight">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
              <p className="text-stone-500 max-w-md text-center">This AI module is currently being calibrated for maximum efficiency.</p>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className="mt-8 px-6 py-3 bg-white border border-stone-200 text-stone-600 rounded-full font-semibold hover:bg-stone-50 transition-colors shadow-sm"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
