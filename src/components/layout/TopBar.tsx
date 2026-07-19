import { Bell, Globe, Activity, CloudRain, Clock, AlertOctagon } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useEffect, useState } from 'react';
import { getAllStadiumData } from '../../data/mockData';

export const TopBar = () => {
  const { language, setLanguage } = useAppContext();
  const [time, setTime] = useState(new Date());
  const { weather, matches } = getAllStadiumData();
  const weatherInfo = weather[0];
  const matchInfo = matches[0];

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const cycleLanguage = () => {
    const langs = ['English', 'Spanish', 'French', 'Hindi', 'Arabic', 'Portuguese'] as const;
    const nextIndex = (langs.indexOf(language) + 1) % langs.length;
    setLanguage(langs[nextIndex]);
  };

  return (
    <header className="fixed top-0 left-0 sm:left-20 md:left-64 right-0 h-16 glass-panel border-b border-gray-800/50 z-30 flex items-center justify-between px-6 rounded-none">
      <div className="flex items-center space-x-6">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Current Match</span>
          <span className="text-sm font-bold text-white">{matchInfo?.match ?? 'No live match'} • {matchInfo?.stadium ?? 'Arena'}</span>
        </div>
        <div className="h-8 w-px bg-gray-800" />
        <div className="flex items-center space-x-2 text-green-500">
          <Activity className="w-4 h-4 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider">AI Connected</span>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="hidden md:flex items-center space-x-2 text-gray-400">
          <CloudRain className="w-4 h-4" />
          <span className="text-sm font-medium">{weatherInfo?.temperatureC ?? 0}°C / {weatherInfo?.condition ?? 'Clear'} • {weatherInfo?.humidity ?? 0}% humidity</span>
        </div>

        <button onClick={cycleLanguage} className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors">
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">{language.substring(0, 2).toUpperCase()}</span>
        </button>

        <div className="flex items-center space-x-1 text-gray-300 font-mono text-sm">
          <Clock className="w-4 h-4 mr-1 text-blue-400" />
          {time.toLocaleTimeString([], { hour12: false })}
        </div>

        <button className="relative text-gray-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </button>

        <button className="flex items-center space-x-2 bg-red-500/10 text-red-500 border border-red-500/30 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all neon-text-critical">
          <AlertOctagon className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Emergency</span>
        </button>
      </div>
    </header>
  );
};
