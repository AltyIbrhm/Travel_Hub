// Validation Rules
const rules = {
  required: (value) => {
    if (value === undefined || value === null || value === '') {
      return 'This field is required';
    }
  },
  email: (value) => {
    if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
      return 'Invalid email address';
    }
  },
  min: (length) => (value) => {
    if (value && value.length < length) {
      return `Must be at least ${length} characters`;
    }
  },
  max: (length) => (value) => {
    if (value && value.length > length) {
      return `Must be at most ${length} characters`;
    }
  },
  matches: (pattern, message) => (value) => {
    if (value && !pattern.test(value)) {
      return message;
    }
  },
  phone: (value) => {
    if (value && !/^\+?[\d\s-]{10,}$/.test(value)) {
      return 'Invalid phone number';
    }
  },
  url: (value) => {
    if (value && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value)) {
      return 'Invalid URL';
    }
  },
  numeric: (value) => {
    if (value && !/^\d+$/.test(value)) {
      return 'Must be a number';
    }
  },
};

// Create validator function
export const createValidator = (validations) => {
  return (values) => {
    const errors = {};

    Object.keys(validations).forEach((field) => {
      const value = values[field];
      const fieldValidations = validations[field];

      fieldValidations.forEach((validation) => {
        const errorMessage = typeof validation === 'function'
          ? validation(value)
          : rules[validation](value);

        if (errorMessage) {
          errors[field] = errorMessage;
        }
      });
    });

    return errors;
  };
};

// Example usage:
/*
const validateForm = createValidator({
  email: ['required', 'email'],
  password: ['required', rules.min(8)],
  phone: ['phone'],
});

const errors = validateForm({
  email: 'invalid-email',
  password: '123',
  phone: '123'
});
*/

export default rules; 