import { Users, CreditCard, Activity, TrendingUp } from 'lucide-react'

export default function AdminOverviewPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h1>
        <p className="text-slate-400 mt-1">Welcome back. Here's what's happening on Spandha today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value="1,248" change="+12% this week" icon={Users} color="indigo" />
        <StatCard title="Active Subscriptions" value="342" change="+5% this week" icon={CreditCard} color="emerald" />
        <StatCard title="Proposals Sent" value="8,930" change="+24% this week" icon={Activity} color="rose" />
        <StatCard title="Monthly Revenue" value="$4,200" change="+8% this week" icon={TrendingUp} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <h2 className="text-lg font-medium text-white mb-4">Revenue Overview</h2>
          <div className="h-64 flex flex-col items-center justify-center text-slate-500 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
             <TrendingUp className="w-8 h-8 mb-2 opacity-20" />
             <p className="text-sm">Revenue charts will appear here</p>
             <p className="text-xs opacity-60">Requires Stripe / Payment Integration</p>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
          <h2 className="text-lg font-medium text-white mb-4">Recent Registrations</h2>
          <div className="space-y-4">
             {[1,2,3,4,5].map(i => (
               <div key={i} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl transition-colors cursor-default">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-medium text-sm">
                   U{i}
                 </div>
                 <div>
                   <p className="text-sm font-medium text-slate-200">New User {i}</p>
                   <p className="text-xs text-slate-400">Joined 2 hours ago</p>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, change, icon: Icon, color }: any) {
  const colors: Record<string, string> = {
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  }

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 group-hover:opacity-30 transition-opacity rounded-full -mr-16 -mt-16 ${colors[color].split(' ')[1]}`} />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-sm font-medium text-slate-400">{title}</h3>
        <div className={`p-2 rounded-lg border ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-baseline gap-2 relative z-10">
        <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
      </div>
      <p className="mt-2 text-xs font-medium text-emerald-400 relative z-10">{change}</p>
    </div>
  )
}
