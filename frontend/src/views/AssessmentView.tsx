import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiClient } from '../api/client';
import { Requirement, AnswerValue, Role } from '../types';
import { RequirementMap } from '../components/RequirementMap';
import { StatusBadge } from '../components/StatusBadge';
import { DisclaimerNotice } from '../components/DisclaimerNotice';
import { RightDrawer } from '../components/RightDrawer';
import { TableSkeleton } from '../components/Skeleton';
import { ErrorState } from '../components/ErrorState';
import styles from './AssessmentView.module.css';

const answerFormSchema = z.object({
  value: z.enum(['yes', 'partial', 'no', 'na']),
  note: z.string().optional(),
});

type AnswerFormData = z.infer<typeof answerFormSchema>;

interface AssessmentViewProps {
  currentRole: Role;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({ currentRole }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [areaFilter, setAreaFilter] = useState('all');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isReviewer = currentRole === 'reviewer';

  // Fetch assessment and requirements
  const {
    data: requirements = [],
    isLoading: reqLoading,
    isError: reqError,
    refetch: refetchReqs,
  } = useQuery({
    queryKey: ['requirements', areaFilter],
    queryFn: () => apiClient.getRequirements(areaFilter),
  });

  const {
    data: assessment,
    isLoading: assessLoading,
  } = useQuery({
    queryKey: ['assessment', 'active'],
    queryFn: apiClient.getActiveAssessment,
  });

  // Mutation to save answer
  const saveMutation = useMutation({
    mutationFn: apiClient.saveAnswer,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['requirements'] });
      queryClient.invalidateQueries({ queryKey: ['assessment'] });
      if (data.updatedRequirement) {
        setSelectedRequirement(data.updatedRequirement);
      }
      setSuccessMessage(t('assessment.saveSuccess', 'Answers saved'));
      setTimeout(() => setSuccessMessage(null), 3000);
    },
  });

  // React Hook Form for the drawer
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<AnswerFormData>({
    resolver: zodResolver(answerFormSchema),
    defaultValues: {
      value: 'yes',
      note: '',
    },
  });

  const handleOpenDrawer = (req: Requirement) => {
    setSelectedRequirement(req);
    // Pre-populate based on current requirement status
    let initialValue: AnswerValue = 'yes';
    if (req.status === 'gap') initialValue = 'no';
    else if (req.status === 'partial') initialValue = 'partial';
    else if (req.status === 'not_assessed') initialValue = 'yes';

    reset({
      value: initialValue,
      note: '',
    });
  };

  const onSubmit = (formData: AnswerFormData) => {
    if (!selectedRequirement || isReviewer) return;
    saveMutation.mutate({
      requirementId: selectedRequirement.id,
      value: formData.value,
      note: formData.note || '',
    });
  };

  // Filtered requirements for main table
  const filteredRequirements = useMemo(() => {
    return requirements.filter((req) => {
      const matchesSearch =
        req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.clause.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.text.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [requirements, searchQuery]);

  return (
    <div className={styles.viewContainer}>
      <header className={styles.pageHeader}>
        <div className={styles.titleRow}>
          <div>
            <h1 className={styles.pageTitle}>{t('assessment.title', 'Compliance assessment')}</h1>
            <p className={styles.pageDescription}>
              {t(
                'assessment.description',
                'Evaluate organization practices against statutory clauses of the 2023 draft bill and PKCERT advisory.'
              )}
            </p>
          </div>
        </div>
      </header>

      {/* Mandatory Statutory Disclaimer */}
      <DisclaimerNotice />

      {/* Score and Stats Banner */}
      {assessment && !assessLoading && (
        <div className={styles.scoreBanner} role="region" aria-label="Assessment summary">
          <div className={styles.scoreFigure}>
            <span className={styles.scoreNumber}>{assessment.scorePercentage}%</span>
            <span className={styles.scoreLabel}>
              {t('reports.scoreLabel', 'Compliance degree')}
            </span>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <StatusBadge status="met" />
              <span>
                {requirements.filter((r) => r.status === 'met').length}
              </span>
            </div>
            <div className={styles.statItem}>
              <StatusBadge status="partial" />
              <span>
                {requirements.filter((r) => r.status === 'partial').length}
              </span>
            </div>
            <div className={styles.statItem}>
              <StatusBadge status="gap" />
              <span>
                {requirements.filter((r) => r.status === 'gap').length}
              </span>
            </div>
            <div className={styles.statItem}>
              <StatusBadge status="not_assessed" />
              <span>
                {requirements.filter((r) => r.status === 'not_assessed').length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Memorable Element: Requirement Map */}
      {!reqLoading && !reqError && requirements.length > 0 && (
        <RequirementMap
          requirements={requirements}
          selectedId={selectedRequirement?.id}
          onSelectRequirement={handleOpenDrawer}
        />
      )}

      {/* Table Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <label htmlFor="search-input" className="sr-only">
            {t('common.search', 'Search requirements')}
          </label>
          <input
            id="search-input"
            type="search"
            className={styles.input}
            placeholder={t('common.search', 'Search requirements...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="area-filter" className="sr-only">
            {t('common.filter', 'Filter by area')}
          </label>
          <select
            id="area-filter"
            className={styles.filterSelect}
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
          >
            <option value="all">{t('common.allAreas', 'All statutory areas')}</option>
            <option value="processing">{t('area.processing', 'Data Processing')}</option>
            <option value="policy">{t('area.policy', 'Privacy Policy')}</option>
            <option value="consent">{t('area.consent', 'Consent Management')}</option>
            <option value="retention">{t('area.retention', 'Data Retention')}</option>
            <option value="security">{t('area.security', 'Security Controls')}</option>
          </select>
        </div>
      </div>

      {/* Loading & Error States */}
      {reqLoading && <TableSkeleton rows={6} />}
      {reqError && (
        <ErrorState
          message="Unable to load statutory requirements. Verify your network or service worker."
          onRetry={() => refetchReqs()}
        />
      )}

      {/* Main Requirement Table */}
      {!reqLoading && !reqError && (
        <div className={styles.tableContainer}>
          <table className={styles.table} aria-label={t('assessment.title', 'Compliance assessment')}>
            <thead>
              <tr>
                <th scope="col">{t('assessment.clause', 'Clause')}</th>
                <th scope="col">{t('assessment.requirement', 'Requirement')}</th>
                <th scope="col">{t('assessment.severity', 'Severity')}</th>
                <th scope="col">{t('assessment.status', 'Status')}</th>
                <th scope="col" style={{ textAlign: 'end' }}>{t('assessment.actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequirements.map((req) => (
                <tr key={req.id}>
                  <td className={styles.clauseCell}>{req.clause}</td>
                  <td className={styles.titleCell}>
                    <div className={styles.reqTitle}>{req.title}</div>
                    <div className={styles.reqMeta}>
                      {t(`area.${req.area}`, req.area)} &bull; {req.legalReference}
                    </div>
                  </td>
                  <td>
                    <span className={styles.severityBadge}>
                      {t(`severity.${req.severity}`, req.severity)}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={req.status} />
                  </td>
                  <td style={{ textAlign: 'end' }}>
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={() => handleOpenDrawer(req)}
                    >
                      {t('assessment.viewDetails', 'View details')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Right-Side Drawer */}
      <RightDrawer
        open={Boolean(selectedRequirement)}
        onOpenChange={(open) => !open && setSelectedRequirement(null)}
        title={selectedRequirement ? `${selectedRequirement.clause} — ${selectedRequirement.title}` : ''}
      >
        {selectedRequirement && (
          <>
            <div className={styles.drawerSection}>
              <span className={styles.drawerLabel}>{t('assessment.requirement', 'Requirement')}</span>
              <p className={styles.drawerText}>{selectedRequirement.text}</p>
            </div>

            {selectedRequirement.legalReference && (
              <div className={styles.drawerSection}>
                <span className={styles.drawerLabel}>Statutory Baseline</span>
                <div className={styles.legalRef}>
                  {selectedRequirement.legalReference}
                </div>
              </div>
            )}

            <div className={styles.drawerSection}>
              <span className={styles.drawerLabel}>{t('assessment.status', 'Status')}</span>
              <div>
                <StatusBadge status={selectedRequirement.status} />
              </div>
            </div>

            {isReviewer ? (
              <div className={styles.readOnlyNotice} role="note">
                Reviewers have read-only access. Answers can only be modified by compliance managers or IT administrators.
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.radioGroup}>
                  <span className={styles.drawerLabel}>{t('assessment.answer', 'Answer')}</span>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      value="yes"
                      className={styles.radioInput}
                      {...register('value')}
                    />
                    <span>{t('assessment.answerYes', 'Yes - fully compliant')}</span>
                  </label>

                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      value="partial"
                      className={styles.radioInput}
                      {...register('value')}
                    />
                    <span>{t('assessment.answerPartial', 'Partial - controls in progress')}</span>
                  </label>

                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      value="no"
                      className={styles.radioInput}
                      {...register('value')}
                    />
                    <span>{t('assessment.answerNo', 'No - gap identified')}</span>
                  </label>

                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      value="na"
                      className={styles.radioInput}
                      {...register('value')}
                    />
                    <span>{t('assessment.answerNa', 'Not applicable')}</span>
                  </label>
                </div>

                <div className={styles.drawerSection}>
                  <label htmlFor="notes-textarea" className={styles.drawerLabel}>
                    {t('assessment.notes', 'Assessment notes')}
                  </label>
                  <textarea
                    id="notes-textarea"
                    className={styles.textarea}
                    placeholder={t(
                      'assessment.notesPlaceholder',
                      'Record operational observations and evidence references...'
                    )}
                    {...register('note')}
                  />
                </div>

                {successMessage && (
                  <div role="status" style={{ color: 'var(--color-met)', fontSize: '0.875rem', fontWeight: 600 }}>
                    {successMessage}
                  </div>
                )}

                <button
                  type="submit"
                  className={styles.saveBtn}
                  disabled={isSubmitting || saveMutation.isPending}
                >
                  {saveMutation.isPending
                    ? t('common.loading', 'Loading...')
                    : t('common.save', 'Save answers')}
                </button>
              </form>
            )}
          </>
        )}
      </RightDrawer>
    </div>
  );
};
