import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  const hasError = !!error;
  
  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-error-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full rounded-lg border bg-white px-4 py-2.5 text-gray-900
            placeholder:text-gray-400
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${hasError 
              ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20' 
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500/20'
            }
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      {(error || helperText) && (
        <p className={`text-sm ${hasError ? 'text-error-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
