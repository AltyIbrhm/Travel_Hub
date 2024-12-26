import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../ui/Button';
import './styles.css';

const PageHeader = ({
  title,
  subtitle,
  backTo,
  onBack,
  actions,
  className = '',
  ...props
}) => {
  return (
    <div className={`page-header ${className}`} {...props}>
      <div className="page-header-content">
        <div className="page-header-left">
          {(backTo || onBack) && (
            <Button
              variant="outline-primary"
              icon="arrow-left"
              onClick={onBack}
              className="me-3"
            >
              Back
            </Button>
          )}
          <div>
            <h1 className="page-title">{title}</h1>
            {subtitle && <p className="page-subtitle">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="page-header-actions">{actions}</div>}
      </div>
    </div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  backTo: PropTypes.string,
  onBack: PropTypes.func,
  actions: PropTypes.node,
  className: PropTypes.string,
};

export default PageHeader; 