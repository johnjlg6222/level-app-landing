'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Minus, Plus } from 'lucide-react';

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  className,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn('space-y-4', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && <span className="text-sm text-gray-400">{label}</span>}
          {showValue && (
            <motion.span
              key={value}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-white"
            >
              {value}
            </motion.span>
          )}
        </div>
      )}
      <div className="relative h-2">
        <div className="absolute inset-0 bg-white/10 rounded-full" />
        <div
          className="absolute inset-y-0 left-0 bg-blue-600 rounded-full transition-all duration-150"
          style={{ width: `${percentage}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-150"
          style={{ left: `calc(${percentage}% - 10px)` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

// Counter component (increment/decrement buttons)
export interface CounterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  className?: string;
}

export const Counter: React.FC<CounterProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  className,
}) => {
  const handleDecrement = () => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
  };

  const handleIncrement = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
  };

  return (
    <div className={cn('flex items-center gap-4', className)}>
      {label && <span className="text-sm text-gray-400">{label}</span>}
      <div className="flex items-center gap-3 bg-white/5 rounded-xl p-1">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus size={18} />
        </button>
        <motion.span
          key={value}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-12 text-center text-xl font-bold text-white"
        >
          {value}
        </motion.span>
        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
};

export default Slider;
