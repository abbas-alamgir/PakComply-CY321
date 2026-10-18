import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DisclaimerNotice.module.css';

interface DisclaimerNoticeProps {
  className?: string;
}

export const DisclaimerNotice: React.FC<DisclaimerNoticeProps> = ({ className = '' }) => {
  const { t } = useTranslation();

  return (
    <aside className={`${styles.notice} ${className}`.trim()} aria-label="Legal disclaimer">
      <p className={styles.noticeText}>
        <strong>{t('disclaimer.prefix', 'Important:')} </strong>
        {t(
          'disclaimer.text',
          'Assessed against the 2023 draft bill. Not legal advice or certification.'
        )}
      </p>
    </aside>
  );
};
