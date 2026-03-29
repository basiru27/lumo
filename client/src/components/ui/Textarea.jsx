import { forwardRef } from 'react';

const Textarea = forwardRef(({ 
  label,
  error,
  helperText,
  className = '',
  containerClassName = '',
  rows = 4,
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
      <textarea
        ref={ref}
        rows={rows}
        className={`
          w-full rounded-lg border bg-white px-4 py-2.5 text-gray-900
          placeholder:text-gray-400
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-0
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          resize-none
          ${hasError 
            ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20' 
            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500/20'
          }
          ${className}
        `}
        {...props}
      />
      {(error || helperText) && (
        <p className={`text-sm ${hasError ? 'text-error-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
