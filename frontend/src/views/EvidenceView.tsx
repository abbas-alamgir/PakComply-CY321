import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../api/client';
import { Role, Evidence } from '../types';
import { DisclaimerNotice } from '../components/DisclaimerNotice';
import { TableSkeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { RightDrawer } from '../components/RightDrawer';
import styles from './EvidenceView.module.css';

interface EvidenceViewProps {
  currentRole: Role;
}

export const EvidenceView: React.FC<EvidenceViewProps> = ({ currentRole }) => {
  const { t, i18n } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const isReviewer = currentRole === 'reviewer';

  const {
    data: evidenceList = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['evidence'],
    queryFn: apiClient.getEvidence,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    // Security check: Size limit 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setUploadError('File exceeds maximum allowed size of 10 MB.');
      setSelectedFile(null);
      return;
    }

    // Security check: Allowed types
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Unsupported format. Only PDF, DOCX, PNG, and JPEG documents are permitted.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError('Select a valid evidence document before uploading.');
      return;
    }

    // Simulate upload success
    setSuccessNotice(t('common.uploaded', 'Evidence uploaded'));
    setTimeout(() => {
      setDrawerOpen(false);
      setSelectedFile(null);
      setSuccessNotice(null);
    }, 1500);
  };

  return (
    <div className={styles.viewContainer}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>{t('evidence.title', 'Evidence vault')}</h1>
          <p className={styles.pageDescription}>
            {t(
              'evidence.description',
              'Maintain verifiable compliance documentation, encryption policies, and consent records.'
            )}
          </p>
        </div>

        {!isReviewer && (
          <button
            type="button"
            className={styles.uploadBtn}
            onClick={() => setDrawerOpen(true)}
          >
            {t('evidence.uploadButton', 'Upload evidence')}
          </button>
        )}
      </header>

      <DisclaimerNotice />

      {isLoading && <TableSkeleton rows={4} />}
      {isError && (
        <ErrorState
          message="Unable to load evidence records. Check connection and retry."
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && evidenceList.length === 0 && (
        <EmptyState
          title={t('evidence.emptyTitle', 'No evidence uploaded')}
          description={t(
            'evidence.emptyDesc',
            'Upload policies, architecture diagrams, or audit proofs to support assessment claims.'
          )}
          actionLabel={!isReviewer ? t('evidence.uploadButton', 'Upload evidence') : undefined}
          onAction={() => setDrawerOpen(true)}
        />
      )}

      {!isLoading && !isError && evidenceList.length > 0 && (
        <div className={styles.tableContainer}>
          <table className={styles.table} aria-label={t('evidence.title', 'Evidence vault')}>
            <thead>
              <tr>
                <th scope="col">{t('evidence.fileName', 'File name')}</th>
                <th scope="col" style={{ textAlign: 'end' }}>{t('evidence.fileSize', 'Size')}</th>
                <th scope="col">{t('evidence.version', 'Version')}</th>
                <th scope="col">{t('evidence.linkedRequirements', 'Linked requirements')}</th>
                <th scope="col">{t('evidence.uploadedBy', 'Uploaded by')}</th>
                <th scope="col" style={{ textAlign: 'end' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {evidenceList.map((item: Evidence) => (
                <tr key={item.id}>
                  <td className={styles.fileName}>{item.fileName}</td>
                  <td style={{ textAlign: 'end' }} className={styles.numCell}>
                    {formatFileSize(item.fileSize)}
                  </td>
                  <td>{item.version}</td>
                  <td>
                    {item.linkedRequirementIds.map((id) => (
                      <span key={id} className={styles.linkedBadge}>
                        {id}
                      </span>
                    ))}
                  </td>
                  <td>{item.uploadedBy}</td>
                  <td style={{ textAlign: 'end' }} className={styles.numCell}>
                    {formatDate(item.uploadedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Drawer */}
      <RightDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title={t('evidence.uploadButton', 'Upload evidence')}
      >
        <form className={styles.form} onSubmit={handleUploadSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="evidence-file" className={styles.label}>
              Document File (PDF, DOCX, PNG, max 10MB)
            </label>
            <input
              id="evidence-file"
              type="file"
              accept=".pdf,.docx,.png,.jpg,.jpeg"
              className={styles.fileInput}
              onChange={handleFileChange}
            />
            {uploadError && <span className={styles.errorText}>{uploadError}</span>}
          </div>

          {selectedFile && (
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-ink)' }}>
              Selected: <strong>{selectedFile.name}</strong> ({formatFileSize(selectedFile.size)})
            </div>
          )}

          {successNotice && (
            <div role="status" style={{ color: 'var(--color-met)', fontSize: '0.875rem', fontWeight: 600 }}>
              {successNotice}
            </div>
          )}

          <button
            type="submit"
            className={styles.uploadBtn}
            disabled={!selectedFile || Boolean(uploadError)}
          >
            {t('evidence.uploadButton', 'Upload evidence')}
          </button>
        </form>
      </RightDrawer>
    </div>
  );
};
