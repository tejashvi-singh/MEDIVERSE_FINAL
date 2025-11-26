export const APPOINTMENT_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
  };
  
  export const APPOINTMENT_TYPES = {
    CONSULTATION: 'consultation',
    FOLLOW_UP: 'follow-up',
    CHECK_UP: 'check-up'
  };
  
  export const USER_ROLES = {
    DOCTOR: 'doctor',
    PATIENT: 'patient',
    ADMIN: 'admin'
  };
  
  export const EMERGENCY_SEVERITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
  };
  
  export const EMERGENCY_STATUS = {
    CONNECTING: 'connecting',
    CONNECTED: 'connected',
    ENDED: 'ended'
  };
  
  export const ERROR_MESSAGES = {
    USER_NOT_FOUND: 'User not found',
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_EXISTS: 'Email already registered',
    UNAUTHORIZED: 'Unauthorized access',
    SERVER_ERROR: 'Internal server error',
    INVALID_TOKEN: 'Invalid or expired token'
  };
  
  export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Login successful',
    SIGNUP_SUCCESS: 'Account created successfully',
    APPOINTMENT_CREATED: 'Appointment scheduled successfully',
    APPOINTMENT_CANCELLED: 'Appointment cancelled',
    PROFILE_UPDATED: 'Profile updated successfully'
  };
  
  export const WORKING_HOURS = {
    START: 9,
    END: 17,
    INTERVAL_MINUTES: 30
  };
  
  export const JWT_CONFIG = {
    EXPIRES_IN: '7d',
    SECRET: process.env.JWT_SECRET || 'your-secret-key'
  };