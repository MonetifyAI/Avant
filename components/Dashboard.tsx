import React from 'react';
import { 
  ArrowUpRight, 
  Play, 
  MoreVertical, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  TrendingUp,
  Sparkles,
  Video,
  Box
} from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_DATA, MOCK_ACTIVITIES } from '../constants';

const KPICard = ({ label, value, subtext }: { label: string, value: string, subtext: string }) => (
  <div className="flex flex-col">
    <span className="text-slate-500 text-sm font-medium mb-1">{label}</span>
    <span className="text-3xl font-light text-slate-900 tracking-tight">{value}</span>
    <span className="text-xs text-slate-400 mt-1">{subtext}</span>
  </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-12 gap-6 p-2 h-full">
      
      {/* --- Row 1: Header/Stats Strip --- */}
      <div className="col-span-12 lg:col-span-12 flex flex-wrap gap-8 items-center justify-between bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Welcome back, Alex</h2>
          <p className="text-slate-500 text-sm mt-1">Your marketing campaigns are performing well today.</p>
        </div>
        
        <div className="flex gap-12 px-6 border-l border-slate-100">
          <KPICard label="Active Projects" value="78" subtext="Projects" />
          <KPICard label="Leads Generated" value="56" subtext="Hirings" />
          <KPICard label="Total Views" value="203k" subtext="Projects" />
        </div>
      </div>

      {/* --- Row 2: Profile & Main Chart --- */}
      
      {/* Left: Profile / Quick Action Card */}
      <div className="col-span-12 md:col-span-4 xl:col-span-3 flex flex-col gap-6">
        <div className="bg-white rounded-[2rem] p-6 shadow-soft relative overflow-hidden group h-full min-h-[300px] flex flex-col justify-end">
            <img 
                src="https://picsum.photos/400/500?grayscale" 
                alt="Profile" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
            
            <div className="relative z-10 text-white">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <h3 className="text-xl font-semibold">Alex Peterson</h3>
                        <p className="text-slate-300 text-sm">Lead Contractor</p>
                    </div>
                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-medium border border-white/10">
                        $12,450
                    </span>
                </div>
                <button className="w-full mt-4 bg-white text-slate-900 py-3 rounded-xl font-medium hover:bg-blue-50 transition-colors shadow-lg flex items-center justify-center gap-2">
                    <Sparkles size={16} className="text-blue-600" />
                    New Campaign
                </button>
            </div>
        </div>
      </div>

      {/* Center: Progress Chart */}
      <div className="col-span-12 md:col-span-8 xl:col-span-5">
        <div className="bg-white rounded-[2rem] p-8 shadow-soft h-full border border-slate-100 flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <span className="text-slate-500 font-medium">Campaign Performance</span>
                    <div className="flex items-baseline gap-2 mt-1">
                        <h3 className="text-4xl font-light text-slate-900">6.1k</h3>
                        <span className="text-sm text-slate-400">views this week</span>
                    </div>
                </div>
                <button className="p-2 rounded-full hover:bg-slate-50 border border-slate-100 transition-colors">
                    <ArrowUpRight size={20} className="text-slate-400" />
                </button>
            </div>

            <div className="flex-1 w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={CHART_DATA}>
                        <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="views" 
                            stroke="#3b82f6" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorViews)" 
                        />
                         <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#94a3b8', fontSize: 12 }} 
                            dy={10}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            
            <div className="mt-6 flex justify-between items-center">
                <div className="flex gap-4">
                     {['M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                        <div key={i} className={`h-1.5 w-1.5 rounded-full ${i === 3 ? 'bg-blue-500 scale-150' : 'bg-slate-200'}`} />
                     ))}
                </div>
                <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold">
                    +15% Growth
                </span>
            </div>
        </div>
      </div>

      {/* Right: Time Tracker / AI Credits */}
      <div className="col-span-12 md:col-span-6 xl:col-span-4">
        <div className="bg-white rounded-[2rem] p-8 shadow-soft h-full border border-slate-100 flex flex-col items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6">
                 <button className="p-2 rounded-full hover:bg-slate-50 border border-slate-100 transition-colors">
                    <ArrowUpRight size={20} className="text-slate-400" />
                </button>
            </div>
            
            <div className="w-full text-left">
                <span className="text-slate-500 font-medium">AI Processing Credits</span>
            </div>

            {/* Circular Progress Simulation */}
            <div className="relative w-48 h-48 flex items-center justify-center my-6">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="88" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                    <circle cx="96" cy="96" r="88" stroke="#f59e0b" strokeWidth="12" fill="transparent" strokeDasharray="552" strokeDashoffset="138" strokeLinecap="round" />
                </svg>
                <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-light text-slate-900">02:35</span>
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Processing Time</span>
                </div>
            </div>

            <div className="flex gap-4 w-full">
                <button className="flex-1 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center">
                    <Play size={20} className="fill-slate-900 text-slate-900" />
                </button>
                 <button className="flex-1 py-3 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800">
                    <Clock size={20} />
                </button>
            </div>
        </div>
      </div>

      {/* --- Row 3: Bottom Section --- */}

      {/* Bottom Left: Detailed Lists */}
      <div className="col-span-12 xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Simple List Panel 1 */}
        <div className="bg-[#fffbf0] rounded-[2rem] p-6 border border-amber-100/50">
           <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-slate-800">Pension contributions</h3>
                <TrendingUp size={18} className="text-slate-400" />
           </div>
           <div className="space-y-4">
                <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-amber-100/50">
                     <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                        <Video size={18} />
                     </div>
                     <div>
                        <h4 className="font-medium text-slate-900">Sora Video Gen</h4>
                        <p className="text-xs text-slate-500">Rendered 2 mins ago</p>
                     </div>
                     <MoreVertical className="ml-auto text-slate-400" size={16} />
                </div>
           </div>
        </div>

        {/* Simple List Panel 2 */}
        <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-slate-800">Compensation Summary</h3>
                <MoreVertical size={18} className="text-slate-400" />
           </div>
           {/* Calendar Strip */}
           <div className="flex justify-between text-center mb-6">
               <div className="flex flex-col gap-1">
                   <span className="text-xs text-slate-400">Mon</span>
                   <span className="text-sm font-medium text-slate-600">22</span>
               </div>
               <div className="flex flex-col gap-1">
                   <span className="text-xs text-slate-400">Tue</span>
                   <span className="text-sm font-medium text-slate-600">23</span>
               </div>
               <div className="flex flex-col gap-1 p-2 bg-white rounded-lg shadow-sm border border-slate-100 -mt-2">
                   <span className="text-xs text-blue-500 font-bold">Wed</span>
                   <span className="text-sm font-bold text-slate-900">24</span>
               </div>
               <div className="flex flex-col gap-1">
                   <span className="text-xs text-slate-400">Thu</span>
                   <span className="text-sm font-medium text-slate-600">25</span>
               </div>
               <div className="flex flex-col gap-1">
                   <span className="text-xs text-slate-400">Fri</span>
                   <span className="text-sm font-medium text-slate-600">26</span>
               </div>
           </div>

           <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center gap-4 shadow-xl">
               <div className="flex -space-x-2">
                   <img className="w-8 h-8 rounded-full border-2 border-slate-900" src="https://picsum.photos/32/32?random=1" alt="User" />
                   <img className="w-8 h-8 rounded-full border-2 border-slate-900" src="https://picsum.photos/32/32?random=2" alt="User" />
               </div>
               <div className="flex-1">
                   <h4 className="text-sm font-medium">Weekly Team Sync</h4>
                   <p className="text-xs text-slate-400">Discuss progress on projects</p>
               </div>
           </div>
        </div>
      </div>

      {/* Bottom Right: Dark Task List */}
      <div className="col-span-12 xl:col-span-4">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white h-full relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-slate-800 rounded-full blur-3xl opacity-50 pointer-events-none" />

            <div className="flex justify-between items-end mb-8 relative z-10">
                <div>
                    <h3 className="text-lg font-medium">Onboarding Task</h3>
                    <p className="text-slate-400 text-sm mt-1">Setup your marketing profile</p>
                </div>
                <span className="text-3xl font-light">2<span className="text-slate-500 text-xl">/8</span></span>
            </div>

            <div className="space-y-6 relative z-10">
                {MOCK_ACTIVITIES.map((activity, idx) => (
                    <div key={activity.id} className="flex items-start gap-4 group cursor-pointer">
                        <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors
                            ${idx === 0 ? 'bg-slate-800 text-amber-400' : 'bg-slate-800/50 text-slate-500 group-hover:bg-slate-800 group-hover:text-slate-300'}
                        `}>
                            {activity.type === 'video' && <Video size={18} />}
                            {activity.type === 'visualization' && <Box size={18} />}
                            {activity.type === 'photo' && <TrendingUp size={18} />}
                        </div>
                        <div className="flex-1 pt-1 border-b border-slate-800 pb-6 group-last:border-0">
                            <h4 className={`text-sm font-medium ${idx === 0 ? 'text-white' : 'text-slate-400'}`}>
                                {activity.title}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                        </div>
                        <div className="pt-2">
                             {activity.status === 'completed' ? (
                                 <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center">
                                     <CheckCircle2 size={12} strokeWidth={3} />
                                 </div>
                             ) : (
                                 <div className="w-5 h-5 rounded-full border-2 border-slate-700 group-hover:border-slate-500" />
                             )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

    </div>
  );
};