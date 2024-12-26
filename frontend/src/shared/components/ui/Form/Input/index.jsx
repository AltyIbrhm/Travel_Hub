import React from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './styles.css';

const Input = ({
  label,
  error,
  type = 'text',
  size = 'md',
  icon,
  className = '',
  isRequired = false,
  helpText,
  ...props
}) => {
  const inputId = props.id || props.name;

  return (
    <Form.Group className={`custom-input ${className}`}>
      {label && (
        <Form.Label htmlFor={inputId} className="d-flex align-items-center">
          {label}
          {isRequired && <span className="text-danger ms-1">*</span>}
        </Form.Label>
      )}
      <div className="input-container">
        {icon && (
          <div className="input-icon">
            <i className={`bi bi-${icon}`} />
          </div>
        )}
        <Form.Control
          id={inputId}
          type={type}
          size={size}
          className={`${icon ? 'has-icon' : ''} ${error ? 'is-invalid' : ''}`}
          {...props}
        />
      </div>
      {helpText && <Form.Text className="text-muted">{helpText}</Form.Text>}
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
};

Input.propTypes = {
  label: PropTypes.node,
  error: PropTypes.string,
  type: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  icon: PropTypes.string,
  className: PropTypes.string,
  isRequired: PropTypes.bool,
  helpText: PropTypes.node,
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
};

export default Input; 