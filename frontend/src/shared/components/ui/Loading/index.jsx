import React from 'react';
import { Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './styles.css';

const Loading = ({
  variant = 'primary',
  size = 'md',
  text,
  fullscreen = false,
  overlay = false,
  className = '',
  ...props
}) => {
  const Component = (
    <div className={`loading-container ${className} ${fullscreen ? 'fullscreen' : ''} ${overlay ? 'overlay' : ''}`}>
      <div className="loading-content">
        <Spinner
          animation="border"
          variant={variant}
          size={size}
          role="status"
          {...props}
        />
        {text && <div className="loading-text mt-2">{text}</div>}
      </div>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="loading-fullscreen-wrapper">
        {Component}
      </div>
    );
  }

  return Component;
};

Loading.propTypes = {
  variant: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  text: PropTypes.node,
  fullscreen: PropTypes.bool,
  overlay: PropTypes.bool,
  className: PropTypes.string,
};

export default Loading; 