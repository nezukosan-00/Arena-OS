import { type ReactNode } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { GlassCard } from './GlassCard';

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: { value: number; label: string };
  icon?: ReactNode;
  data?: { value: number }[];
  color?: 'primary' | 'success' | 'warning' | 'critical';
}

export const KPICard = ({ title, value, trend, icon, data, color = 'primary' }: KPICardProps) => {
  
  const getColorHex = () => {
    switch(color) {
      case 'success': return '#22c55e';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#3b82f6'; // primary
    }
  };

  const hexColor = getColorHex();

  return (
    <GlassCard interactive className="flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">{title}</h3>
        {icon && <div className="text-gray-400 opacity-80">{icon}</div>}
      </div>
      
      <div className="flex items-end gap-3 mb-4">
        <div className={`text-4xl font-black tracking-tight`} style={{ color: hexColor }}>
          {value}
        </div>
        {trend && (
          <div className={`flex items-center text-sm font-medium ${trend.value >= 0 ? 'text-green-500' : 'text-red-500'} mb-1`}>
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </div>
        )}
      </div>

      {data && data.length > 0 && (
        <div className="h-16 w-full mt-auto">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`colorGradient-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={hexColor} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={hexColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={hexColor} 
                strokeWidth={2}
                fillOpacity={1} 
                fill={`url(#colorGradient-${title.replace(/\s+/g, '')})`} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </GlassCard>
  );
};
