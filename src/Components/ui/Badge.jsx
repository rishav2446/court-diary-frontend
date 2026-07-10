import React from 'react';
import './Badge.css';

/**
 * Status Badge Component
 * Variants: success | warning | danger | info | neutral | gold
 */
const Badge = ({
  children,
  variant = 'neutral',
  dot = false,
  size = 'md',
  className = '',
  ...props
}) => {
  return (
    <span
      className={`badge badge--${variant} badge--${size} ${className}`}
      {...props}
    >
      {dot && <span className="badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
};

export default Badge;
