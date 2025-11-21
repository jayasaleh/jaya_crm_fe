/**
 * Toast Utilities
 * Helper functions for showing toast notifications
 */

import toast from 'react-hot-toast';

export const toastUtils = {
  /**
   * Show success toast
   */
  success: (message: string) => {
    toast.success(message, {
      duration: 3000,
    });
  },

  /**
   * Show error toast
   */
  error: (message: string) => {
    toast.error(message, {
      duration: 4000,
    });
  },

  /**
   * Show info toast
   */
  info: (message: string) => {
    toast(message, {
      icon: 'ℹ️',
      duration: 3000,
    });
  },

  /**
   * Show warning toast
   */
  warning: (message: string) => {
    toast(message, {
      icon: '⚠️',
      duration: 3000,
    });
  },

  /**
   * Show loading toast
   */
  loading: (message: string) => {
    return toast.loading(message);
  },

  /**
   * Dismiss toast
   */
  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  },

  /**
   * Show promise toast (for async operations)
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, messages);
  },
};

// Export default toast for direct use if needed
export { toast };

