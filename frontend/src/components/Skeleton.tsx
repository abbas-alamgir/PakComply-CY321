import React from 'react';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  height?: string | number;
  width?: string | number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  height = '1rem',
  width = '100%',
  className = '',
}) => {
  return (
    <div
      className={`${styles.skeleton} ${className}`.trim()}
      style={{ height, width }}
      aria-hidden="true"
    />
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className={styles.tableSkeleton} role="status" aria-label="Loading content">
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className={styles.row} />
      ))}
    </div>
  );
};
