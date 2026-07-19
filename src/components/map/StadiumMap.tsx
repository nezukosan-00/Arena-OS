import { motion } from 'framer-motion';

interface StadiumMapProps {
  highlightedRoute?: { start: string; end: string } | null;
  crowdDensityData?: Record<string, number>;
}

export const StadiumMap = ({ highlightedRoute, crowdDensityData }: StadiumMapProps) => {
  const getDensityColor = (density: number = 0) => {
    if (density > 80) return '#ef4444'; // Red
    if (density > 50) return '#f59e0b'; // Yellow
    return '#22c55e'; // Green
  };

  return (
    <div className="w-full h-full min-h-[300px] rounded-2xl overflow-hidden relative flex items-center justify-center">
      <svg viewBox="0 0 800 600" className="w-full h-full max-h-[500px] drop-shadow-2xl">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Pitch / Field */}
        <rect x="250" y="200" width="300" height="200" rx="10" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" filter="url(#glow)" opacity="0.8" />
        <circle cx="400" cy="300" r="30" fill="none" stroke="#3b82f6" strokeWidth="2" filter="url(#glow)" opacity="0.6" />
        <line x1="400" y1="200" x2="400" y2="400" stroke="#3b82f6" strokeWidth="2" filter="url(#glow)" opacity="0.6" />
        <rect x="250" y="250" width="40" height="100" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.6" />
        <rect x="510" y="250" width="40" height="100" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.6" />

        {/* Stands / Seating Areas */}
        <path d="M 200 150 C 400 50, 600 150, 600 150 L 550 200 C 400 120, 250 200, 250 200 Z" fill="#1e3a8a" opacity="0.3" stroke="#3b82f6" strokeWidth="1" />
        <path d="M 200 450 C 400 550, 600 450, 600 450 L 550 400 C 400 480, 250 400, 250 400 Z" fill="#1e3a8a" opacity="0.3" stroke="#3b82f6" strokeWidth="1" />
        <path d="M 150 200 C 50 300, 150 400, 150 400 L 200 350 C 120 300, 200 250, 200 250 Z" fill="#1e3a8a" opacity="0.3" stroke="#3b82f6" strokeWidth="1" />
        <path d="M 650 200 C 750 300, 650 400, 650 400 L 600 350 C 680 300, 600 250, 600 250 Z" fill="#1e3a8a" opacity="0.3" stroke="#3b82f6" strokeWidth="1" />

        {/* Gates with Pulsing Animations */}
        {['g1', 'g2', 'g3', 'g4'].map((id, index) => {
          const positions = [
            { x: 400, y: 80, label: 'NORTH GATE' },
            { x: 700, y: 300, label: 'EAST GATE' },
            { x: 400, y: 520, label: 'SOUTH GATE' },
            { x: 100, y: 300, label: 'WEST GATE' }
          ];
          const pos = positions[index];
          const color = getDensityColor(crowdDensityData?.[id]);
          
          return (
            <g key={id} transform={`translate(${pos.x}, ${pos.y})`}>
              <motion.circle 
                cx="0" cy="0" r="25" 
                fill={color} opacity="0.2"
                animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <circle cx="0" cy="0" r="10" fill={color} filter="url(#glow)" />
              <text x="0" y="25" fontSize="10" textAnchor="middle" fill="#94a3b8" fontWeight="bold" letterSpacing="1">{pos.label}</text>
            </g>
          );
        })}

        {/* Dynamic Route Visualization */}
        {highlightedRoute && (
          <motion.path
            d="M 100 300 Q 250 150 400 200" 
            fill="none"
            stroke="#06b6d4"
            strokeWidth="4"
            strokeDasharray="15 10"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        )}
      </svg>
      
      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 glass-input px-3 py-2 rounded-lg text-[10px] font-mono flex items-center space-x-3 uppercase">
        <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-green-500 mr-2 shadow-[0_0_8px_#22c55e]"></div>Nominal</div>
        <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-yellow-500 mr-2 shadow-[0_0_8px_#f59e0b]"></div>Elevated</div>
        <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-red-500 mr-2 shadow-[0_0_8px_#ef4444]"></div>Critical</div>
      </div>
    </div>
  );
};
