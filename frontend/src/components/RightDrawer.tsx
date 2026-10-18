import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useTranslation } from 'react-i18next';
import styles from './RightDrawer.module.css';

interface RightDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}

export const RightDrawer: React.FC<RightDrawerProps> = ({
  open,
  onOpenChange,
  title,
  children,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content} aria-describedby={undefined}>
          <div className={styles.header}>
            <Dialog.Title className={styles.title}>{title}</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className={styles.closeButton}
                aria-label={t('common.close', 'Close')}
              >
                {t('common.close', 'Close')}
              </button>
            </Dialog.Close>
          </div>
          <div className={styles.body}>{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
