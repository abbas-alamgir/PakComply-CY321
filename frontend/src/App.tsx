import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Role } from './types';
import { Sidebar } from './components/Sidebar';
import { AssessmentView } from './views/AssessmentView';
import { GapsView } from './views/GapsView';
import { EvidenceView } from './views/EvidenceView';
import { ReportsView } from './views/ReportsView';
import styles from './App.module.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const App: React.FC = () => {
  const { t } = useTranslation();
  const [currentRole, setCurrentRole] = useState<Role>('admin');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className={styles.layout}>
          {/* Left Sidebar */}
          <Sidebar
            currentRole={currentRole}
            onRoleChange={setCurrentRole}
            orgName="Indus Logistics Pvt Ltd"
          />

          {/* Main Area */}
          <main className={styles.mainContent}>
            {isOffline && (
              <div className={styles.offlineBanner} role="alert">
                {t('error.offlineMessage', 'You are currently offline. Check your internet connection and retry.')}
              </div>
            )}

            <Routes>
              <Route path="/" element={<AssessmentView currentRole={currentRole} />} />
              <Route path="/gaps" element={<GapsView />} />
              <Route path="/evidence" element={<EvidenceView currentRole={currentRole} />} />
              <Route path="/reports" element={<ReportsView currentRole={currentRole} />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
