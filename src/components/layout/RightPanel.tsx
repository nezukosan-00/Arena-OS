import { AlertTriangle, Radio, Activity } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { getAllStadiumData } from '../../data/mockData';

export const RightPanel = () => {
  const { incidents, transport, matches } = getAllStadiumData();
  const matchInfo = matches[0];
  const incidentItems = incidents.map((incident, index) => ({
    id: index + 1,
    type: incident.type,
    loc: incident.location,
    time: incident.status,
    priority: incident.priority,
  }));
  const transportItems = transport.slice(0, 3);

  return (
    <aside className="w-80 flex-shrink-0 hidden xl:flex flex-col gap-6 h-full overflow-y-auto pr-2 pb-6">
      
      <GlassCard className="p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center">
          <Radio className="w-4 h-4 mr-2 text-primary-400 animate-pulse" />
          Live Match Feed
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center bg-gray-900/50 p-3 rounded-lg border border-gray-800">
            <span className="text-sm font-bold">{matchInfo?.match ?? 'No live match'}</span>
            <span className="text-xs text-green-400 animate-pulse">{matchInfo?.status ?? 'Scheduled'}</span>
          </div>
          <p className="text-xs text-gray-400">{matchInfo?.stadium ?? 'Arena'} • {matchInfo?.time ?? '--:--'} • Score {matchInfo?.score ?? 'TBD'}</p>
        </div>
      </GlassCard>

      <GlassCard className="p-5 flex-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center">
          <Activity className="w-4 h-4 mr-2 text-red-400" />
          Active Incidents
        </h3>
        
        <div className="space-y-3">
          {incidentItems.map((inc) => (
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
          {transportItems.map((item) => (
            <div key={item.service}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-300">{item.service}</span>
                <span className={item.status === 'Delayed' ? 'text-yellow-400' : 'text-green-400'}>{item.status ?? 'Available'}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full ${item.status === 'Delayed' ? 'bg-yellow-500 w-[60%]' : 'bg-green-500 w-[30%]'}`}></div>
              </div>
              {item.nextArrival && <p className="mt-1 text-[10px] text-gray-500">Next arrival: {item.nextArrival}</p>}
              {item.availableSpaces && <p className="mt-1 text-[10px] text-gray-500">Spaces: {item.availableSpaces}</p>}
            </div>
          ))}
        </div>
      </GlassCard>

    </aside>
  );
};
