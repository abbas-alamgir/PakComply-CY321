import React from 'react';
import { useTranslation } from 'react-i18next';
import { Requirement } from '../types';
import { StatusBadge } from './StatusBadge';
import styles from './RequirementMap.module.css';

interface RequirementMapProps {
  requirements: Requirement[];
  selectedId?: string | null;
  onSelectRequirement: (requirement: Requirement) => void;
}

export const RequirementMap: React.FC<RequirementMapProps> = ({
  requirements,
  selectedId,
  onSelectRequirement,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.mapContainer} aria-label={t('map.ariaLabel', 'Requirement compliance map')}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t('map.title', 'Requirement map')}</h2>
        <div className={styles.legend}>
          <StatusBadge status="met" />
          <StatusBadge status="partial" />
          <StatusBadge status="gap" />
          <StatusBadge status="not_assessed" />
        </div>
      </div>

      <div className={styles.grid} role="listbox" aria-label={t('map.listLabel', 'Requirements list')}>
        {requirements.map((req) => {
          const isSelected = selectedId === req.id;
          return (
            <button
              key={req.id}
              type="button"
              role="option"
              aria-selected={isSelected}
              className={`${styles.tile} ${isSelected ? styles.selected : ''}`}
              onClick={() => onSelectRequirement(req)}
              title={`${req.clause}: ${req.title} (${req.status})`}
            >
              <span className={styles.clauseNumber}>{req.clause}</span>
              <div className={styles.tileShape}>
                <StatusBadge status={req.status} showWord={false} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
