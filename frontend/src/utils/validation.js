// RaktNavi Form Validation Utilities

/**
 * Validates Indian 10-digit mobile number format (with optional +91 or 0 prefix)
 */
export function validateIndianPhone(phone) {
  if (!phone) return { isValid: false, error: 'Contact phone number is required.' };
  
  // Clean non-digits except leading +
  const cleaned = phone.replace(/[\s\-()]/g, '');
  
  // Regex: matches optional +91 or 91 or 0 followed by 6, 7, 8, or 9 and 9 digits
  const phoneRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
  
  if (!phoneRegex.test(cleaned)) {
    return {
      isValid: false,
      error: 'Please enter a valid 10-digit Indian mobile number (e.g., 9876543210).'
    };
  }
  
  return { isValid: true, error: null };
}

/**
 * Validates required text field with min/max length
 */
export function validateRequiredText(value, fieldName, minLength = 2, maxLength = 100) {
  if (!value || typeof value !== 'string' || value.trim().length === 0) {
    return { isValid: false, error: `${fieldName} is required.` };
  }
  const trimmed = value.trim();
  if (trimmed.length < minLength) {
    return { isValid: false, error: `${fieldName} must be at least ${minLength} characters.` };
  }
  if (trimmed.length > maxLength) {
    return { isValid: false, error: `${fieldName} cannot exceed ${maxLength} characters.` };
  }
  return { isValid: true, error: null };
}

/**
 * Validates units requested (positive integer between 1 and 20)
 */
export function validateUnits(units) {
  const num = Number(units);
  if (!units || isNaN(num) || !Number.isInteger(num)) {
    return { isValid: false, error: 'Please enter a valid whole number of units.' };
  }
  if (num < 1) {
    return { isValid: false, error: 'At least 1 unit must be requested.' };
  }
  if (num > 20) {
    return { isValid: false, error: 'Single emergency requests are capped at 20 units for demonstration.' };
  }
  return { isValid: true, error: null };
}

/**
 * Validates email format
 */
export function validateEmail(email) {
  if (!email) return { isValid: false, error: 'Email address is required.' };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }
  return { isValid: true, error: null };
}
