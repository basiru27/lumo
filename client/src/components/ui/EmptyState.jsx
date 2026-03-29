import Button from './Button';

export default function EmptyState({ 
  icon,
  title = 'No items found',
  description,
  action,
  actionLabel,
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      {icon && (
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <span className="text-gray-400">{icon}</span>
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-gray-500 max-w-sm mb-6">
          {description}
        </p>
      )}
      {action && actionLabel && (
        <Button onClick={action} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
