import { useState } from 'react';
import { StadiumMap } from '../components/map/StadiumMap';
import { queryGemini } from '../services/gemini';
import { useAppContext } from '../context/AppContext';
import { Activity, Users, Send, TrendingUp, AlertTriangle, Cpu } from 'lucide-react';
import { mockGates } from '../data/mockData';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { KPICard } from '../components/ui/KPICard';

export const OrganizerDashboard = () => {
  const { language } = useAppContext();
  const [query, setQuery] = useState('What needs attention right now?');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const densities = mockGates.reduce((acc, gate) => {
    acc[gate.id] = gate.occupancy;
    return acc;
  }, {} as Record<string, number>);

  const handleQuery = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResponse(null);
    try {
      const result = await queryGemini(query, 'organizer', language);
      setResponse(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const sparklineData = Array.from({ length: 10 }, () => ({ value: Math.floor(50000 + Math.random() * 15000) }));
  const alertData = Array.from({ length: 10 }, () => ({ value: Math.floor(Math.random() * 5) }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      
      {/* Top Left: KPIs */}
      <div className="col-span-1 lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
          title="Total Attendance" 
          value="62,450" 
          trend={{ value: 12, label: 'vs expected' }} 
          icon={<Users />} 
          data={sparklineData}
          color="primary"
        />
        <KPICard 
          title="Flow Rate" 
          value="1,200/m" 
          trend={{ value: 5, label: 'vs avg' }} 
          icon={<TrendingUp />} 
          color="success"
        />
        <KPICard 
          title="Active Alerts" 
          value="3" 
          trend={{ value: -2, label: 'resolved' }} 
          icon={<AlertTriangle />} 
          data={alertData}
          color="critical"
        />
      </div>

      {/* Top Right: AI Assistant */}
      <div className="col-span-1 lg:col-span-4 lg:row-span-2 flex flex-col h-full">
        <GlassCard className="flex flex-col h-full !p-0 border-primary-500/30 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
          <div className="p-4 border-b border-gray-800 bg-blue-900/10 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center tracking-widest uppercase">
              <Cpu className="w-5 h-5 mr-2 text-primary-500 animate-pulse" /> 
              Operations Nexus AI
            </h2>
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>

          <div className="flex-1 p-5 overflow-y-auto space-y-4 font-mono text-sm">
            {!response && !loading && (
              <div className="text-gray-500 italic">Nexus Core is online. Awaiting directive...</div>
            )}
            
            {loading && (
              <div className="flex items-center space-x-2 text-primary-400">
                <Activity className="w-4 h-4 animate-spin" />
                <span>Processing stadium telemetry...</span>
              </div>
            )}

            {response && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-900/60 border border-gray-700/50 p-4 rounded-xl text-gray-300 leading-relaxed shadow-inner"
              >
                <div className="whitespace-pre-wrap">{response}</div>
              </motion.div>
            )}
          </div>

          <form onSubmit={handleQuery} className="p-4 border-t border-gray-800 bg-black/20">
            <div className="relative flex items-center">
              <span className="absolute left-3 text-primary-500 font-mono">{">"}</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-8 pr-12 py-3 rounded-lg bg-gray-900/80 border border-gray-700 focus:border-primary-500 text-white font-mono text-sm outline-none transition-colors shadow-inner"
                placeholder="Enter command..."
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 p-1.5 bg-primary-600/20 text-primary-400 rounded hover:bg-primary-600 hover:text-white transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </GlassCard>
      </div>

      {/* Bottom Left: Map */}
      <div className="col-span-1 lg:col-span-8 min-h-[400px]">
        <GlassCard className="h-full flex flex-col !p-0">
          <div className="p-4 border-b border-gray-800 bg-black/20">
            <h2 className="text-sm font-bold text-gray-400 tracking-widest uppercase">Live Telemetry Map</h2>
          </div>
          <div className="flex-1 relative p-4">
            <StadiumMap crowdDensityData={densities} />
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
