
import React, { useState } from 'react';
import { Hexagon, ArrowRight, Play, Video, Wand2, Palette, Star, Zap, LayoutTemplate, Check, ChevronDown, Plus, Minus, Menu, X, Twitter, Instagram, Linkedin } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans text-stone-900 selection:bg-emerald-200 selection:text-emerald-900 overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 md:py-6 transition-all duration-300 bg-[#fafaf9]/80 backdrop-blur-md border-b border-stone-200/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onNavigate('landing')}>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-stone-900 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-lg">
              <Hexagon className="w-4 h-4 md:w-5 md:h-5 text-white fill-white" strokeWidth={2.5} />
            </div>
            <span className="font-extrabold text-xl md:text-2xl tracking-tight text-stone-900">Avant</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-stone-600">
            <a href="#features" className="hover:text-stone-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-stone-900 transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-stone-900 transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate('login')}
              className="px-4 py-2 text-sm font-bold text-stone-900 hover:text-emerald-600 transition-colors hidden sm:block"
            >
              Log in
            </button>
            <button 
              onClick={() => onNavigate('signup')}
              className="px-5 py-2.5 md:px-6 md:py-3 text-sm font-bold text-white bg-stone-900 rounded-full shadow-xl hover:bg-stone-800 hover:scale-105 transition-all"
            >
              Get Started
            </button>
            <button className="md:hidden p-2 text-stone-900" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border-b border-stone-100 p-6 flex flex-col gap-4 shadow-xl md:hidden animate-in slide-in-from-top-2 h-screen">
                <a href="#features" className="text-2xl font-bold text-stone-600 py-2 border-b border-stone-100" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
                <a href="#how-it-works" className="text-2xl font-bold text-stone-600 py-2 border-b border-stone-100" onClick={() => setIsMobileMenuOpen(false)}>How it Works</a>
                <a href="#pricing" className="text-2xl font-bold text-stone-600 py-2 border-b border-stone-100" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a>
                <button onClick={() => {onNavigate('login'); setIsMobileMenuOpen(false)}} className="text-2xl font-bold text-stone-900 text-left py-2">Log in</button>
                <button 
                  onClick={() => {onNavigate('signup'); setIsMobileMenuOpen(false)}}
                  className="w-full py-4 mt-4 text-lg font-bold text-white bg-stone-900 rounded-xl shadow-xl"
                >
                  Get Started
                </button>
            </div>
        )}
      </nav>

      {/* Hero Section - Centered */}
      <section className="relative pt-32 pb-12 px-4 md:pt-52 md:pb-32 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white rounded-full text-[10px] md:text-xs font-bold text-stone-900 uppercase tracking-wider mb-6 md:mb-8 border border-stone-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              AI Video 2.0 is live
            </div>
            
            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-stone-900 mb-6 md:mb-8 leading-[0.95] md:leading-[0.9] text-balance animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              Marketing suite for <br/>
              <span className="font-serif-italic font-normal text-emerald-600 relative inline-block">
                ambitious
                <svg className="absolute w-full h-2 md:h-3 -bottom-1 left-0 text-emerald-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span> remodelers.
            </h1>
            
            {/* Subhead */}
            <p className="text-lg md:text-2xl text-stone-500 max-w-2xl mx-auto mb-8 md:mb-12 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 text-balance px-4">
              Turn project photos into high-converting video ads, 3D renders, and social content in seconds.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 w-full px-4">
               <button 
                 onClick={() => onNavigate('signup')}
                 className="h-14 md:h-16 px-8 md:px-10 text-base md:text-lg font-bold text-white bg-stone-900 rounded-full shadow-2xl hover:bg-stone-800 hover:-translate-y-1 transition-all flex items-center gap-3 w-full sm:w-auto justify-center group"
               >
                 Start Free Trial
                 <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
               </button>
               <button className="h-14 md:h-16 px-8 md:px-10 text-base md:text-lg font-bold text-stone-900 bg-white border-2 border-stone-200 rounded-full hover:border-emerald-200 hover:text-emerald-700 hover:bg-emerald-50 transition-all flex items-center gap-3 w-full sm:w-auto justify-center">
                 <Play size={18} className="fill-current" />
                 Watch Demo
               </button>
            </div>
            
            {/* Social Proof Text */}
            <div className="mt-8 md:mt-10 flex items-center justify-center gap-3 md:gap-4 text-sm font-semibold text-stone-400 animate-in fade-in duration-1000 delay-500">
              <div className="flex -space-x-3 opacity-70">
                 {[1,2,3,4].map(i => (
                   <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" className="w-8 h-8 rounded-full border-2 border-[#fafaf9]" />
                 ))}
              </div>
              <p>Trusted by 2,000+ pros</p>
            </div>
        </div>

        {/* Floating Visuals - Centered Composition */}
        {/* Mobile: Scaled down using CSS transform to fit. Desktop: Full size. */}
        <div className="relative max-w-6xl mx-auto mt-12 md:mt-20 h-[400px] md:h-[700px] block perspective-1000 animate-in fade-in zoom-in duration-1000 delay-300 pointer-events-none md:pointer-events-auto">
            
            <div className="origin-top transform scale-[0.55] sm:scale-75 md:scale-100 relative w-full h-full flex justify-center">
                {/* Main Dashboard Preview */}
                <div className="absolute top-0 w-[800px] bg-stone-900 rounded-[2rem] p-3 shadow-2xl border border-stone-800 transform rotate-x-12 md:hover:rotate-x-0 transition-transform duration-1000 ease-out z-10">
                    <div className="bg-stone-800 rounded-[1.5rem] overflow-hidden border border-white/5 relative">
                    <div className="absolute top-0 left-0 right-0 h-8 bg-stone-900/50 flex items-center px-4 gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500"/>
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500"/>
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"/>
                    </div>
                    <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" className="w-full h-auto opacity-90" alt="Dashboard" />
                    
                    {/* UI Overlay */}
                    <div className="absolute bottom-8 left-8 right-8 flex gap-4">
                        <div className="flex-1 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                            <div className="h-2 w-24 bg-white/20 rounded-full mb-2"/>
                            <div className="h-2 w-16 bg-white/10 rounded-full"/>
                        </div>
                        <div className="flex-1 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                            <div className="h-2 w-24 bg-white/20 rounded-full mb-2"/>
                            <div className="h-2 w-16 bg-white/10 rounded-full"/>
                        </div>
                    </div>
                    </div>
                </div>

                {/* Floating Card Left */}
                <div className="absolute top-20 left-[-20px] md:left-20 w-64 bg-white p-5 rounded-[2rem] shadow-pop border-2 border-stone-900 transform -rotate-6 animate-float-slow z-20">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <Zap size={20} />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-stone-400 uppercase">Speed</div>
                            <div className="font-bold text-stone-900">12s Render</div>
                        </div>
                    </div>
                    <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 w-[90%] h-full rounded-full"/>
                    </div>
                </div>

                {/* Floating Card Right */}
                <div className="absolute bottom-40 right-[-20px] md:right-20 w-72 bg-emerald-500 p-6 rounded-[2rem] shadow-2xl transform rotate-3 animate-float-medium z-20">
                    <div className="flex justify-between items-start mb-4">
                        <div className="text-emerald-900 font-extrabold text-3xl">420%</div>
                        <ArrowRight className="text-emerald-900 rotate-45" />
                    </div>
                    <p className="text-emerald-900 font-bold leading-tight">Increase in leads for bathroom remodels.</p>
                </div>
            </div>
            
            {/* Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[500px] bg-emerald-500/20 rounded-full blur-[80px] md:blur-[120px] -z-10 pointer-events-none" />
        </div>
      </section>

      {/* Infinite Marquee */}
      <div className="w-full bg-stone-900 py-6 md:py-8 overflow-hidden -rotate-1 md:scale-105 border-y-4 border-emerald-500 z-20 relative">
        <div className="flex animate-marquee whitespace-nowrap">
           {[...Array(10)].map((_, i) => (
             <div key={i} className="flex items-center gap-8 md:gap-12 mx-4 md:mx-8 opacity-90">
               <span className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 uppercase italic tracking-tighter">
                 Build faster. Close more.
               </span>
               <Star className="text-emerald-500 fill-emerald-500 animate-spin-slow w-6 h-6 md:w-8 md:h-8" />
             </div>
           ))}
        </div>
      </div>

      {/* Logo Cloud */}
      <section className="py-12 md:py-16 bg-white border-b border-stone-100">
          <div className="max-w-7xl mx-auto px-6 text-center">
              <p className="text-stone-400 font-bold text-xs md:text-sm uppercase tracking-widest mb-8 md:mb-10">Powering the best in the business</p>
              <div className="flex flex-wrap justify-center gap-8 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                  {/* Mock Logos */}
                  {['Acme Build', 'Constructo', 'ModernHomes', 'RenovateX', 'Blueprint'].map((name) => (
                      <div key={name} className="text-xl md:text-2xl font-black text-stone-900 flex items-center gap-2">
                          <Hexagon className="fill-stone-900 w-5 h-5 md:w-6 md:h-6" />
                          {name}
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* How it Works */}
      <section className="py-16 md:py-32 px-4 md:px-6 bg-[#fafaf9]" id="how-it-works">
         <div className="max-w-7xl mx-auto">
             <div className="text-center mb-16 md:mb-24">
                 <h2 className="text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tighter mb-4">From photo to signed contract.</h2>
                 <p className="text-lg md:text-xl text-stone-500 font-medium">Three simple steps to automate your marketing.</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                 {/* Connector Line */}
                 <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-stone-200 border-t-2 border-dashed border-stone-300 z-0" />
                 
                 {[
                    { title: "Upload Photos", desc: "Take a quick photo of the job site or upload raw files.", icon: Video, color: "bg-stone-900 text-white" },
                    { title: "AI Generation", desc: "Our engine creates video ads and 3D renders instantly.", icon: Wand2, color: "bg-emerald-500 text-white" },
                    { title: "Launch & Close", desc: "Post to social or show the client to close the deal.", icon: Zap, color: "bg-white text-stone-900 border-2 border-stone-200" }
                 ].map((step, i) => (
                     <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                         <div className={`w-20 h-20 md:w-24 md:h-24 ${step.color} rounded-[2rem] flex items-center justify-center mb-6 md:mb-8 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                             <step.icon size={32} />
                         </div>
                         <h3 className="text-2xl font-bold text-stone-900 mb-3">{step.title}</h3>
                         <p className="text-stone-500 font-medium leading-relaxed max-w-xs">{step.desc}</p>
                     </div>
                 ))}
             </div>
         </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-16 md:py-32 px-4 md:px-6 bg-white rounded-t-[3rem] md:rounded-t-[4rem]" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
            <h2 className="text-4xl md:text-6xl font-extrabold text-stone-900 tracking-tighter mb-4 md:mb-6">
              Your new <span className="font-serif-italic text-emerald-600">unfair advantage</span>.
            </h2>
            <p className="text-lg md:text-xl text-stone-500 font-medium">Stop wasting hours on marketing. Avant gives you a full creative agency in your pocket.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Large Card */}
            <div className="md:col-span-2 bg-[#f0fdf4] rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-14 relative overflow-hidden group border border-emerald-100 transition-all hover:shadow-2xl">
               <div className="relative z-10 max-w-md">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mb-6 md:mb-8 shadow-lg shadow-emerald-500/30">
                    <Video size={28} className="md:w-8 md:h-8" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-stone-900 mb-4">AI Video Studio</h3>
                  <p className="text-base md:text-lg text-stone-600 font-medium leading-relaxed mb-8">
                    Upload a few before photos, and our AI directs, edits, and scores a professional marketing video in seconds. No timeline, no keyframes.
                  </p>
                  <button className="px-6 py-3 bg-stone-900 text-white rounded-full font-bold text-sm group-hover:scale-105 transition-transform">Try it out</button>
               </div>
               
               {/* Decorative UI element */}
               <div className="absolute top-1/2 right-[-10%] w-[60%] h-[120%] bg-white rounded-l-[3rem] border-4 border-stone-900 shadow-2xl transform rotate-6 translate-y-10 group-hover:rotate-3 transition-all duration-500 hidden md:block overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40">
                        <Play className="fill-white text-white ml-1" size={32} />
                     </div>
                  </div>
               </div>
            </div>

            {/* Tall Card */}
            <div className="md:col-span-1 bg-stone-900 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 relative overflow-hidden group text-white min-h-[300px]">
                <div className="relative z-10">
                   <div className="w-14 h-14 md:w-16 md:h-16 bg-stone-800 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 md:mb-8 border border-stone-700">
                      <Palette size={28} className="md:w-8 md:h-8" />
                   </div>
                   <h3 className="text-2xl md:text-3xl font-extrabold mb-4">Instant Renders</h3>
                   <p className="text-stone-400 font-medium leading-relaxed mb-8">
                     Show the "After" before you sign the contract. Close deals on the spot.
                   </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-emerald-900/50 to-transparent pointer-events-none" />
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-500 rounded-full blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity" />
            </div>

            {/* Medium Card */}
            <div className="md:col-span-1 bg-white border-2 border-stone-100 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 hover:border-emerald-200 hover:shadow-glow transition-all group">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-teal-100 text-teal-700 rounded-2xl flex items-center justify-center mb-4 md:mb-6">
                    <LayoutTemplate size={24} className="md:w-[28px] md:h-[28px]" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-stone-900 mb-2 md:mb-3">Templates</h3>
                <p className="text-stone-500 font-medium text-sm md:text-base">Battle-tested ad templates.</p>
            </div>

            {/* Medium Card */}
            <div className="md:col-span-1 bg-white border-2 border-stone-100 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 hover:border-emerald-200 hover:shadow-glow transition-all group">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mb-4 md:mb-6">
                    <Wand2 size={24} className="md:w-[28px] md:h-[28px]" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-stone-900 mb-2 md:mb-3">Magic Fix</h3>
                <p className="text-stone-500 font-medium text-sm md:text-base">Remove clutter from photos.</p>
            </div>

            {/* Medium Card */}
            <div className="md:col-span-1 bg-stone-100 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 flex items-center justify-center text-center cursor-pointer hover:bg-emerald-500 hover:text-white transition-colors group">
                <div>
                   <h3 className="text-lg md:text-xl font-bold mb-1">View all features</h3>
                   <ArrowRight className="mx-auto group-hover:translate-x-2 transition-transform" />
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 md:py-32 px-4 md:px-6 bg-[#fafaf9]" id="pricing">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-extrabold text-stone-900 tracking-tighter mb-6">Simple pricing.</h2>
            <p className="text-lg md:text-xl text-stone-500 font-medium">Start for free. Scale when you win.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
            {/* Free */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-stone-200 shadow-sm hover:shadow-xl transition-shadow">
                <div className="text-xl font-bold text-stone-900 mb-2">Starter</div>
                <div className="text-4xl md:text-5xl font-extrabold text-stone-900 mb-6">$0<span className="text-lg text-stone-400 font-medium">/mo</span></div>
                <ul className="space-y-4 mb-8">
                    {['3 Videos / month', '5 Photo fixes', 'Watermarked exports', 'Basic templates'].map((item) => (
                        <li key={item} className="flex items-center gap-3 text-stone-600 font-medium">
                            <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-900"><Check size={14} /></div>
                            {item}
                        </li>
                    ))}
                </ul>
                <button className="w-full py-4 rounded-xl border-2 border-stone-200 text-stone-900 font-bold hover:border-emerald-500 hover:text-emerald-600 transition-colors">Start Free</button>
            </div>

            {/* Pro */}
            <div className="bg-stone-900 p-8 md:p-10 rounded-[2.5rem] border border-stone-900 shadow-2xl relative overflow-hidden transform md:-translate-y-4">
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-bl-2xl uppercase tracking-wider">Most Popular</div>
                <div className="text-xl font-bold text-white mb-2">Pro</div>
                <div className="text-4xl md:text-5xl font-extrabold text-white mb-6">$297<span className="text-lg text-stone-500 font-medium">/mo</span></div>
                <ul className="space-y-4 mb-8">
                    {['Unlimited Videos', 'Unlimited Photo fixes', 'No watermarks', '4K Exports', 'Priority Support'].map((item) => (
                        <li key={item} className="flex items-center gap-3 text-stone-300 font-medium">
                             <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white"><Check size={14} /></div>
                            {item}
                        </li>
                    ))}
                </ul>
                <button 
                  onClick={() => onNavigate('signup')}
                  className="w-full py-4 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-400 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                >
                  Get Started
                </button>
            </div>

            {/* Agency */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-stone-200 shadow-sm hover:shadow-xl transition-shadow">
                <div className="text-xl font-bold text-stone-900 mb-2">Agency</div>
                <div className="text-4xl md:text-5xl font-extrabold text-stone-900 mb-6">$997<span className="text-lg text-stone-400 font-medium">/mo</span></div>
                <ul className="space-y-4 mb-8">
                    {['Everything in Pro', '5 Team Members', 'White-labeling', 'API Access', 'Dedicated Manager'].map((item) => (
                        <li key={item} className="flex items-center gap-3 text-stone-600 font-medium">
                             <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-900"><Check size={14} /></div>
                            {item}
                        </li>
                    ))}
                </ul>
                <button className="w-full py-4 rounded-xl border-2 border-stone-200 text-stone-900 font-bold hover:border-emerald-500 hover:text-emerald-600 transition-colors">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-32 px-4 md:px-6 bg-white border-t border-stone-100">
          <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-extrabold text-stone-900 tracking-tighter mb-12 text-center">Questions?</h2>
              <div className="space-y-4">
                  {[
                      { q: "Can I cancel anytime?", a: "Yes, absolutely. There are no contracts. You can cancel your subscription from the dashboard at any time." },
                      { q: "Do I own the videos?", a: "Yes. Once you export a video or image, you have full commercial rights to use it in your marketing forever." },
                      { q: "How long does a video take to generate?", a: "Most videos are generated in under 2 minutes. Simple photo enhancements happen in seconds." },
                      { q: "Does this work for bathrooms?", a: "Avant is trained on kitchens, bathrooms, basements, and full home exteriors." }
                  ].map((faq, i) => (
                      <div key={i} className="border border-stone-200 rounded-2xl overflow-hidden transition-all duration-300 hover:border-emerald-200">
                          <button 
                            className="w-full flex items-center justify-between p-6 text-left font-bold text-stone-900 text-lg hover:bg-stone-50 transition-colors"
                            onClick={() => toggleFaq(i)}
                          >
                              {faq.q}
                              <ChevronDown className={`transition-transform duration-300 ${openFaqIndex === i ? 'rotate-180 text-emerald-600' : 'text-stone-400'}`} />
                          </button>
                          <div className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${openFaqIndex === i ? 'max-h-40' : 'max-h-0'}`}>
                              <p className="p-6 pt-0 text-stone-600 font-medium leading-relaxed">
                                  {faq.a}
                              </p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-white pt-20 pb-10 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-1 md:col-span-1">
                  <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                          <Hexagon className="w-4 h-4 text-stone-900 fill-stone-900" strokeWidth={2.5} />
                      </div>
                      <span className="font-extrabold text-xl tracking-tight">Avant</span>
                  </div>
                  <p className="text-stone-500 font-medium text-sm leading-relaxed mb-6">
                      The AI operating system for modern remodeling contractors.
                  </p>
                  <div className="flex gap-4">
                      {[Twitter, Instagram, Linkedin].map((Icon, i) => (
                          <a key={i} href="#" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-emerald-500 hover:text-white transition-all">
                              <Icon size={18} />
                          </a>
                      ))}
                  </div>
              </div>
              
              <div>
                  <h4 className="font-bold text-lg mb-6">Product</h4>
                  <ul className="space-y-4 text-stone-400 font-medium">
                      <li><a href="#" className="hover:text-emerald-400 transition-colors">Video Studio</a></li>
                      <li><a href="#" className="hover:text-emerald-400 transition-colors">Photo Enhancer</a></li>
                      <li><a href="#" className="hover:text-emerald-400 transition-colors">Visualizer</a></li>
                      <li><a href="#" className="hover:text-emerald-400 transition-colors">Pricing</a></li>
                  </ul>
              </div>

              <div>
                  <h4 className="font-bold text-lg mb-6">Resources</h4>
                  <ul className="space-y-4 text-stone-400 font-medium">
                      <li><a href="#" className="hover:text-emerald-400 transition-colors">Blog</a></li>
                      <li><a href="#" className="hover:text-emerald-400 transition-colors">Community</a></li>
                      <li><a href="#" className="hover:text-emerald-400 transition-colors">Help Center</a></li>
                      <li><a href="#" className="hover:text-emerald-400 transition-colors">API Docs</a></li>
                  </ul>
              </div>

              <div>
                  <h4 className="font-bold text-lg mb-6">Company</h4>
                  <ul className="space-y-4 text-stone-400 font-medium">
                      <li><a href="#" className="hover:text-emerald-400 transition-colors">About</a></li>
                      <li><a href="#" className="hover:text-emerald-400 transition-colors">Careers</a></li>
                      <li><a href="#" className="hover:text-emerald-400 transition-colors">Legal</a></li>
                      <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact</a></li>
                  </ul>
              </div>
          </div>
          
          <div className="max-w-7xl mx-auto border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-stone-500 font-medium text-sm">© 2024 Avant AI Inc. All rights reserved.</p>
              <div className="flex gap-8 text-sm font-bold text-stone-500">
                  <a href="#" className="hover:text-white transition-colors">Privacy</a>
                  <a href="#" className="hover:text-white transition-colors">Terms</a>
                  <a href="#" className="hover:text-white transition-colors">Cookies</a>
              </div>
          </div>
      </footer>
    </div>
  );
};
