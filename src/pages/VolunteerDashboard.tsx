import { useState } from 'react';
import { queryGemini } from '../services/gemini';
import { useAppContext } from '../context/AppContext';
import { Send, Map, CheckCircle2, UserCheck, AlertOctagon, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { GlowButton } from '../components/ui/GlowButton';

export const VolunteerDashboard = () => {
  const { language } = useAppContext();
  const [query, setQuery] = useState('Where am I needed?');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [taskCompleted, setTaskCompleted] = useState(false);

  const handleQuery = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResponse(null);
    setTaskCompleted(false);

    try {
      const result = await queryGemini(query, 'volunteer', language);
      setResponse(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col space-y-6">
      
      <GlassCard className="flex items-center justify-between !py-4 border-cyan-500/30">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-cyan-900/30 rounded-xl border border-cyan-500/30">
            <UserCheck className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-widest uppercase">Field Agent Terminal</h2>
            <div className="flex items-center mt-1 space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <p className="text-xs text-cyan-400 uppercase tracking-widest font-mono">Status: Awaiting Orders</p>
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="flex-1 flex flex-col !p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-800 bg-black/20 flex items-center">
          <Terminal className="w-4 h-4 text-gray-500 mr-2" />
          <span className="text-xs text-gray-400 font-mono">/bin/bash - Secure Dispatch</span>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <form onSubmit={handleQuery} className="mb-8 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-4 pr-32 py-4 rounded-xl border border-gray-700 bg-gray-900/50 focus:border-cyan-500 text-white font-mono transition-all outline-none"
            />
            <GlowButton
              type="submit"
              disabled={loading}
              variant="secondary"
              className="absolute right-2 top-2 bottom-2 !py-2 !px-4 text-sm"
            >
              Execute <Send className="w-4 h-4 ml-2 inline" />
            </GlowButton>
          </form>

          {loading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
            </div>
          )}

          {response && !loading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-cyan-900/10 p-6 rounded-xl border border-cyan-500/20 shadow-inner"
            >
              <div className="flex items-start mb-6">
                <AlertOctagon className="w-6 h-6 text-yellow-500 mr-4 flex-shrink-0 animate-pulse" />
                <div className="text-gray-200 font-mono whitespace-pre-wrap leading-relaxed text-sm">
                  {response}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-800 pt-6">
                <button 
                  onClick={() => alert("Navigation sequence initiated...")}
                  className="flex justify-center items-center py-3 bg-gray-800 text-cyan-400 border border-cyan-500/30 rounded-xl hover:bg-cyan-900/30 transition-colors font-mono text-sm uppercase tracking-wider"
                >
                  <Map className="w-4 h-4 mr-2" /> Plot Route
                </button>
                
                <button 
                  onClick={() => setTaskCompleted(true)}
                  disabled={taskCompleted}
                  className={`flex justify-center items-center py-3 rounded-xl transition-colors font-mono text-sm uppercase tracking-wider border ${
                    taskCompleted 
                      ? 'bg-green-900/20 border-green-500/20 text-green-500/50 cursor-not-allowed' 
                      : 'bg-green-600/20 border-green-500/50 text-green-400 hover:bg-green-600/40 hover:border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)] hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" /> 
                  {taskCompleted ? 'Objective Complete' : 'Confirm Resolution'}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </GlassCard>
    </div>
  );
};
