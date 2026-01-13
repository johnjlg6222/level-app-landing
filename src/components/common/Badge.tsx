'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'outline';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  pulse?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-white/10 text-gray-300 border-white/10',
  primary: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  success: 'bg-green-500/20 text-green-400 border-green-500/30',
  warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  error: 'bg-red-500/20 text-red-400 border-red-500/30',
  outline: 'bg-transparent text-gray-400 border-white/20',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon,
  pulse = false,
  className,
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              variant === 'primary' && 'bg-blue-400',
              variant === 'success' && 'bg-green-400',
              variant === 'warning' && 'bg-yellow-400',
              variant === 'error' && 'bg-red-400',
              variant === 'default' && 'bg-gray-400'
            )}
          />
          <span
            className={cn(
              'relative inline-flex rounded-full h-2 w-2',
              variant === 'primary' && 'bg-blue-500',
              variant === 'success' && 'bg-green-500',
              variant === 'warning' && 'bg-yellow-500',
              variant === 'error' && 'bg-red-500',
              variant === 'default' && 'bg-gray-500'
            )}
          />
        </span>
      )}
      {icon}
      {children}
    </span>
  );
};

// Status indicator (colored dot)
export interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'busy' | 'away';
  showLabel?: boolean;
  className?: string;
}

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-500',
  busy: 'bg-red-500',
  away: 'bg-yellow-500',
};

const statusLabels = {
  online: 'En ligne',
  offline: 'Hors ligne',
  busy: 'Occupé',
  away: 'Absent',
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  showLabel = false,
  className,
}) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className={cn('w-2 h-2 rounded-full', statusColors[status])} />
      {showLabel && <span className="text-sm text-gray-400">{statusLabels[status]}</span>}
    </div>
  );
};

// Price badge (animated)
export interface PriceBadgeProps {
  amount: number;
  suffix?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PriceBadge: React.FC<PriceBadgeProps> = ({
  amount,
  suffix = '€',
  size = 'md',
  className,
}) => {
  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <motion.div
      key={amount}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn('font-bold text-white', textSizes[size], className)}
    >
      {amount.toLocaleString('fr-FR')} {suffix}
    </motion.div>
  );
};

export default Badge;
