import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        <label htmlFor={inputId} className="text-sm font-medium text-text-body">
          {label}
        </label>
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            className={`flex h-10 w-full rounded-md border border-border-color bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
            {...props}
          />
          {icon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
        </div>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
