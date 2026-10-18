import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { apiClient } from '../api/client';
import { Role, Report } from '../types';
import { DisclaimerNotice } from '../components/DisclaimerNotice';
import { TableSkeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { StatusBadge } from '../components/StatusBadge';
import styles from './ReportsView.module.css';

interface ReportsViewProps {
  currentRole: Role;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ currentRole }) => {
  const { t, i18n } = useTranslation();
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const isReviewer = currentRole === 'reviewer';

  const {
    data: reports = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['reports'],
    queryFn: apiClient.getReports,
  });

  // Trend data for Recharts (trend chart only)
  const trendData = [
    { date: 'Jul 2026', score: 35 },
    { date: 'Aug 2026', score: 48 },
    { date: 'Sep 2026', score: 55 },
    { date: 'Oct 2026', score: 62.5 },
  ];

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

  const handleGenerateReport = () => {
    // Simulate generation
    setSuccessToast(t('common.generated', 'Report generated'));
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className={styles.viewContainer}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>{t('reports.title', 'Compliance reports')}</h1>
          <p className={styles.pageDescription}>
            {t(
              'reports.description',
              'Generate auditable compliance evaluation summaries.'
            )}
          </p>
        </div>

        {!isReviewer && (
          <button
            type="button"
            className={styles.generateBtn}
            onClick={handleGenerateReport}
          >
            {t('reports.generateButton', 'Generate report')}
          </button>
        )}
      </header>

      {/* Mandatory Statutory Disclaimer */}
      <DisclaimerNotice />

      {successToast && <div className={styles.toast} role="status">{successToast}</div>}

      {/* Compliance Score Trend Chart (Trend charts only) */}
      <div className={styles.chartContainer}>
        <h2 className={styles.chartTitle}>Compliance Score Progression Trend (%)</h2>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="date"
                stroke="#536471"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#D5DBD8' }}
              />
              <YAxis
                domain={[0, 100]}
                stroke="#536471"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#D5DBD8' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#D5DBD8',
                  borderRadius: 0,
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#1F4E9C"
                strokeWidth={2}
                dot={{ r: 4, fill: '#1F4E9C' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {isLoading && <TableSkeleton rows={3} />}
      {isError && (
        <ErrorState
          message="Unable to retrieve reports. Verify connection and retry."
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && reports.length === 0 && (
        <EmptyState
          title={t('reports.emptyTitle', 'No reports generated')}
          description={t(
            'reports.emptyDesc',
            'Generate an assessment report for internal review or regulatory readiness audit.'
          )}
          actionLabel={!isReviewer ? t('reports.generateButton', 'Generate report') : undefined}
          onAction={handleGenerateReport}
        />
      )}

      {!isLoading && !isError && reports.length > 0 && (
        <div className={styles.tableContainer}>
          <table className={styles.table} aria-label={t('reports.title', 'Compliance reports')}>
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col" style={{ textAlign: 'end' }}>{t('reports.scoreLabel', 'Score')}</th>
                <th scope="col">Statutory Breakdown</th>
                <th scope="col">Generated by</th>
                <th scope="col" style={{ textAlign: 'end' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report: Report) => (
                <tr key={report.id}>
                  <td className={styles.reportTitle}>{report.title}</td>
                  <td style={{ textAlign: 'end' }} className={styles.scoreCell}>
                    {report.scorePercentage}%
                  </td>
                  <td>
                    <div className={styles.statusSummary}>
                      <span>
                        <StatusBadge status="met" showWord={false} /> {report.metCount}
                      </span>
                      <span>
                        <StatusBadge status="partial" showWord={false} /> {report.partialCount}
                      </span>
                      <span>
                        <StatusBadge status="gap" showWord={false} /> {report.gapCount}
                      </span>
                    </div>
                  </td>
                  <td>{report.generatedBy}</td>
                  <td style={{ textAlign: 'end' }} className={styles.numCell}>
                    {formatDate(report.generatedAt)}
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
