import React from 'react';
import './Skeleton.css';

/**
 * Shimmer Skeleton Loader
 * Usage: <Skeleton width="100%" height={20} />
 *        <Skeleton variant="circle" width={40} height={40} />
 *        <Skeleton variant="text" lines={3} />
 */
const Skeleton = ({
  variant = 'rect',   // rect | circle | text
  width,
  height,
  lines = 1,
  className = '',
  style = {},
}) => {
  if (variant === 'text') {
    return (
      <div className={`skeleton-text-group ${className}`} style={style}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{
              height: 14,
              width: i === lines - 1 && lines > 1 ? '70%' : '100%',
              borderRadius: 4,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width:        width,
        height:       height || 20,
        borderRadius: variant === 'circle' ? '50%' : undefined,
        ...style,
      }}
      aria-hidden="true"
    />
  );
};

/* Card-level skeleton preset */
export const SkeletonCard = () => (
  <div className="skeleton-card">
    <Skeleton variant="circle" width={40} height={40} />
    <div style={{ flex: 1 }}>
      <Skeleton variant="text" lines={2} />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 4 }) => (
  <div className="skeleton-table">
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="skeleton-table__row">
        {Array.from({ length: cols }).map((_, c) => (
          <Skeleton key={c} height={16} style={{ flex: 1 }} />
        ))}
      </div>
    ))}
  </div>
);

export default Skeleton;
