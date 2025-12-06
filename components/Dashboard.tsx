import React, { useState } from 'react';
import {
  Video,
  Sparkles,
  Globe,
  BookOpen,
  Zap,
  ArrowRight,
  Image as ImageIcon,
  Lightbulb,
  Rocket,
  ChevronRight,
  Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCredits } from '../hooks/useCredits';
import { PaywallModal } from './PaywallModal';

// Clean Action Card - matches original aesthetic
const ActionCard = ({
  title,
  description,
  icon: Icon,
  onClick,
  credits,
  isFree
}: {
  title: string;
  description: string;
  icon: any;
  onClick: () => void;
  credits?: number;
  isFree?: boolean;
}) => (
  <button
    onClick={onClick}
    className="flex flex-col p-8 bg-white rounded-[2.5rem] shadow-soft hover:shadow-lg transition-all duration-300 h-full text-left group border border-stone-100 hover:-translate-y-1"
  >
    <div className="flex justify-between items-start mb-6">
      <div className="p-3 rounded-2xl bg-stone-50 text-stone-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
        <Icon size={24} strokeWidth={2} />
      </div>
      {isFree ? (
        <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
          Free
        </span>
      ) : credits !== undefined && (
        <span className="text-xs font-extrabold text-stone-500 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-100">
          {credits} credit
        </span>
      )}
    </div>
    <div className="flex-1">
      <h3 className="text-xl font-extrabold text-stone-900 tracking-tight mb-2">{title}</h3>
      <p className="text-stone-500 text-sm font-medium">{description}</p>
    </div>
    <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm mt-6 group-hover:gap-3 transition-all">
      <span>Get Started</span>
      <ArrowRight size={16} />
    </div>
  </button>
);

// Feature Step - minimal design
const FeatureStep = ({
  title,
  description,
  step
}: {
  title: string;
  description: string;
  step: number;
}) => (
  <div className="flex gap-4 p-5 hover:bg-stone-50 rounded-2xl transition-colors">
    <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-100">
      {step}
    </div>
    <div>
      <h4 className="font-bold text-stone-900 mb-1">{title}</h4>
      <p className="text-stone-500 text-sm">{description}</p>
    </div>
  </div>
);

