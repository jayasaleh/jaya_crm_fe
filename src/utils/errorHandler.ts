/**
 * Error handling utilities
 */

interface ApiError {
  response?: {
    data?: {
      message?: string;
      errors?: Array<{ field: string; message: string }>;
    };
  };
  message?: string;
}

export function getErrorMessage(error: unknown): string {
  if (typeof error === "string") {
    return error;
  }

  const apiError = error as ApiError;
  
  if (apiError?.response?.data?.message) {
    return apiError.response.data.message;
  }

  if (apiError?.message) {
    return apiError.message;
  }

  return "An unexpected error occurred";
}

export function getFieldErrors(error: unknown): Record<string, string> {
  const apiError = error as ApiError;
  const fieldErrors: Record<string, string> = {};

  if (apiError?.response?.data?.errors) {
    apiError.response.data.errors.forEach((err) => {
      fieldErrors[err.field] = err.message;
    });
  }

  return fieldErrors;
}

