import { forwardRef } from 'react';

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm',
  secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100 shadow-sm',
  accent: 'bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 shadow-sm',
  ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200',
  danger: 'bg-error-500 text-white hover:bg-error-600 active:bg-error-700 shadow-sm',
  'danger-outline': 'text-error-600 border border-error-300 hover:bg-error-50 active:bg-error-100',
  link: 'text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline p-0',
};

const sizes = {
  sm: 'text-sm px-3 py-1.5 rounded-lg',
  md: 'text-sm px-4 py-2.5 rounded-lg',
  lg: 'text-base px-6 py-3 rounded-xl',
  icon: 'p-2.5 rounded-lg',
};

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold
        transition-all duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
