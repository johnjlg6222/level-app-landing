'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type = 'text', label, error, helper, icon, iconPosition = 'left', ...props },
    ref
  ) => {
    const id = props.id || props.name || `input-${Math.random().toString(36).slice(2)}`;

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-400">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {icon}
            </div>
          )}
          <input
            id={id}
            type={type}
            ref={ref}
            className={cn(
              'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white',
              'placeholder:text-gray-500',
              'focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
              'transition-colors duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              icon && iconPosition === 'left' && 'pl-10',
              icon && iconPosition === 'right' && 'pr-10',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {icon}
            </div>
          )}
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        {helper && !error && <p className="text-sm text-gray-500">{helper}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea component
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helper, ...props }, ref) => {
    const id = props.id || props.name || `textarea-${Math.random().toString(36).slice(2)}`;

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-400">
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          className={cn(
            'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white',
            'placeholder:text-gray-500',
            'focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
            'transition-colors duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'min-h-[120px] resize-y',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        {helper && !error && <p className="text-sm text-gray-500">{helper}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Input;
