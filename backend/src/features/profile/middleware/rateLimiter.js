const rateLimit = require('express-rate-limit');

// General profile operations limiter
const profileLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again after 15 minutes',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Photo upload operations limiter (more restrictive)
const photoUploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 photo uploads per hour
  message: {
    status: 'error',
    message: 'Too many photo upload attempts from this IP, please try again after an hour',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Emergency contact update limiter
const emergencyContactLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 20, // limit each IP to 20 emergency contact updates per 30 minutes
  message: {
    status: 'error',
    message: 'Too many emergency contact updates from this IP, please try again after 30 minutes',
    retryAfter: '30 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  profileLimiter,
  photoUploadLimiter,
  emergencyContactLimiter
}; 