import { AlertTriangle, Radio, Activity } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

export const RightPanel = () => {
  const incidents = [
    { id: 1, type: 'Medical', loc: 'Gate 2', time: '2m ago', priority: 'high' },
    { id: 2, type: 'Congestion', loc: 'Food Court B', time: '5m ago', priority: 'medium' },
  ];

  return (
    <aside className="w-80 flex-shrink-0 hidden xl:flex flex-col gap-6 h-full overflow-y-auto pr-2 pb-6">
      
      <GlassCard className="p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center">
          <Radio className="w-4 h-4 mr-2 text-primary-400 animate-pulse" />
          Live Match Feed
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center bg-gray-900/50 p-3 rounded-lg border border-gray-800">
            <span className="text-sm font-bold">BRA 1 - 0 ARG</span>
            <span className="text-xs text-green-400 animate-pulse">45+2'</span>
          </div>
          <p className="text-xs text-gray-400">Goal by Vinicius Jr. Stadium atmosphere at peak levels.</p>
        </div>
      </GlassCard>

      <GlassCard className="p-5 flex-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center">
          <Activity className="w-4 h-4 mr-2 text-red-400" />
          Active Incidents
        </h3>
        
        <div className="space-y-3">
          {incidents.map(inc => (
            <div key={inc.id} className="bg-gray-900/50 p-3 rounded-lg border border-gray-800 flex items-start space-x-3 transition-colors hover:border-gray-600 cursor-pointer">
              <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${inc.priority === 'high' ? 'text-red-500' : 'text-yellow-500'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{inc.type}</p>
                <p className="text-xs text-gray-400">{inc.loc}</p>
              </div>
              <span className="text-[10px] text-gray-500 font-mono">{inc.time}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Transport Status</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-300">Metro Line A</span>
              <span className="text-green-400">Normal</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full w-[30%]"></div></div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-300">Parking Zone B</span>
              <span className="text-yellow-400">95% Full</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5"><div className="bg-yellow-500 h-1.5 rounded-full w-[95%]"></div></div>
          </div>
        </div>
      </GlassCard>

    </aside>
  );
};
