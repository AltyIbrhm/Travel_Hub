import React from 'react';
import { Button as BootstrapButton } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './styles.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  ...props 
}) => {
  return (
    <BootstrapButton
      variant={variant}
      size={size}
      className={`custom-button ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="d-flex align-items-center justify-content-center">
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
          Loading...
        </div>
      ) : (
        <div className="d-flex align-items-center justify-content-center">
          {icon && <i className={`bi bi-${icon} me-2`} />}
          {children}
        </div>
      )}
    </BootstrapButton>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  isLoading: PropTypes.bool,
  icon: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Button; 