import React, { useEffect } from 'react';

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-[3px] transition-opacity animate-in fade-in duration-150"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
    >
      {/* Solid Elevated Dialog Box (Not Transparent Glass) */}
      <div
        className="relative w-full max-w-md bg-white dark:bg-[#152422] border border-slate-200 dark:border-emerald-500/25 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] p-6 sm:p-7 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Solid Top Accent Bar */}
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
            <h3 className="text-xl font-bold text-slate-900 dark:text-[#f0fdf4] font-heading leading-snug">
              {title}
            </h3>
            <p className="mt-2 text-sm text-slate-700 dark:text-[#a3bfb2] leading-relaxed font-medium">
              {description}
            </p>
          </div>
        </div>

        {/* Buttons with Clear Visual Hierarchy */}
        <div className="mt-7 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-line-subtle pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-[#1c2e2b] dark:hover:bg-[#253d39] border border-slate-200 dark:border-line-subtle transition-all duration-150"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all duration-150 active:scale-95 ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-500 focus-visible:ring-2 focus-visible:ring-rose-500'
                : 'bg-emerald-600 hover:bg-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500'
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
