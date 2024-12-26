import React from 'react';
import PropTypes from 'prop-types';
import { Modal as BootstrapModal } from 'react-bootstrap';
import { Button } from '../Button';
import './styles.css';

const Modal = ({
  title,
  children,
  isOpen,
  onClose,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  size = 'md',
  confirmVariant = 'primary',
  showFooter = true,
  isConfirmDisabled = false,
  isConfirmLoading = false,
  className = '',
  ...props
}) => {
  return (
    <BootstrapModal
      show={isOpen}
      onHide={onClose}
      size={size}
      centered
      className={`custom-modal ${className}`}
      {...props}
    >
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>{title}</BootstrapModal.Title>
      </BootstrapModal.Header>

      <BootstrapModal.Body>{children}</BootstrapModal.Body>

      {showFooter && (
        <BootstrapModal.Footer>
          <Button variant="outline-secondary" onClick={onClose}>
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={isConfirmDisabled}
            isLoading={isConfirmLoading}
          >
            {confirmText}
          </Button>
        </BootstrapModal.Footer>
      )}
    </BootstrapModal>
  );
};

Modal.propTypes = {
  title: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  confirmVariant: PropTypes.string,
  showFooter: PropTypes.bool,
  isConfirmDisabled: PropTypes.bool,
  isConfirmLoading: PropTypes.bool,
  className: PropTypes.string,
};

export default Modal; 