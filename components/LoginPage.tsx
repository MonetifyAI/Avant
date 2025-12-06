import React from 'react';
import { Hexagon, ArrowLeft, Mail, Lock, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#fafaf9] flex font-sans text-stone-900">
      
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-16 lg:p-24 justify-center bg-white border-r border-stone-100 shadow-2xl z-10">
          <div className="max-w-md w-full mx-auto">
            <button 
                onClick={() => onNavigate('landing')} 
                className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors font-bold text-sm mb-12"
            >
                <ArrowLeft size={18} /> Back
            </button>
            
            <div className="mb-10">
                <div className="w-12 h-12 bg-stone-900 rounded-xl flex items-center justify-center mb-6 transform -rotate-6">
                   <Hexagon className="w-6 h-6 text-white fill-white" strokeWidth={2.5} />
                </div>
                <h1 className="text-5xl font-extrabold tracking-tighter mb-4 text-stone-900">Welcome back.</h1>
                <p className="text-lg text-stone-500 font-medium">Enter your credentials to access your workspace.</p>
            </div>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onNavigate('dashboard'); }}>
                <div className="space-y-2">
                <label className="text-sm font-bold text-stone-900 uppercase tracking-wide">Email</label>
                <input 
                    type="email" 
                    placeholder="name@company.com" 
                    className="w-full px-4 py-4 bg-stone-50 border-2 border-stone-100 rounded-2xl outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-stone-900 placeholder:text-stone-400 placeholder:font-medium"
                />
                </div>

                <div className="space-y-2">
                <div className="flex justify-between">
                    <label className="text-sm font-bold text-stone-900 uppercase tracking-wide">Password</label>
                    <a href="#" className="text-sm font-bold text-emerald-600 hover:text-emerald-700">Forgot?</a>
                </div>
                <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full px-4 py-4 bg-stone-50 border-2 border-stone-100 rounded-2xl outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-stone-900 placeholder:text-stone-400 placeholder:font-medium"
                />
                </div>

                <button 
                type="submit"
                className="w-full py-5 bg-stone-900 text-white text-lg font-bold rounded-2xl hover:scale-[1.02] hover:bg-stone-800 transition-all flex items-center justify-center gap-2 shadow-xl mt-4"
                >
                Sign In
                <ArrowRight size={20} />
                </button>
            </form>

            <div className="mt-12 text-center text-sm font-medium text-stone-500">
             New here?{' '}
            <button onClick={() => onNavigate('signup')} className="text-emerald-600 hover:text-emerald-700 font-extrabold underline decoration-2 decoration-emerald-200 underline-offset-4">
                Create account
            </button>
            </div>
          </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex w-1/2 bg-[#fafaf9] relative overflow-hidden items-center justify-center">
        {/* Large Decorative Circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white rounded-full border border-stone-100 shadow-[inset_0_0_100px_rgba(0,0,0,0.02)]" />
        
        <div className="relative z-10 text-center">
             <div className="text-9xl font-serif-italic text-stone-200 mb-8 select-none">Avant</div>
             <div className="bg-white p-8 rounded-[2.5rem] shadow-pop border-2 border-stone-900 max-w-sm mx-auto transform rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer">
                <div className="flex items-center gap-4 mb-4">
                    <img src="https://i.pravatar.cc/100?img=33" className="w-12 h-12 rounded-full border-2 border-stone-900" />
                    <div className="text-left">
                        <div className="font-bold text-stone-900">Sarah Jenkins</div>
                        <div className="text-xs text-stone-500 font-bold uppercase">Interior Designer</div>
                    </div>
                </div>
                <p className="text-left text-lg font-medium leading-snug">"This tool literally 10x'd our inbound leads in the first month. Insane."</p>
             </div>
        </div>
      </div>
    </div>
  );
};