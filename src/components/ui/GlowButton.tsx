import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlowButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
}

export const GlowButton = ({ children, onClick, disabled, type = 'button', variant = 'primary', className = '' }: GlowButtonProps) => {
  const getGradient = () => {
    switch (variant) {
      case 'danger': return 'from-red-600 to-red-500';
      case 'secondary': return 'from-cyan-600 to-cyan-500';
      default: return 'from-blue-600 to-blue-500';
    }
  };

  const getShadow = () => {
    switch (variant) {
      case 'danger': return 'rgba(239, 68, 68, 0.4)';
      case 'secondary': return 'rgba(6, 182, 212, 0.4)';
      default: return 'rgba(59, 130, 246, 0.4)';
    }
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        boxShadow: `0 0 15px ${getShadow()}`,
      }}
      className={`relative overflow-hidden rounded-xl px-6 py-3 font-semibold text-white transition-all bg-gradient-to-r ${getGradient()} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />
      <span className="relative z-10 flex items-center justify-center space-x-2">
        {children}
      </span>
    </motion.button>
  );
};
