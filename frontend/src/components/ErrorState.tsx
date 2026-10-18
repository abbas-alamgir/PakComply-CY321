import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ErrorState.module.css';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  onRetry,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.container} role="alert" aria-live="assertive">
      <h3 className={styles.title}>{title || t('error.defaultTitle', 'Request failed')}</h3>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button type="button" className={styles.retryButton} onClick={onRetry}>
          {t('common.retry', 'Retry request')}
        </button>
      )}
    </div>
  );
};
