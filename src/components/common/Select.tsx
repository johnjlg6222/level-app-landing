'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption<T = string> {
  value: T;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

// Standard dropdown select
export interface SelectProps<T = string> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  label?: string;
  error?: string;
  className?: string;
}

export function Select<T extends string>({
  value,
  onChange,
  options,
  placeholder = 'Sélectionner...',
  label,
  error,
  className,
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={cn('relative space-y-2', className)}>
      {label && <label className="block text-sm font-medium text-gray-400">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-left',
          'flex items-center justify-between gap-2',
          'focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
          'transition-colors duration-200',
          error && 'border-red-500'
        )}
      >
        <span className={selectedOption ? 'text-white' : 'text-gray-500'}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          size={18}
          className={cn('text-gray-400 transition-transform', isOpen && 'rotate-180')}
        />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute z-50 w-full mt-2 bg-[#0F1115] border border-white/10 rounded-xl shadow-xl overflow-hidden"
        >
          {options.map((option) => (
            <button
              key={String(option.value)}
              type="button"
              disabled={option.disabled}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                'w-full px-4 py-3 text-left flex items-center justify-between',
                'hover:bg-white/5 transition-colors',
                option.disabled && 'opacity-50 cursor-not-allowed',
                option.value === value && 'bg-blue-500/10 text-blue-400'
              )}
            >
              <div className="flex items-center gap-3">
                {option.icon}
                <div>
                  <div className="text-white">{option.label}</div>
                  {option.description && (
                    <div className="text-xs text-gray-500">{option.description}</div>
                  )}
                </div>
              </div>
              {option.value === value && <Check size={16} className="text-blue-400" />}
            </button>
          ))}
        </motion.div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

// Card-based select (for wizard steps)
export interface SelectCardsProps<T = string> {
  value: T | null;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  columns?: 1 | 2 | 3;
  className?: string;
}

export function SelectCards<T extends string>({
  value,
  onChange,
  options,
  columns = 2,
  className,
}: SelectCardsProps<T>) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
  };

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {options.map((option) => {
        const isSelected = option.value === value;

        return (
          <motion.button
            key={String(option.value)}
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(option.value)}
            disabled={option.disabled}
            className={cn(
              'p-6 rounded-xl border text-left flex items-start gap-4 transition-all',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#050507]',
              isSelected
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10',
              option.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {option.icon && (
              <div className={cn('text-2xl', isSelected ? 'text-blue-400' : 'text-gray-400')}>
                {option.icon}
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className={cn('font-semibold', isSelected ? 'text-white' : 'text-gray-300')}>
                  {option.label}
                </span>
                {isSelected && <Check className="text-blue-500" size={18} />}
              </div>
              {option.description && (
                <p className="mt-1 text-sm text-gray-500">{option.description}</p>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

export default Select;
