import { useState } from 'react';
import { StadiumMap } from '../components/map/StadiumMap';
import { queryGemini } from '../services/gemini';
import { useAppContext } from '../context/AppContext';
import { Send, MapPin, Navigation, Bot } from 'lucide-react';
import { mockGates } from '../data/mockData';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';

export const FanDashboard = () => {
  const { language, accessibilityMode } = useAppContext();
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [routeActive, setRouteActive] = useState(false);

  const densities = mockGates.reduce((acc, gate) => {
    acc[gate.id] = gate.occupancy;
    return acc;
  }, {} as Record<string, number>);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResponse(null);
    setRouteActive(false);

    try {
      const result = await queryGemini(query, 'fan', language, accessibilityMode);
      setResponse(result);
      setRouteActive(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Left: Chat / Assistant */}
      <GlassCard className="lg:col-span-1 flex flex-col h-[calc(100vh-8rem)] !p-0">
        <div className="p-5 border-b border-gray-800 bg-purple-900/10">
          <h2 className="text-lg font-bold text-white flex items-center tracking-widest uppercase">
            <Bot className="mr-3 text-purple-400" /> Wayfinder AI
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="bg-gray-800/50 rounded-xl p-4 text-sm text-gray-300 border border-gray-700">
            <span className="text-purple-400 font-bold uppercase tracking-wider block mb-2 text-xs">System</span>
            Welcome. How can I assist your journey?
            {accessibilityMode !== 'none' && <span className="block mt-2 text-yellow-400 text-xs">Accessibility Mode Active</span>}
          </div>

          {response && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4 text-sm text-gray-200"
            >
              <span className="text-purple-400 font-bold uppercase tracking-wider block mb-2 text-xs">Wayfinder</span>
              <div className="whitespace-pre-wrap leading-relaxed">{response}</div>
            </motion.div>
          )}

          {loading && (
            <div className="flex space-x-2 p-4">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          )}
        </div>

        <form onSubmit={handleSearch} className="p-4 border-t border-gray-800 bg-black/20">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Find food avoiding crowds"
              className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-700 bg-gray-900/80 focus:border-purple-500 text-white transition-all outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 p-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600 hover:text-white transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </GlassCard>

      {/* Right: Map & Context */}
      <div className="lg:col-span-2 flex flex-col space-y-6 h-[calc(100vh-8rem)]">
        <GlassCard className="flex-1 !p-2">
          <StadiumMap 
            crowdDensityData={densities} 
            highlightedRoute={routeActive ? { start: 'Gate 4', end: 'Seat' } : null} 
          />
        </GlassCard>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-32">
          <GlassCard className="flex items-center space-x-4">
            <div className="p-3 bg-blue-900/30 text-blue-400 rounded-xl border border-blue-500/30">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Est. Time</p>
              <p className="text-2xl font-black text-white">
                {routeActive ? '4m 20s' : '--'}
              </p>
            </div>
          </GlassCard>
          
          <GlassCard className="flex items-center space-x-4">
            <div className="p-3 bg-green-900/30 text-green-400 rounded-xl border border-green-500/30">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Path Status</p>
              <p className="text-xl font-bold text-green-400">
                {routeActive ? 'Clear' : '--'}
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
