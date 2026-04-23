import DOMPurify from 'dompurify';

// Sanitize user input to prevent XSS
export const sanitize = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
};

// Sanitize HTML content (for rich text)
export const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
};

// Rate limiting utility
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxAttempts) {
    return false;
  }

  record.count++;
  return true;
};

// CSRF token generation
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

// Secure headers for API calls
export const getSecureHeaders = (csrfToken: string) => ({
  'Content-Type': 'application/json',
  'X-CSRF-Token': csrfToken,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
});

// Input length limiter
export const limitInputLength = (input: string, maxLength: number): string => {
  return input.slice(0, maxLength);
};

// Prevent clickjacking
export const preventClickjacking = () => {
  try {
    if (window.self !== window.top && window.top) {
      window.top.location.href = window.self.location.href;
    }
  } catch {
    // Cross-origin frame, cannot access
  }
};
