import { forwardRef } from 'react';

const Select = forwardRef(({ 
  label,
  error,
  helperText,
  options = [],
  placeholder = 'Select an option',
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
        <select
          ref={ref}
          className={`
            w-full appearance-none rounded-lg border bg-white px-4 py-2.5 pr-10 text-gray-900
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${!props.value ? 'text-gray-400' : ''}
            ${hasError 
              ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20' 
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500/20'
            }
            ${className}
          `}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
              {typeof opt === 'string' ? opt : opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {(error || helperText) && (
        <p className={`text-sm ${hasError ? 'text-error-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
