// Error message templates for common authentication and form errors
export const errorMessages = {
  // Authentication errors
  auth: {
    invalidCredentials: {
      title: 'Login Failed',
      message: 'The email or password you entered is incorrect. Please try again or reset your password.'
    },
    accountNotFound: {
      title: 'Account Not Found',
      message: 'We couldn\'t find an account with that email address. Please check your email or create a new account.'
    },
    accountExists: {
      title: 'Account Already Exists',
      message: 'An account with this email already exists. Please log in or use a different email address.'
    },
    accountLocked: {
      title: 'Account Locked',
      message: 'Your account has been temporarily locked due to multiple failed login attempts. Please try again later or reset your password.'
    },
    accountSuspended: {
      title: 'Account Suspended',
      message: 'Your account has been suspended. Please contact customer support for assistance.'
    },
    emailNotVerified: {
      title: 'Email Not Verified',
      message: 'Please verify your email address before logging in. Check your inbox for a verification link.'
    },
    sessionExpired: {
      title: 'Session Expired',
      message: 'Your session has expired. Please log in again to continue.'
    }
  },
  
  // Form validation errors
  validation: {
    requiredField: {
      title: 'Required Field Missing',
      message: 'Please fill in all required fields before submitting.'
    },
    invalidEmail: {
      title: 'Invalid Email',
      message: 'Please enter a valid email address (e.g., name@example.com).'
    },
    passwordTooShort: {
      title: 'Password Too Short',
      message: 'Your password must be at least 8 characters long.'
    },
    passwordRequirements: {
      title: 'Password Requirements Not Met',
      message: 'Your password must include at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long.'
    },
    passwordMismatch: {
      title: 'Passwords Don\'t Match',
      message: 'The passwords you entered don\'t match. Please try again.'
    },
    invalidPhone: {
      title: 'Invalid Phone Number',
      message: 'Please enter a valid phone number.'
    }
  },
  
  // Network and server errors
  network: {
    connectionError: {
      title: 'Connection Error',
      message: 'We\'re having trouble connecting to our servers. Please check your internet connection and try again.'
    },
    serverError: {
      title: 'Server Error',
      message: 'Something went wrong on our end. Please try again later.'
    },
    timeoutError: {
      title: 'Request Timeout',
      message: 'The request took too long to complete. Please try again.'
    },
    maintenanceError: {
      title: 'System Maintenance',
      message: 'Our system is currently undergoing maintenance. Please try again later.'
    }
  },
  
  // Generic errors
  generic: {
    unknownError: {
      title: 'Something Went Wrong',
      message: 'An unexpected error occurred. Please try again or contact support if the problem persists.'
    },
    permissionDenied: {
      title: 'Permission Denied',
      message: 'You don\'t have permission to perform this action.'
    }
  }
};

// Helper function to parse Supabase error messages and return user-friendly errors
export const parseSupabaseError = (error: any): { title: string; message: string } => {
  const errorMessage = error?.message || '';
  
  // Invalid login credentials
  if (errorMessage.includes('Invalid login credentials')) {
    return errorMessages.auth.invalidCredentials;
  }
  
  // Email already registered
  if (errorMessage.includes('already registered')) {
    return errorMessages.auth.accountExists;
  }
  
  // User not found
  if (errorMessage.includes('user not found')) {
    return errorMessages.auth.accountNotFound;
  }
  
  // Email not confirmed
  if (errorMessage.includes('Email not confirmed')) {
    return errorMessages.auth.emailNotVerified;
  }
  
  // For database permission errors
  if (errorMessage.includes('permission denied')) {
    return errorMessages.generic.permissionDenied;
  }
  
  // For network errors
  if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Network Error')) {
    return errorMessages.network.connectionError;
  }
  
  // Default to generic error
  return {
    title: 'Error',
    message: errorMessage || 'An unexpected error occurred. Please try again.'
  };
};