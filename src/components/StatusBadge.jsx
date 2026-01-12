import { getStatusConfig } from '../utils/statusMapper';

/**
 * Status Badge Component
 * Displays shipment status with color coding
 */
export default function StatusBadge({ status, size = 'default' }) {
  const config = getStatusConfig(status);

  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    default: 'px-2.5 py-1 text-sm',
    large: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${config.bgColor} ${config.textColor} ${sizeClasses[size]}`}
    >
      {config.icon && <config.icon size={size === 'small' ? 12 : 14} />}
      {status}
    </span>
  );
}
