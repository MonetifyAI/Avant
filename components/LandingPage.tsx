import React, { useState } from 'react';
import { Hexagon, ArrowRight, Play, Video, Wand2, Palette, Star, Zap, LayoutTemplate, Check, ChevronDown, Plus, Minus } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans text-stone-900 selection:bg-emerald-200 selection:text-emerald-900 overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 transition-all duration-300 bg-[#fafaf9]/80 backdrop-blur-md border-b border-stone-200/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => onNavigate('landing')}>
            <div className="w-10 h-10 bg-stone-900 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-lg">
              <Hexagon className="w-5 h-5 text-white fill-white" strokeWidth={2.5} />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-stone-900">Avant</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-stone-600">
            <a href="#features" className="hover:text-stone-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-stone-900 transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-stone-900 transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('login')}
              className="px-6 py-3 text-sm font-bold text-stone-900 hover:text-emerald-600 transition-colors hidden sm:block"
            >
              Log in
            </button>
            <button 
              onClick={() => onNavigate('signup')}
              className="px-6 py-3 text-sm font-bold text-white bg-stone-900 rounded-full shadow-xl hover:bg-stone-800 hover:scale-105 transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Centered */}
      <section className="relative pt-40 pb-20 px-6 md:pt-52 md:pb-32 overflow-visible">
        <div className="max-w-5xl mx-auto text-center relative z-10">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-xs font-bold text-stone-900 uppercase tracking-wider mb-8 border border-stone-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              AI Video 2.0 is live
            </div>
            
            {/* Headline */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-stone-900 mb-8 leading-[0.9] text-balance animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              Marketing suite for <br/>
              <span className="font-serif-italic font-normal text-emerald-600 relative inline-block">
                ambitious
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-emerald-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span> remodelers.
            </h1>
            
            {/* Subhead */}
            <p className="text-xl md:text-2xl text-stone-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 text-balance">
              Turn project photos into high-converting video ads, 3D renders, and social content in seconds.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
               <button 
                 onClick={() => onNavigate('signup')}
                 className="h-16 px-10 text-lg font-bold text-white bg-stone-900 rounded-full shadow-2xl hover:bg-stone-800 hover:-translate-y-1 transition-all flex items-center gap-3 w-full sm:w-auto justify-center group"
               >
                 Start Free Trial
                 <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
               </button>
               <button className="h-16 px-10 text-lg font-bold text-stone-900 bg-white border-2 border-stone-200 rounded-full hover:border-emerald-200 hover:text-emerald-700 hover:bg-emerald-50 transition-all flex items-center gap-3 w-full sm:w-auto justify-center">
                 <Play size={18} className="fill-current" />
                 Watch Demo
               </button>
            </div>
            
            {/* Social Proof Text */}
            <div className="mt-10 flex items-center justify-center gap-4 text-sm font-semibold text-stone-400 animate-in fade-in duration-1000 delay-500">
              <div className="flex -space-x-3 opacity-70">
                 {[1,2,3,4].map(i => (
                   <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" className="w-8 h-8 rounded-full border-2 border-[#fafaf9]" />
                 ))}
              </div>
              <p>Trusted by 2,000+ pros</p>
            </div>
        </div>

        {/* Floating Visuals - Centered Composition */}
        <div className="relative max-w-6xl mx-auto mt-20 h-[500px] md:h-[700px] hidden md:block perspective-1000 animate-in fade-in zoom-in duration-1000 delay-300">
            {/* Main Dashboard Preview */}
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[90%] md:w-[800px] bg-stone-900 rounded-[2rem] p-3 shadow-2xl border border-stone-800 transform rotate-x-12 hover:rotate-x-0 transition-transform duration-1000 ease-out z-10">
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
            <div className="absolute top-20 left-10 md:left-20 w-64 bg-white p-5 rounded-[2rem] shadow-pop border-2 border-stone-900 transform -rotate-6 animate-float-slow z-20">
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
            <div className="absolute bottom-40 right-10 md:right-20 w-72 bg-emerald-500 p-6 rounded-[2rem] shadow-2xl transform rotate-3 animate-float-medium z-20">
                <div className="flex justify-between items-start mb-4">
                    <div className="text-emerald-900 font-extrabold text-3xl">420%</div>
                    <ArrowRight className="text-emerald-900 rotate-45" />
                </div>
                <p className="text-emerald-900 font-bold leading-tight">Increase in leads for bathroom remodels.</p>
            </div>
            
            {/* Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
        </div>
      </section>

      {/* Infinite Marquee */}
      <div className="w-full bg-stone-900 py-8 overflow-hidden -rotate-1 scale-105 border-y-4 border-emerald-500 z-20 relative">
        <div className="flex animate-marquee whitespace-nowrap">
           {[...Array(10)].map((_, i) => (
             <div key={i} className="flex items-center gap-12 mx-8 opacity-90">
               <span className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 uppercase italic tracking-tighter">
                 Build faster. Close more.
               </span>
               <Star className="text-emerald-500 fill-emerald-500 animate-spin-slow" size={32} />
             </div>
           ))}
        </div>
      </div>

      {/* Logo Cloud */}
      <section className="py-16 bg-white border-b border-stone-100">
          <div className="max-w-7xl mx-auto px-6 text-center">
              <p className="text-stone-400 font-bold text-sm uppercase tracking-widest mb-10">Powering the best in the business</p>
              <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                  {/* Mock Logos */}
                  {['Acme Build', 'Constructo', 'ModernHomes', 'RenovateX', 'Blueprint'].map((name) => (
                      <div key={name} className="text-2xl font-black text-stone-900 flex items-center gap-2">
                          <Hexagon className="fill-stone-900 w-6 h-6" />
                          {name}
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* How it Works */}
      <section className="py-32 px-6 bg-[#fafaf9]" id="how-it-works">
         <div className="max-w-7xl mx-auto">
             <div className="text-center mb-24">
                 <h2 className="text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tighter mb-4">From photo to signed contract.</h2>
                 <p className="text-xl text-stone-500 font-medium">Three simple steps to automate your marketing.</p>
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
                         <div className={`w-24 h-24 ${step.color} rounded-[2rem] flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
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
      <section className="py-32 px-6 bg-white rounded-t-[4rem]" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-5xl md:text-6xl font-extrabold text-stone-900 tracking-tighter mb-6">
              Your new <span className="font-serif-italic text-emerald-600">unfair advantage</span>.
            </h2>
            <p className="text-xl text-stone-500 font-medium">Stop wasting hours on marketing. Avant gives you a full creative agency in your pocket.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Card */}
            <div className="md:col-span-2 bg-[#f0fdf4] rounded-[3rem] p-10 md:p-14 relative overflow-hidden group border border-emerald-100 transition-all hover:shadow-2xl">
               <div className="relative z-10 max-w-md">
                  <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-500/30">
                    <Video size={32} />
                  </div>
                  <h3 className="text-4xl font-extrabold text-stone-900 mb-4">AI Video Studio</h3>
                  <p className="text-lg text-stone-600 font-medium leading-relaxed mb-8">
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
            <div className="md:col-span-1 bg-stone-900 rounded-[3rem] p-10 relative overflow-hidden group text-white">
                <div className="relative z-10">
                   <div className="w-16 h-16 bg-stone-800 text-emerald-400 rounded-2xl flex items-center justify-center mb-8 border border-stone-700">
                      <Palette size={32} />
                   </div>
                   <h3 className="text-3xl font-extrabold mb-4">Instant Renders</h3>
                   <p className="text-stone-400 font-medium leading-relaxed mb-8">
                     Show the "After" before you sign the contract. Close deals on the spot.
                   </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-emerald-900/50 to-transparent pointer-events-none" />
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-500 rounded-full blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity" />
            </div>

            {/* Medium Card */}
            <div className="md:col-span-1 bg-white border-2 border-stone-100 rounded-[3rem] p-10 hover:border-emerald-200 hover:shadow-glow transition-all group">
                <div className="w-14 h-14 bg-teal-100 text-teal-700 rounded-2xl flex items-center justify-center mb-6">
                    <LayoutTemplate size={28} />
                </div>
                <h3 className="text-2xl font-bold text-stone-900 mb-3">Templates</h3>
                <p className="text-stone-500 font-medium">Battle-tested ad templates.</p>
            </div>

            {/* Medium Card */}
            <div className="md:col-span-1 bg-white border-2 border-stone-100 rounded-[3rem] p-10 hover:border-emerald-200 hover:shadow-glow transition-all group">
                <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mb-6">
                    <Wand2 size={28} />
                </div>
                <h3 className="text-2xl font-bold text-stone-900 mb-3">Magic Fix</h3>
                <p className="text-stone-500 font-medium">Remove clutter from photos.</p>
            </div>

            {/* Medium Card */}
            <div className="md:col-span-1 bg-stone-100 rounded-[3rem] p-10 flex items-center justify-center text-center cursor-pointer hover:bg-emerald-500 hover:text-white transition-colors group">
                <div>
                   <h3 className="text-xl font-bold mb-1">View all features</h3>
                   <ArrowRight className="mx-auto group-hover:translate-x-2 transition-transform" />
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 px-6 bg-[#fafaf9]" id="pricing">
         <div className="max-w-7xl mx-auto">
             <div className="text-center mb-20">
                 <h2 className="text-5xl font-extrabold text-stone-900 tracking-tighter mb-6">Simple pricing.</h2>
                 <p className="text-xl text-stone-500 font-medium">Pay for what you use. Cancel anytime.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                 {/* Free Tier */}
                 <div className="bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-xl transition-shadow">
                     <div className="text-stone-500 font-bold uppercase tracking-wider text-sm mb-4">Starter</div>
                     <div className="text-5xl font-black text-stone-900 mb-6">$0</div>
                     <p className="text-stone-500 font-medium mb-8">Perfect for trying out the platform.</p>
                     <ul className="space-y-4 mb-10">
                         {['3 Video Credits', '5 Photo Fixes', 'Watermarked', 'Standard Support'].map(feature => (
                             <li key={feature} className="flex items-center gap-3 font-bold text-stone-700">
                                 <Check size={18} className="text-stone-300" /> {feature}
                             </li>
                         ))}
                     </ul>
                     <button className="w-full py-4 rounded-xl border-2 border-stone-200 text-stone-900 font-bold hover:bg-stone-50 transition-colors">Start Free</button>
                 </div>

                 {/* Pro Tier */}
                 <div className="bg-stone-900 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden transform md:-translate-y-6">
                     <div className="absolute top-0 right-0 bg-emerald-500 text-stone-900 text-xs font-bold px-4 py-1 rounded-bl-xl">POPULAR</div>
                     <div className="text-emerald-400 font-bold uppercase tracking-wider text-sm mb-4">Pro</div>
                     <div className="text-5xl font-black text-white mb-6">$297<span className="text-xl text-stone-500 font-medium">/mo</span></div>
                     <p className="text-stone-400 font-medium mb-8">For growing remodeling businesses.</p>
                     <ul className="space-y-4 mb-10">
                         {['Unlimited Videos', 'Unlimited Renders', 'No Watermark', 'Priority Support', '4K Exports'].map(feature => (
                             <li key={feature} className="flex items-center gap-3 font-bold text-white">
                                 <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"><Check size={12} className="text-stone-900" /></div> {feature}
                             </li>
                         ))}
                     </ul>
                     <button 
                       onClick={() => onNavigate('signup')}
                       className="w-full py-4 rounded-xl bg-emerald-500 text-stone-900 font-bold hover:bg-emerald-400 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                     >
                       Get Started
                     </button>
                 </div>

                 {/* Agency Tier */}
                 <div className="bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-xl transition-shadow">
                     <div className="text-stone-500 font-bold uppercase tracking-wider text-sm mb-4">Agency</div>
                     <div className="text-5xl font-black text-stone-900 mb-6">$997<span className="text-xl text-stone-500 font-medium">/mo</span></div>
                     <p className="text-stone-500 font-medium mb-8">For high-volume teams.</p>
                     <ul className="space-y-4 mb-10">
                         {['Everything in Pro', 'White Label', 'API Access', 'Dedicated Manager', 'Custom Branding'].map(feature => (
                             <li key={feature} className="flex items-center gap-3 font-bold text-stone-700">
                                 <Check size={18} className="text-emerald-500" /> {feature}
                             </li>
                         ))}
                     </ul>
                     <button className="w-full py-4 rounded-xl border-2 border-stone-200 text-stone-900 font-bold hover:bg-stone-50 transition-colors">Contact Sales</button>
                 </div>
             </div>
         </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-white">
          <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-extrabold text-stone-900 tracking-tighter mb-12 text-center">Frequently asked questions</h2>
              <div className="space-y-4">
                  {[
                      { q: "Can I cancel anytime?", a: "Yes, there are no long-term contracts. You can cancel directly from your dashboard." },
                      { q: "Do I own the videos?", a: "Absolutely. You have full commercial rights to all content generated on paid plans." },
                      { q: "How long does rendering take?", a: "Most video ads are ready in under 2 minutes. 3D renders take about 45 seconds." },
                      { q: "Is there a free trial?", a: "Yes! You can generate up to 3 videos for free to test the quality." }
                  ].map((faq, i) => (
                      <details key={i} className="group bg-stone-50 p-6 rounded-2xl cursor-pointer">
                          <summary className="flex justify-between items-center font-bold text-lg text-stone-900 list-none">
                              {faq.q}
                              <span className="bg-white p-2 rounded-full border border-stone-200 group-open:rotate-180 transition-transform"><ChevronDown size={16}/></span>
                          </summary>
                          <p className="mt-4 text-stone-500 font-medium leading-relaxed">{faq.a}</p>
                      </details>
                  ))}
              </div>
          </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto bg-stone-900 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/30 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/30 rounded-full blur-[100px]" />
          
          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tighter">Ready to <span className="text-emerald-400 font-serif-italic">dominate</span>?</h2>
            <button 
              onClick={() => onNavigate('signup')}
              className="h-20 px-12 text-xl font-bold text-stone-900 bg-white rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform"
            >
              Get Started for Free
            </button>
            <p className="mt-6 text-stone-500 font-semibold">No credit card required. Cancel anytime.</p>
          </div>
        </div>
      </section>

      <footer className="py-12 text-center bg-[#fafaf9]">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
            <Hexagon className="w-6 h-6 fill-stone-900" />
            <span className="font-bold text-xl">Avant</span>
        </div>
        <p className="text-stone-400 text-sm font-medium">© 2024 Avant AI. All rights reserved.</p>
        <div className="flex justify-center gap-8 mt-6 text-sm font-bold text-stone-400">
            <a href="#" className="hover:text-stone-900">Privacy</a>
            <a href="#" className="hover:text-stone-900">Terms</a>
            <a href="#" className="hover:text-stone-900">Twitter</a>
        </div>
      </footer>
    </div>
  );
};