import { formatDateTime } from '../utils/formatters';
import { getStatusConfig } from '../utils/statusMapper';
import { CheckCircle, Circle, Truck, Package, MapPin } from 'lucide-react';

/**
 * Shipment Timeline Component
 * Displays status history in a visual timeline format
 * Data-driven rendering based on history array
 */
export default function ShipmentTimeline({ history = [] }) {
  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <Circle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-500">No status history available</p>
      </div>
    );
  }

  // Sort history by timestamp (newest first for display)
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Created':
        return Package;
      case 'In Transit':
        return Truck;
      case 'Delivered':
        return CheckCircle;
      default:
        return Circle;
    }
  };

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

      <div className="space-y-6">
        {sortedHistory.map((event, index) => {
          const statusInfo = getStatusConfig(event.status);
          const StatusIcon = getStatusIcon(event.status);
          const isLatest = index === 0;

          return (
            <div key={event.id || index} className="relative flex gap-4">
              {/* Status Icon */}
              <div
                className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  isLatest
                    ? `${statusInfo.bgColor} border-current ${statusInfo.textColor}`
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                <StatusIcon size={16} />
              </div>

              {/* Content */}
              <div className={`flex-1 pb-2 ${isLatest ? '' : 'opacity-80'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`font-semibold ${isLatest ? 'text-gray-900' : 'text-gray-700'}`}>
                      {event.status}
                    </p>
                    {event.location && (
                      <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                        <MapPin size={14} />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                  <time className="text-sm text-gray-500 whitespace-nowrap">
                    {formatDateTime(event.timestamp)}
                  </time>
                </div>

                {event.notes && (
                  <p className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                    {event.notes}
                  </p>
                )}

                {event.updatedBy && (
                  <p className="mt-1 text-xs text-gray-400">
                    Updated by: {event.updatedBy}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
