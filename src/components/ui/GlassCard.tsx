import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export const GlassCard = ({ children, className = '', onClick, interactive = false }: GlassCardProps) => {
  const baseClasses = interactive ? 'glass-card cursor-pointer' : 'glass-panel';
  
  return (
    <motion.div
      whileHover={interactive ? { scale: 1.02 } : {}}
      whileTap={interactive ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`${baseClasses} p-6 relative overflow-hidden ${className}`}
    >
      {/* Subtle top glare effect */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      {children}
    </motion.div>
  );
};
