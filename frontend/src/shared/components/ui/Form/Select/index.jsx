import React from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './styles.css';

const Select = ({
  label,
  error,
  options = [],
  size = 'md',
  className = '',
  isRequired = false,
  helpText,
  ...props
}) => {
  const selectId = props.id || props.name;

  return (
    <Form.Group className={`custom-select ${className}`}>
      {label && (
        <Form.Label htmlFor={selectId} className="d-flex align-items-center">
          {label}
          {isRequired && <span className="text-danger ms-1">*</span>}
        </Form.Label>
      )}
      <Form.Select
        id={selectId}
        size={size}
        className={error ? 'is-invalid' : ''}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Form.Select>
      {helpText && <Form.Text className="text-muted">{helpText}</Form.Text>}
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
};

Select.propTypes = {
  label: PropTypes.node,
  error: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.node.isRequired,
    })
  ),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  isRequired: PropTypes.bool,
  helpText: PropTypes.node,
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
};

export default Select; 