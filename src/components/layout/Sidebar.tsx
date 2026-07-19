import { Link, useLocation } from 'react-router-dom';
import { User, UserCheck, Activity, Map, AlertTriangle, Settings, Power } from 'lucide-react';

export const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Fan Portal', path: '/fan', icon: User },
    { name: 'Operations', path: '/organizer', icon: Activity },
    { name: 'Volunteer', path: '/volunteer', icon: UserCheck },
    { name: 'Analytics', path: '/analytics', icon: Map },
    { name: 'Emergency', path: '/emergency', icon: AlertTriangle },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-20 md:w-64 glass-panel border-r border-gray-800/50 flex flex-col z-40 rounded-none rounded-r-2xl hidden sm:flex">
      <div className="p-6 flex items-center justify-center md:justify-start space-x-3 border-b border-gray-800/50">
        <div className="rounded-md bg-white/6 p-1 flex items-center justify-center">
          <img src="/arenaos-logo.svg" alt="ArenaOS logo" className="w-10 h-10 object-contain" />
        </div>
        <div className="hidden md:block">
          <h1 className="font-black text-lg tracking-wider">ArenaOS</h1>
          <p className="text-[10px] text-primary-400 uppercase tracking-widest">Command Center</p>
        </div>
      </div>

      <div className="flex-1 py-6 flex flex-col gap-2 px-3 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-blue-900/20 text-blue-400 neon-border-active' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'neon-text' : ''}`} />
              <span className="hidden md:block font-medium tracking-wide text-sm">{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-800/50">
        <button className="w-full flex items-center justify-center md:justify-start space-x-4 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
          <Power className="w-5 h-5" />
          <span className="hidden md:block font-medium tracking-wide text-sm">Disconnect</span>
        </button>
      </div>
    </aside>
  );
};
