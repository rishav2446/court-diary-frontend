import React, { forwardRef } from 'react';

import './Button.css';

/**
 * Premium Button Component
 * Variants: primary | secondary | ghost | danger | gold
 * Sizes: sm | md | lg
 */
const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}, ref) => {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? 'btn--full' : '',
    loading ? 'btn--loading' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {/* Ripple effect overlay */}
      <span className="btn__ripple" aria-hidden="true" />

      {/* Icon Left */}
      {Icon && iconPosition === 'left' && !loading && (
        <span className="btn__icon btn__icon--left">
          <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
        </span>
      )}

      {/* Loading Spinner */}
      {loading && (
        <span className="btn__spinner" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
              strokeDasharray="32" strokeDashoffset="12" />
          </svg>
        </span>
      )}

      {/* Label */}
      <span className="btn__label">{children}</span>

      {/* Icon Right */}
      {Icon && iconPosition === 'right' && !loading && (
        <span className="btn__icon btn__icon--right">
          <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
        </span>
      )}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
