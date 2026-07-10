import React from 'react';
import './Card.css';

/**
 * Glassmorphic Card Component
 * Variants: default | elevated | bordered | gradient
 */
const Card = ({
  children,
  variant = 'default',
  hover = false,
  className = '',
  style,
  onClick,
  header,
  footer,
  padding = 'md',
  ...props
}) => {
  const classes = [
    'card',
    `card--${variant}`,
    `card--pad-${padding}`,
    hover   ? 'card--hover'     : '',
    onClick ? 'card--clickable' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      style={style}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick(e) : undefined}
      {...props}
    >
      {header && <div className="card__header">{header}</div>}
      <div className="card__body">{children}</div>
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
};

export default Card;