interface DashboardProps {
  onNavigateToTab?: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigateToTab }) => {
  const { profile } = useAuth();
  const { credits, packages } = useCredits();
  const [showPaywall, setShowPaywall] = useState(false);

  const firstName = profile?.firstname || 'there';

  const navigateTo = (tab: string) => {
    if (onNavigateToTab) {
      onNavigateToTab(tab);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto p-2 md:p-6 space-y-8 animate-in fade-in duration-700 font-sans">

      {/* Header / Greeting */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-4">
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-stone-900 tracking-tighter mb-2">
            Hello, <span className="font-serif-italic font-normal text-emerald-600">{firstName}</span>
          </h1>
          <p className="text-stone-500 text-lg font-medium">What would you like to create today?</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowPaywall(true)}
            className="flex items-center gap-2 px-8 py-4 bg-stone-900 text-white rounded-full font-bold shadow-lg hover:bg-stone-800 hover:-translate-y-0.5 transition-all"
          >
            <Plus size={20} />
            <span>Buy Credits</span>
          </button>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-6">

        {/* Quick Actions - 4 Cards */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ActionCard
            title="AI Video Studio"
            description="Generate scroll-stopping video ads with AI-powered creativity"
            icon={Video}
            onClick={() => navigateTo('video')}
            credits={1}
          />
          <ActionCard
            title="Project Visualizer"
            description="Transform before photos into stunning after renders"
            icon={ImageIcon}
            onClick={() => navigateTo('visualizer')}
            credits={1}
          />
          <ActionCard
            title="Website Analyzer"
            description="Get personalized prompts based on your business"
            icon={Globe}
            onClick={() => navigateTo('analyzer')}
            isFree
          />
          <ActionCard
            title="Prompt Library"
            description="Browse 35+ proven Hormozi-style marketing scripts"
            icon={BookOpen}
            onClick={() => navigateTo('prompts')}
            isFree
          />
        </div>

        {/* Credits Card - Dark */}
        <div className="col-span-12 lg:col-span-4 bg-[#1c1917] rounded-[2.5rem] p-10 relative overflow-hidden text-white flex flex-col justify-between min-h-[380px] shadow-2xl group">
          {/* Ambient Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/20 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-600/20 rounded-full blur-[60px]" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 text-emerald-400 mb-3">
              <Sparkles size={18} className="fill-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider">AI Credits</span>
            </div>
            <div className="text-6xl font-light tracking-tight mb-2">{credits}</div>
            <p className="text-stone-400 text-sm font-medium">credits available</p>
          </div>

          <div className="relative z-10 space-y-4">
            {/* Credit Usage */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-stone-400">Video Ads</span>
                <span className="text-white font-bold">1 credit</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-400">Visualizations</span>
                <span className="text-white font-bold">1 credit</span>
              </div>
            </div>

            <button
              onClick={() => setShowPaywall(true)}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-bold transition-colors"
            >
              {credits === 0 ? 'Buy Credits to Generate' : 'Get More Credits'}
            </button>
          </div>
        </div>

        {/* Getting Started Guide */}
        <div className="col-span-12 bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-soft">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-stone-50">
              <Rocket size={24} className="text-stone-600" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">Getting Started</h2>
              <p className="text-stone-500 font-medium">Complete these steps to get the most out of Avant</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            <FeatureStep
              step={1}
              title="Analyze Your Website"
              description="Let AI understand your business"
            />
            <FeatureStep
              step={2}
              title="Choose a Prompt"
              description="Use library or custom prompts"
            />
            <FeatureStep
              step={3}
              title="Generate Video Ads"
              description="Create content in minutes"
            />
            <FeatureStep
              step={4}
              title="Visualize Projects"
              description="Transform photos for proposals"
            />
          </div>
        </div>

        {/* Pro Tip */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-stone-50 rounded-[2.5rem] p-8 border border-stone-100">
          <div className="flex items-center gap-2 text-amber-600 mb-4">
            <Lightbulb size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Pro Tip</span>
          </div>
          <p className="text-stone-700 font-medium mb-4">
            Start with the <strong>Website Analyzer</strong> — it's free and creates personalized prompts that convert 3x better than generic ones.
          </p>
          <button
            onClick={() => navigateTo('analyzer')}
            className="flex items-center gap-2 text-stone-900 font-bold text-sm hover:gap-3 transition-all"
          >
            Try it now <ChevronRight size={16} />
          </button>
        </div>

        {/* Credit Info */}
        <div className="col-span-12 md:col-span-6 lg:col-span-8 bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-soft">
          <h3 className="text-lg font-extrabold text-stone-900 mb-4 tracking-tight">What's Free vs Paid</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <Video size={24} className="mx-auto mb-2 text-stone-400" />
              <p className="font-bold text-stone-900">Video Ads</p>
              <p className="text-sm text-stone-500">1 credit each</p>
            </div>
            <div className="text-center p-4">
              <ImageIcon size={24} className="mx-auto mb-2 text-stone-400" />
              <p className="font-bold text-stone-900">Visualizations</p>
              <p className="text-sm text-stone-500">1 credit each</p>
            </div>
            <div className="text-center p-4">
              <Globe size={24} className="mx-auto mb-2 text-emerald-500" />
              <p className="font-bold text-stone-900">Website Analyzer</p>
              <p className="text-sm text-emerald-600 font-bold">Free</p>
            </div>
            <div className="text-center p-4">
              <BookOpen size={24} className="mx-auto mb-2 text-emerald-500" />
              <p className="font-bold text-stone-900">Prompt Library</p>
              <p className="text-sm text-emerald-600 font-bold">Free</p>
            </div>
          </div>
        </div>
      </div>

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        packages={packages}
        currentCredits={credits}
      />
    </div>
  );
};