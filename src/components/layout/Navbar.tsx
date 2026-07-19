import { Link } from 'react-router-dom';
import { Globe, Settings, BellRing, Sparkles } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const Navbar = () => {
  const { language, setLanguage, accessibilityMode, setAccessibilityMode } = useAppContext();

  const toggleAccessibility = () => {
    if (accessibilityMode === 'none') setAccessibilityMode('wheelchair');
    else if (accessibilityMode === 'wheelchair') setAccessibilityMode('visually-impaired');
    else setAccessibilityMode('none');
  };

  const cycleLanguage = () => {
    const langs = ['English', 'Spanish', 'French', 'Hindi', 'Arabic', 'Portuguese'] as const;
    const nextIndex = (langs.indexOf(language) + 1) % langs.length;
    setLanguage(langs[nextIndex]);
  };

  return (
    <nav className="glass-panel fixed inset-x-0 top-0 z-50 border-b border-slate-800/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-white/6 p-1.5 flex items-center justify-center">
              <img src="/arenaos-logo.svg" alt="ArenaOS logo" className="h-12 w-12 object-contain" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">ArenaOS</p>
              <p className="text-sm font-semibold text-slate-100">Operations Intelligence</p>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="status-pill hidden items-center gap-2 rounded-full px-3 py-2 text-sm sm:flex">
            <Sparkles className="h-4 w-4" />
            <span>Gemini Connected</span>
          </div>
          <button
            onClick={cycleLanguage}
            className="flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/50 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-200"
            title={`Current Language: ${language}`}
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline-block">{language.substring(0, 2).toUpperCase()}</span>
          </button>
          <button className="rounded-full border border-slate-700/80 bg-slate-900/50 p-2.5 text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-200">
            <BellRing className="h-4 w-4" />
          </button>
          <button
            onClick={toggleAccessibility}
            className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition ${
              accessibilityMode !== 'none'
                ? 'border-cyan-400/40 bg-cyan-500/10 text-cyan-100'
                : 'border-slate-700/80 bg-slate-900/50 text-slate-200 hover:border-cyan-400/40 hover:text-cyan-200'
            }`}
            title={`Accessibility Mode: ${accessibilityMode}`}
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline-block capitalize">{accessibilityMode === 'none' ? 'Standard' : accessibilityMode}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
