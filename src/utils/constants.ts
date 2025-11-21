/**
 * Application Constants
 * Centralized constants used throughout the application
 */

export const USER_ROLES = {
  SALES: 'SALES',
  MANAGER: 'MANAGER',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const LEAD_STATUS = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  QUALIFIED: 'QUALIFIED',
  CONVERTED: 'CONVERTED',
  LOST: 'LOST',
} as const;

export const LEAD_SOURCE = {
  WEBSITE: 'WEBSITE',
  WALKIN: 'WALKIN',
  PARTNER: 'PARTNER',
  REFERRAL: 'REFERRAL',
  OTHER: 'OTHER',
} as const;

export const DEAL_STATUS = {
  DRAFT: 'DRAFT',
  WAITING_APPROVAL: 'WAITING_APPROVAL',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export const SERVICE_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
} as const;

// Status badge colors
export const STATUS_COLORS = {
  [LEAD_STATUS.NEW]: 'bg-blue-100 text-blue-800',
  [LEAD_STATUS.CONTACTED]: 'bg-yellow-100 text-yellow-800',
  [LEAD_STATUS.QUALIFIED]: 'bg-green-100 text-green-800',
  [LEAD_STATUS.CONVERTED]: 'bg-purple-100 text-purple-800',
  [LEAD_STATUS.LOST]: 'bg-red-100 text-red-800',
  [DEAL_STATUS.DRAFT]: 'bg-gray-100 text-gray-800',
  [DEAL_STATUS.WAITING_APPROVAL]: 'bg-yellow-100 text-yellow-800',
  [DEAL_STATUS.APPROVED]: 'bg-green-100 text-green-800',
  [DEAL_STATUS.REJECTED]: 'bg-red-100 text-red-800',
  [SERVICE_STATUS.ACTIVE]: 'bg-green-100 text-green-800',
  [SERVICE_STATUS.INACTIVE]: 'bg-gray-100 text-gray-800',
  [SERVICE_STATUS.SUSPENDED]: 'bg-orange-100 text-orange-800',
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [10, 20, 50, 100],
} as const;

