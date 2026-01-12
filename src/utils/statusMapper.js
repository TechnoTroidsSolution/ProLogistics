import { Package, Truck, CheckCircle, Circle } from 'lucide-react';
import { SHIPMENT_STATUS } from './constants';

/**
 * Status configuration mapping
 * Returns styling and icon configuration for each status
 */
const STATUS_CONFIG = {
  [SHIPMENT_STATUS.CREATED]: {
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-300',
    icon: Circle,
    description: 'Shipment has been created and is awaiting processing',
  },
  [SHIPMENT_STATUS.IN_TRANSIT]: {
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-300',
    icon: Truck,
    description: 'Shipment is currently in transit',
  },
  [SHIPMENT_STATUS.DELIVERED]: {
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    borderColor: 'border-green-300',
    icon: CheckCircle,
    description: 'Shipment has been delivered successfully',
  },
};

/**
 * Get status configuration by status name
 * @param {string} status - Status name
 * @returns {Object} Status configuration
 */
export const getStatusConfig = (status) => {
  return STATUS_CONFIG[status] || STATUS_CONFIG[SHIPMENT_STATUS.CREATED];
};

/**
 * Get all status options
 * @returns {Array} Array of status objects with value and label
 */
export const getStatusOptions = () => {
  return Object.values(SHIPMENT_STATUS).map((status) => ({
    value: status,
    label: status,
    ...getStatusConfig(status),
  }));
};

/**
 * Check if status transition is valid
 * @param {string} currentStatus - Current status
 * @param {string} newStatus - Target status
 * @returns {boolean} Whether transition is valid
 */
export const isValidStatusTransition = (currentStatus, newStatus) => {
  const validTransitions = {
    [SHIPMENT_STATUS.CREATED]: [SHIPMENT_STATUS.IN_TRANSIT],
    [SHIPMENT_STATUS.IN_TRANSIT]: [SHIPMENT_STATUS.DELIVERED],
    [SHIPMENT_STATUS.DELIVERED]: [], // Terminal state
  };

  return validTransitions[currentStatus]?.includes(newStatus) || false;
};

/**
 * Get next valid statuses for a given status
 * @param {string} currentStatus - Current status
 * @returns {Array} Array of valid next statuses
 */
export const getNextValidStatuses = (currentStatus) => {
  const transitions = {
    [SHIPMENT_STATUS.CREATED]: [SHIPMENT_STATUS.IN_TRANSIT],
    [SHIPMENT_STATUS.IN_TRANSIT]: [SHIPMENT_STATUS.DELIVERED],
    [SHIPMENT_STATUS.DELIVERED]: [],
  };

  return transitions[currentStatus] || [];
};

/**
 * Get status progress percentage
 * @param {string} status - Current status
 * @returns {number} Progress percentage (0-100)
 */
export const getStatusProgress = (status) => {
  const progressMap = {
    [SHIPMENT_STATUS.CREATED]: 25,
    [SHIPMENT_STATUS.IN_TRANSIT]: 60,
    [SHIPMENT_STATUS.DELIVERED]: 100,
  };

  return progressMap[status] || 0;
};

export default {
  getStatusConfig,
  getStatusOptions,
  isValidStatusTransition,
  getNextValidStatuses,
  getStatusProgress,
};
