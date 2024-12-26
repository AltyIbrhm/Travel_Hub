import React from 'react';
import { Alert as BootstrapAlert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './styles.css';

const ICONS = {
  success: 'check-circle',
  danger: 'exclamation-circle',
  warning: 'exclamation-triangle',
  info: 'info-circle',
};

const Alert = ({
  variant = 'info',
  title,
  children,
  className = '',
  dismissible = false,
  icon = ICONS[variant],
  ...props
}) => {
  return (
    <BootstrapAlert
      variant={variant}
      className={`custom-alert ${className}`}
      dismissible={dismissible}
      {...props}
    >
      <div className="d-flex align-items-center">
        {icon && <i className={`bi bi-${icon} alert-icon me-2`} />}
        <div className="alert-content">
          {title && <div className="alert-title">{title}</div>}
          <div className="alert-message">{children}</div>
        </div>
      </div>
    </BootstrapAlert>
  );
};

Alert.propTypes = {
  variant: PropTypes.oneOf(['success', 'danger', 'warning', 'info']),
  title: PropTypes.node,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  dismissible: PropTypes.bool,
  icon: PropTypes.string,
  onClose: PropTypes.func,
};

export default Alert; 