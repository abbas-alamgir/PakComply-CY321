import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Role } from '../types';
import styles from './Sidebar.module.css';

interface SidebarProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  orgName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  onRoleChange,
  orgName = 'Indus Logistics Pvt Ltd',
}) => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'ur' : 'en';
    i18n.changeLanguage(nextLang);
  };

  return (
    <aside className={styles.sidebar} aria-label={t('app.title', 'PakComply')}>
      <div className={styles.brand}>
        <h1 className={styles.title}>{t('app.title', 'PakComply')}</h1>
        <p className={styles.orgName}>{orgName}</p>
      </div>

      <nav className={styles.nav} aria-label="Main Navigation">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ''}`
          }
          end
        >
          {t('nav.assessment', 'Assessment checklist')}
        </NavLink>

        <NavLink
          to="/gaps"
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ''}`
          }
        >
          {t('nav.gaps', 'Gaps & tasks')}
        </NavLink>

        <NavLink
          to="/evidence"
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ''}`
          }
        >
          {t('nav.evidence', 'Evidence vault')}
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ''}`
          }
        >
          {t('nav.reports', 'Reports')}
        </NavLink>
      </nav>

      <div className={styles.footer}>
        <div className={styles.controlGroup}>
          <label htmlFor="role-select" className={styles.controlLabel}>
            {t('common.role', 'Role')}
          </label>
          <select
            id="role-select"
            className={styles.select}
            value={currentRole}
            onChange={(e) => onRoleChange(e.target.value as Role)}
          >
            <option value="admin">Compliance Lead (Admin)</option>
            <option value="reviewer">Auditor (Reviewer - Read only)</option>
            <option value="viewer">IT Staff (Viewer)</option>
          </select>
        </div>

        <div className={styles.controlGroup}>
          <button
            type="button"
            className={styles.langBtn}
            onClick={toggleLanguage}
            aria-label="Toggle language between English and Urdu"
          >
            {i18n.language === 'en' ? 'اردو میں دیکھیں (Urdu)' : 'Switch to English'}
          </button>
        </div>
      </div>
    </aside>
  );
};
