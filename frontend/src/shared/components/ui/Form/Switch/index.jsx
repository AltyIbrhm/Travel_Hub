import React from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './styles.css';

const Switch = ({
  label,
  description,
  className = '',
  ...props
}) => {
  const switchId = props.id || props.name;

  return (
    <Form.Group className={`custom-switch ${className}`}>
      <div className="d-flex align-items-start">
        <Form.Check
          type="switch"
          id={switchId}
          className="switch-input"
          {...props}
        />
        <div className="ms-2">
          {label && (
            <Form.Label htmlFor={switchId} className="switch-label mb-0">
              {label}
            </Form.Label>
          )}
          {description && (
            <p className="switch-description text-muted mb-0">
              {description}
            </p>
          )}
        </div>
      </div>
    </Form.Group>
  );
};

Switch.propTypes = {
  label: PropTypes.node,
  description: PropTypes.node,
  className: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};

export default Switch; 