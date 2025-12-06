import React from 'react';
import { 
  ArrowUpRight, 
  Play, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  Sparkles,
  Video,
  Zap,
  Eye,
  MousePointerClick,
  Plus
} from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_DATA, MOCK_ACTIVITIES, RECENT_PROJECTS } from '../constants';

const StatCard = ({ label, value, trend, icon: Icon }: { label: string, value: string, trend?: string, icon?: any }) => (
  <div className="flex flex-col p-8 bg-white rounded-[2.5rem] shadow-soft hover:shadow-lg transition-shadow duration-300 h-full justify-between group border border-stone-100">
    <div className="flex justify-between items-start mb-6">
      <div className="p-3 rounded-2xl bg-stone-50 text-stone-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
        {Icon && <Icon size={24} strokeWidth={2} />}
      </div>
      {trend && (
        <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
          {trend}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-4xl font-extrabold text-stone-900 tracking-tight mb-1">{value}</h3>
      <p className="text-stone-500 text-sm font-bold uppercase tracking-wide">{label}</p>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="max-w-[1600px] mx-auto p-2 md:p-6 space-y-8 animate-in fade-in duration-700 font-sans">
      
      {/* --- Header / Greeting Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-4">
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-stone-900 tracking-tighter mb-2">
            Hello, <span className="font-serif-italic font-normal text-emerald-600">Alex</span>
          </h1>
          <p className="text-stone-500 text-lg font-medium">Your creative pipeline is looking healthy today.</p>
        </div>
        <div className="flex gap-4">
           <button className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-stone-100 text-stone-900 rounded-full font-bold shadow-sm hover:bg-stone-50 transition-colors">
              <span>Reports</span>
           </button>
           <button className="flex items-center gap-2 px-8 py-4 bg-stone-900 text-white rounded-full font-bold shadow-lg hover:bg-stone-800 hover:-translate-y-0.5 transition-all">
              <Plus size={20} />
              <span>New Project</span>
           </button>
        </div>
      </div>

      {/* --- Bento Grid --- */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* KPI Cards */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard label="Pipeline Value" value="$128.5k" trend="+12%" icon={TrendingUp} />
          <StatCard label="Impressions" value="45.2k" trend="+8%" icon={Eye} />
          <StatCard label="Leads Today" value="24" trend="+3" icon={MousePointerClick} />
        </div>

        {/* Quick Action / AI Credits */}
        <div className="col-span-12 lg:col-span-4 bg-[#1c1917] rounded-[2.5rem] p-10 relative overflow-hidden text-white flex flex-col justify-between min-h-[180px] shadow-2xl group">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/20 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-600/20 rounded-full blur-[60px]" />
            
            <div className="relative z-10 flex justify-between items-start">
               <div>
                  <div className="flex items-center gap-2 text-emerald-400 mb-3">
                      <Sparkles size={18} className="fill-emerald-400" />
                      <span className="text-xs font-bold uppercase tracking-wider">Credits</span>
                  </div>
                  <div className="text-5xl font-light tracking-tight">850 <span className="text-lg text-stone-500 font-medium">/ 1000</span></div>
               </div>
               <button className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl backdrop-blur-md transition-colors border border-white/5 group-hover:scale-110 duration-300">
                  <Zap size={24} className="text-emerald-300 fill-emerald-300" />
               </button>
            </div>

            <div className="relative z-10 mt-8">
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-3">
                    <div className="h-full bg-emerald-500 w-[85%] rounded-full shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                </div>
                <p className="text-stone-400 text-xs font-semibold">Plan renews in 12 days</p>
            </div>
        </div>

        {/* Featured Project */}
        <div className="col-span-12 lg:col-span-7 h-[460px] relative rounded-[3rem] overflow-hidden group shadow-soft">
           <img 
               src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
               alt="Featured Project" 
               className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
           />
           {/* Gradient Overlay */}
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
           
           <div className="absolute top-8 left-8">
               <span className="px-5 py-2.5 bg-white/20 backdrop-blur-xl border border-white/10 rounded-full text-white text-xs font-bold uppercase tracking-wider">
                  Visualization Ready
               </span>
           </div>

           {/* Glass Details Card */}
           <div className="absolute bottom-8 left-8 right-8 p-8 rounded-[2rem] bg-white/10 backdrop-blur-2xl border border-white/10 text-white flex justify-between items-center">
               <div>
                   <h3 className="text-3xl font-bold mb-2 tracking-tight">Sunset Blvd Kitchen</h3>
                   <p className="text-white/80 text-sm font-medium">Full remodeling render • 3 variations</p>
               </div>
               <button className="w-16 h-16 bg-white text-stone-900 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-lg shadow-black/20">
                   <Play size={24} className="ml-1 fill-stone-900" />
               </button>
           </div>
        </div>

        {/* Analytics Chart */}
        <div className="col-span-12 lg:col-span-5 bg-white rounded-[3rem] p-10 shadow-soft border border-stone-100 flex flex-col">
            <div className="flex justify-between items-center mb-10">
                <div>
                   <h3 className="text-2xl font-bold text-stone-900 tracking-tight">Engagement</h3>
                   <p className="text-stone-500 font-medium text-sm">Views across all campaigns</p>
                </div>
                <div className="px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-full border border-emerald-100">
                    +24.5%
                </div>
            </div>
            
            <div className="flex-1 w-full min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={CHART_DATA}>
                        <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Tooltip 
                            contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)', background: '#1c1917', color: '#fff', padding: '16px' }}
                            itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                            labelStyle={{ display: 'none' }}
                            cursor={{ stroke: '#e7e5e4', strokeWidth: 2 }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="views" 
                            stroke="#10b981" 
                            strokeWidth={5}
                            fillOpacity={1} 
                            fill="url(#colorViews)" 
                        />
                         <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#a8a29e', fontSize: 12, fontWeight: 700 }} 
                            dy={10}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Bottom Section: Recent Projects List & Activity */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-[3rem] p-10 shadow-soft border border-stone-100">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-stone-900 tracking-tight">Recent Projects</h3>
                <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700">View All</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {RECENT_PROJECTS.map((project) => (
                    <div key={project.id} className="group p-4 rounded-[2rem] hover:bg-stone-50 transition-colors border-2 border-transparent hover:border-stone-100 cursor-pointer flex gap-5 items-center">
                        <img src={project.image} alt={project.name} className="w-20 h-20 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform duration-500" />
                        <div>
                            <h4 className="text-lg font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">{project.name}</h4>
                            <p className="text-xs text-stone-400 uppercase tracking-wider font-bold mt-1">{project.type}</p>
                        </div>
                        <div className="ml-auto w-12 h-12 rounded-full bg-white border-2 border-stone-50 flex items-center justify-center text-stone-400 group-hover:text-emerald-600 group-hover:border-emerald-100 transition-all shadow-sm">
                            <ArrowUpRight size={20} />
                        </div>
                    </div>
                 ))}
            </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-white rounded-[3rem] p-10 shadow-soft border border-stone-100">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-stone-900 tracking-tight">Activity</h3>
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="space-y-8 relative">
                {/* Timeline Line */}
                <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-stone-100" />
                
                {MOCK_ACTIVITIES.map((activity, i) => (
                    <div key={activity.id} className="relative pl-12 flex flex-col group cursor-pointer">
                        <div className={`
                            absolute left-2.5 -translate-x-1/2 w-5 h-5 rounded-full border-[3px] border-white box-content z-10
                            ${activity.status === 'processing' ? 'bg-amber-400 shadow-[0_0_0_4px_rgba(251,191,36,0.2)]' : 
                              activity.status === 'completed' ? 'bg-emerald-500 group-hover:scale-110 transition-transform' : 'bg-rose-400'}
                        `}/>
                        <div className="flex items-center justify-between">
                            <h4 className="text-base font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">{activity.title}</h4>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                             <span className="text-[10px] font-extrabold uppercase tracking-wide text-stone-400 bg-stone-50 px-2 py-0.5 rounded-full border border-stone-100">{activity.type}</span>
                             <span className="text-xs text-stone-400 font-medium">{activity.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};