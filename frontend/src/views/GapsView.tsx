import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../api/client';
import { DisclaimerNotice } from '../components/DisclaimerNotice';
import { TableSkeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import styles from './GapsView.module.css';

export const GapsView: React.FC = () => {
  const { t, i18n } = useTranslation();

  const {
    data: gaps = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['gaps'],
    queryFn: apiClient.getGaps,
  });

  const formatDate = (dateStr: string) => {
    try {
      return new Intl.DateTimeFormat(i18n.language, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={styles.viewContainer}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{t('gaps.title', 'Compliance gaps')}</h1>
        <p className={styles.pageDescription}>
          {t(
            'gaps.description',
            'Deficiencies identified during assessment requiring remediation under the 2023 draft bill.'
          )}
        </p>
      </header>

      <DisclaimerNotice />

      {isLoading && <TableSkeleton rows={4} />}
      {isError && (
        <ErrorState
          message="Unable to retrieve compliance gaps. Check your network or API service."
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && gaps.length === 0 && (
        <EmptyState
          title={t('gaps.emptyTitle', 'No compliance gaps identified')}
          description={t(
            'gaps.emptyDesc',
            'Complete the assessment checklist to identify and remediate compliance gaps.'
          )}
        />
      )}

      {!isLoading && !isError && gaps.length > 0 && (
        <div className={styles.tableContainer}>
          <table className={styles.table} aria-label={t('gaps.title', 'Compliance gaps')}>
            <thead>
              <tr>
                <th scope="col">{t('assessment.clause', 'Clause')}</th>
                <th scope="col">{t('gaps.title', 'Deficiency & Recommendation')}</th>
                <th scope="col">{t('assessment.severity', 'Severity')}</th>
                <th scope="col">{t('gaps.owner', 'Owner')}</th>
                <th scope="col" style={{ textAlign: 'end' }}>{t('gaps.dueDate', 'Due date')}</th>
                <th scope="col" style={{ textAlign: 'end' }}>{t('assessment.status', 'Status')}</th>
              </tr>
            </thead>
            <tbody>
              {gaps.map((gap) => (
                <tr key={gap.id}>
                  <td className={styles.clauseCell}>{gap.clause}</td>
                  <td className={styles.titleCell}>
                    <div className={styles.gapTitle}>{gap.title}</div>
                    <div className={styles.recommendation}>{gap.recommendation}</div>
                  </td>
                  <td>
                    <span
                      className={
                        gap.severity === 'high'
                          ? styles.severityHigh
                          : styles.severityMedium
                      }
                    >
                      {t(`severity.${gap.severity}`, gap.severity)}
                    </span>
                  </td>
                  <td>{gap.ownerName}</td>
                  <td style={{ textAlign: 'end' }} className={styles.dateCell}>
                    {formatDate(gap.dueDate)}
                  </td>
                  <td style={{ textAlign: 'end' }}>
                    <span
                      className={`${styles.statusPill} ${
                        gap.status === 'open'
                          ? styles.statusOpen
                          : gap.status === 'in_progress'
                          ? styles.statusInProgress
                          : styles.statusResolved
                      }`}
                    >
                      {gap.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
