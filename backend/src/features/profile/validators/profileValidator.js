const Joi = require('joi');

const profileSchema = Joi.object({
  firstName: Joi.string()
    .allow('')
    .max(50)
    .messages({
      'string.max': 'First name cannot exceed 50 characters'
    }),

  lastName: Joi.string()
    .allow('')
    .max(50)
    .messages({
      'string.max': 'Last name cannot exceed 50 characters'
    }),

  email: Joi.string()
    .allow('')
    .email()
    .messages({
      'string.email': 'Please provide a valid email address'
    }),

  phoneNumber: Joi.string()
    .allow('')
    .pattern(/^\(\d{3}\) \d{3}-\d{4}$/)
    .messages({
      'string.pattern.base': 'Phone number must be in format (XXX) XXX-XXXX'
    }),

  dateOfBirth: Joi.date()
    .allow(null)
    .iso()
    .max('now')
    .messages({
      'date.base': 'Please provide a valid date',
      'date.max': 'Date of birth cannot be in the future'
    }),

  language: Joi.string()
    .allow('')
    .valid('English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Korean')
    .default('English')
    .messages({
      'any.only': 'Please select a valid language'
    }),

  address: Joi.string()
    .allow('')
    .max(255)
    .messages({
      'string.max': 'Address cannot exceed 255 characters'
    }),

  profilePicture: Joi.string()
    .allow(null, '')
    .max(255)
    .messages({
      'string.max': 'Profile picture path cannot exceed 255 characters'
    })
});

const emergencyContactSchema = Joi.object({
  emergencyName: Joi.string()
    .allow('')
    .max(100)
    .messages({
      'string.max': 'Emergency contact name cannot exceed 100 characters'
    }),

  emergencyPhone: Joi.string()
    .allow('')
    .pattern(/^\(\d{3}\) \d{3}-\d{4}$/)
    .messages({
      'string.pattern.base': 'Phone number must be in format (XXX) XXX-XXXX'
    }),

  emergencyRelationship: Joi.string()
    .allow('')
    .valid('Parent', 'Spouse', 'Sibling', 'Child', 'Friend', 'Other')
    .messages({
      'any.only': 'Please select a valid relationship'
    })
});

const validateProfile = (req, res, next) => {
  const { error } = profileSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }))
    });
  }
  next();
};

const validateEmergencyContact = (req, res, next) => {
  const { error } = emergencyContactSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }))
    });
  }
  next();
};

module.exports = {
  validateProfile,
  validateEmergencyContact
}; 