import React from 'react';
import { useTranslation } from 'react-i18next';
import { RequirementStatus } from '../types';
import styles from './StatusBadge.module.css';

interface StatusBadgeProps {
  status: RequirementStatus;
  showWord?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  showWord = true,
  className = '',
}) => {
  const { t } = useTranslation();

  const renderIcon = () => {
    switch (status) {
      case 'met':
        // Check mark SVG
        return (
          <svg
            className={styles.icon}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M4.5 8.2l2.3 2.3 4.7-4.7" />
          </svg>
        );
      case 'partial':
        // Half-filled circle SVG
        return (
          <svg
            className={styles.icon}
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 1a7 7 0 0 0 0 14V1z" fill="currentColor" />
          </svg>
        );
      case 'gap':
        // Cross (X) SVG
        return (
          <svg
            className={styles.icon}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <line x1="5.5" y1="5.5" x2="10.5" y2="10.5" />
            <line x1="10.5" y1="5.5" x2="5.5" y2="10.5" />
          </svg>
        );
      case 'not_assessed':
      default:
        // Empty circle SVG
        return (
          <svg
            className={styles.icon}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeDasharray="2 2" />
          </svg>
        );
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'met':
        return t('status.met', 'Met');
      case 'partial':
        return t('status.partial', 'Partial');
      case 'gap':
        return t('status.gap', 'Gap');
      case 'not_assessed':
      default:
        return t('status.not_assessed', 'Not assessed');
    }
  };

  const label = getStatusLabel();

  return (
    <span
      className={`${styles.badge} ${styles[status]} ${className}`.trim()}
      role="status"
      aria-label={label}
    >
      {renderIcon()}
      {showWord && <span>{label}</span>}
    </span>
  );
};
