import React from 'react';
import { Card as BootstrapCard } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './styles.css';

const Card = ({ 
  title,
  subtitle,
  children,
  actions,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  ...props 
}) => {
  return (
    <BootstrapCard className={`custom-card ${className}`} {...props}>
      {(title || subtitle || actions) && (
        <BootstrapCard.Header className={`d-flex justify-content-between align-items-center ${headerClassName}`}>
          <div>
            {title && <h4 className="mb-0">{title}</h4>}
            {subtitle && <p className="text-muted mb-0 mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="card-actions">{actions}</div>}
        </BootstrapCard.Header>
      )}
      <BootstrapCard.Body className={bodyClassName}>
        {children}
      </BootstrapCard.Body>
    </BootstrapCard>
  );
};

Card.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
  children: PropTypes.node.isRequired,
  actions: PropTypes.node,
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
};

export default Card; 