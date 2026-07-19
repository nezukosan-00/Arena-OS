import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldAlert, UserCheck, Fingerprint, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { GlowButton } from '../components/ui/GlowButton';
import { createAccount, getFirebaseErrorMessage, signInToAccount, isFirebaseConfigured } from '../services/firebase';
import { useAppContext } from '../context/AppContext';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { currentUser, authReady } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const roles = [
    { id: 'organizer', title: 'OPERATIONS', desc: 'Secure Command Center Access', icon: ShieldAlert, path: '/organizer', color: 'text-primary-500', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]' },
    { id: 'volunteer', title: 'FIELD AGENT', desc: 'Active Volunteer Deployment', icon: UserCheck, path: '/volunteer', color: 'text-cyan-500', glow: 'shadow-[0_0_20px_rgba(6,182,212,0.3)]' },
    { id: 'fan', title: 'PUBLIC ACCESS', desc: 'Fan Navigation & Services', icon: User, path: '/fan', color: 'text-purple-500', glow: 'shadow-[0_0_20px_rgba(124,92,252,0.3)]' },
  ];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        await createAccount(email, password);
      } else {
        await signInToAccount(email, password);
      }
      navigate('/organizer');
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full relative z-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_50%)] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Fingerprint className="w-20 h-20 text-blue-500 animate-pulse drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
            <div className="absolute inset-0 border-2 border-blue-500 rounded-full animate-ping opacity-20" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-widest uppercase mb-4 neon-text">
          Arena<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">OS</span>
        </h1>
        <p className="text-sm md:text-base text-gray-400 uppercase tracking-[0.3em] font-medium">
          FIFA World Cup 2026 • Authorized Personnel Only
        </p>
      </motion.div>

      <div className="w-full max-w-5xl px-4 mt-10">
        <GlassCard className="mx-auto max-w-xl rounded-3xl border border-slate-700/70 bg-slate-950/70 p-6 shadow-[0_0_40px_rgba(59,130,246,0.15)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Secure Access</p>
              <h2 className="text-xl font-semibold text-white">Sign in to ArenaOS</h2>
            </div>
            <div className="rounded-full border border-cyan-500/30 bg-cyan-500/10 p-3 text-cyan-200">
              <LogIn className="h-5 w-5" />
            </div>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm text-slate-300" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white outline-none ring-0"
                placeholder="operator@arenaos.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white outline-none ring-0"
                placeholder="Enter your password"
                required
              />
            </div>

            {!isFirebaseConfigured && (
              <p className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
                Firebase is not configured yet. Add your VITE_FIREBASE_* values to the environment file to enable sign-in.
              </p>
            )}

            {error && <p className="text-sm text-rose-300">{error}</p>}

            <div className="flex items-center gap-3">
              <GlowButton type="submit" className="flex-1" disabled={isSubmitting || !authReady}>
                {isSubmitting ? 'PROCESSING...' : mode === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'}
              </GlowButton>
              <button
                type="button"
                className="text-sm text-cyan-300 underline"
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              >
                {mode === 'signin' ? 'Create account' : 'Sign in'}
              </button>
            </div>
          </form>

          {currentUser && (
            <p className="mt-4 text-sm text-emerald-300">
              Signed in as {currentUser.email}
            </p>
          )}
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl px-4 mt-8">
        {roles.map((role, i) => {
          const Icon = role.icon;
          return (
            <motion.div 
              key={role.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <GlassCard 
                interactive 
                onClick={() => navigate(role.path)}
                className="group flex flex-col items-center text-center py-12"
              >
                <div className={`mb-6 p-4 rounded-full bg-gray-900/50 border border-gray-700 transition-all duration-300 group-hover:border-blue-500 group-hover:${role.glow}`}>
                  <Icon className={`w-10 h-10 ${role.color}`} />
                </div>
                <h2 className="text-xl font-bold text-white tracking-widest mb-2 group-hover:neon-text transition-all">{role.title}</h2>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-mono mb-8">
                  {role.desc}
                </p>
                <GlowButton variant={role.id === 'organizer' ? 'primary' : 'secondary'} className="w-full text-sm">
                  INITIALIZE
                </GlowButton>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
