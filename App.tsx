
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { EmailVerification } from './components/EmailVerification';
import { AdGenerator } from './components/AdGenerator';
import { PromptLibrary } from './components/PromptLibrary';
import { WebsiteAnalyzer } from './components/WebsiteAnalyzer';
import { ProjectVisualizer } from './components/ProjectVisualizer';
import { useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';

type ViewState = 'landing' | 'login' | 'signup' | 'verify_email' | 'dashboard';

export default function App() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [pendingEmail, setPendingEmail] = useState<string>('');

  // Dashboard State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Redirect to dashboard if user is logged in AND email is confirmed
  useEffect(() => {
    if (user) {
      // Check if email is confirmed
      if (user.email_confirmed_at) {
        setCurrentView('dashboard');
      } else if (currentView !== 'verify_email' && currentView !== 'signup') {
        // User signed up but email not verified yet
        setPendingEmail(user.email || '');
        setCurrentView('verify_email');
      }
    } else if (!user && currentView === 'dashboard') {
      setCurrentView('landing');
    }
  }, [user]);

  // Handle navigation from signup - go to verify_email instead of dashboard
  const handleNavigate = (page: string) => {
    if (page === 'dashboard' && user && !user.email_confirmed_at) {
      setPendingEmail(user.email || '');
      setCurrentView('verify_email');
    } else {
      setCurrentView(page as ViewState);
    }
  };

  // Resend verification email
  const handleResendVerification = async () => {
    if (pendingEmail) {
      await supabase.auth.resend({
        type: 'signup',
        email: pendingEmail,
      });
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-stone-900 rounded-2xl flex items-center justify-center mb-4 animate-pulse mx-auto">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg"></div>
          </div>
          <p className="text-stone-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }


  // Authentication & Landing Flow
  if (currentView === 'landing') {
    return <LandingPage onNavigate={handleNavigate} />;
  }

  if (currentView === 'login') {
    return <LoginPage onNavigate={handleNavigate} />;
  }

  if (currentView === 'signup') {
    return <SignUpPage onNavigate={handleNavigate} />;
  }

  if (currentView === 'verify_email') {
    return (
      <EmailVerification
        email={pendingEmail}
        onBack={() => setCurrentView('login')}
        onResend={handleResendVerification}
      />
    );
  }

  // Get page title based on active tab
  const getPageTitle = () => {
    switch (activeTab) {
      case 'video': return 'AI Video Studio';
      case 'prompts': return 'Prompt Library';
      case 'analyzer': return 'Website Analyzer';
      case 'visualizer': return 'Project Visualizer';
      default: return activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
    }
  };

  // Render the active tab content
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigateToTab={setActiveTab} />;
      case 'video':
        return <AdGenerator />;
      case 'prompts':
        return <PromptLibrary />;
      case 'analyzer':
        return <WebsiteAnalyzer />;
      case 'visualizer':
        return <ProjectVisualizer />;
      default:
        return (
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
        );
    }
  };

  // Authenticated Dashboard Layout
  return (
    <div className="flex min-h-screen bg-[#fafaf9] font-sans selection:bg-emerald-100 text-stone-900 overflow-hidden">

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
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
          title={getPageTitle()}
        />

        <main className="flex-1 p-2 md:pr-8 overflow-y-auto scrollbar-hide">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
