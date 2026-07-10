import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import './Modal.css';

/**
 * Premium Modal Component
 * Features: backdrop blur, slide-up animation, focus trap, Escape to close
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',      // sm | md | lg | xl | full
  showClose = true,
  closeOnBackdrop = true,
  footer,
  className = '',
}) => {
  const modalRef = useRef(null);
  const onCloseRef = useRef(onClose);

  // Keep onCloseRef current value updated
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  /* Focus trap & Escape key */
  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') { onCloseRef.current(); return; }
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements?.length) return;
        const first = focusableElements[0];
        const last  = focusableElements[focusableElements.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { last.focus(); e.preventDefault(); }
        } else {
          if (document.activeElement === last)  { first.focus(); e.preventDefault(); }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    // Move focus inside modal
    setTimeout(() => modalRef.current?.querySelector('button, [href], input')?.focus(), 50);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previouslyFocused?.focus();
    };
  }, [isOpen]);

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 28, stiffness: 360 } },
    exit:    { opacity: 0, y: 20, scale: 0.97, transition: { duration: 0.18 } },
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.2 }}
          onClick={closeOnBackdrop ? onClose : undefined}
          aria-hidden="true"
        >
          <motion.div
            ref={modalRef}
            className={`modal modal--${size} ${className}`}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
          >
            {/* Header */}
            {(title || showClose) && (
              <div className="modal__header">
                {title && (
                  <h3 id="modal-title" className="modal__title">{title}</h3>
                )}
                {showClose && (
                  <button
                    className="modal__close"
                    onClick={onClose}
                    aria-label="Close modal"
                  >
                    <FiX size={20} />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="modal__body">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="modal__footer">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
