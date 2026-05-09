import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

  const variants = {
    primary:
      'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md focus:ring-red-500',
    secondary:
      'bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-400',
    ghost:
      'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-300',
    danger:
      'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 focus:ring-red-400',
    outline:
      'bg-white border border-gray-300 hover:border-red-500 hover:text-red-600 text-gray-700 focus:ring-red-400',
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
