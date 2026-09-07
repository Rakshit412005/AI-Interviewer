import React, { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const ConfirmModal = ({
  isOpen,
  title = "Confirm Action",
  description = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Return / Cancel",
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  const { isDark } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* 1. Backdrop Dimming Overlay (Translucent Dimming, Never Glass/Blurred) */}
      <div
        className="fixed inset-0 bg-black/45 dark:bg-black/70 transition-opacity"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* 2. Solid, Completely Opaque Dialog Card (Zero Transparency, Real Elevation) */}
      <div
        className="relative w-full max-w-md bg-surface border-2 border-line-subtle dark:border-line-strong rounded-2xl shadow-2xl p-6 sm:p-7 overflow-hidden z-10"
        style={{ backgroundColor: isDark ? '#132421' : '#ffffff', opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Strip */}
        <div
          className={`absolute top-0 left-0 right-0 h-1.5 ${
            isDestructive ? 'bg-rose-500' : 'bg-emerald-500'
          }`}
        />

        <div className="flex items-start gap-4 pt-1">
          {/* Status Icon Badge */}
          <div
            className={`w-11 h-11 rounded-xl shrink-0 flex items-center justify-center ${
              isDestructive
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
            }`}
          >
            {isDestructive ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-extrabold text-content-primary font-heading leading-snug">
              {title}
            </h3>
            <p className="mt-2 text-sm text-content-muted leading-relaxed font-medium">
              {description}
            </p>
          </div>
        </div>

        {/* Buttons with Clear SaaS Visual Hierarchy */}
        <div className="mt-7 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 border-t-2 border-line-subtle pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-content-secondary hover:text-content-primary bg-surface-inset hover:bg-surface-hover border-2 border-line-subtle hover:border-line-strong transition-all active:scale-95 text-center"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-md shadow-emerald-900/20 hover:shadow-emerald-900/30 transition-all active:scale-95 focus-visible:ring-2 text-center ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-500 focus-visible:ring-rose-500'
                : 'bg-emerald-600 hover:bg-emerald-500 focus-visible:ring-emerald-500'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
