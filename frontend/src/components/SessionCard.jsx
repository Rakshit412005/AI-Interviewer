import React from 'react';

// Unified Professional SVG Technical Icon Library
const getRoleIcon = (role = '') => {
  const r = role.toLowerCase();

  // 1. Frontend / React / MERN / MEAN
  if (r.includes('react') || r.includes('mern') || r.includes('mean') || r.includes('frontend')) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    );
  }
  // 2. Data / AI / Machine Learning
  if (r.includes('data') || r.includes('machine') || r.includes('ai') || r.includes('learning')) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    );
  }
  // 3. DevOps / Cloud / SRE
  if (r.includes('devops') || r.includes('cloud') || r.includes('sre')) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    );
  }
  // 4. Cybersecurity / Security
  if (r.includes('security') || r.includes('cyber')) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    );
  }
  // 5. Blockchain / Web3
  if (r.includes('blockchain') || r.includes('web3')) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    );
  }
  // 6. Mobile
  if (r.includes('mobile') || r.includes('ios') || r.includes('android')) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    );
  }
  // 7. UI/UX Designer
  if (r.includes('ui') || r.includes('ux') || r.includes('designer')) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    );
  }
  // 8. QA Automation
  if (r.includes('qa') || r.includes('test')) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    );
  }
  // 9. Product Manager
  if (r.includes('product') || r.includes('manager')) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  }
  // 10. Python / Java / Backend
  if (r.includes('python') || r.includes('java') || r.includes('backend')) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    );
  }
  // Default: Code Workspace
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
};

const SessionCard = ({ session, onClick, onDelete }) => {
  const isDeletable = session.status !== 'pending';

  const statusConfig = {
    completed: {
      badge: 'bg-badge-success-bg text-badge-success-text border-emerald-500/20',
      label: 'Completed',
    },
    'in-progress': {
      badge: 'bg-badge-warning-bg text-badge-warning-text border-amber-500/20',
      label: 'In Progress',
    },
    pending: {
      badge: 'bg-badge-info-bg text-badge-info-text border-blue-500/20',
      label: 'Pending',
    },
  }[session.status] || {
    badge: 'bg-surface-inset text-content-muted border-line-subtle',
    label: session.status,
  };

  const scoreDisplay = session.status === 'completed'
    ? session.overallScore != null ? `${session.overallScore}%` : '--'
    : '--';

  const scoreTextColor = session.status === 'completed'
    ? (session.overallScore >= 75 ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400')
    : 'text-content-subtle';

  return (
    <div
      onClick={() => onClick(session)}
      className="group bg-surface border-2 border-line-subtle hover:border-line-active p-5 sm:p-6 rounded-2xl flex flex-col md:flex-row items-center gap-4 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.99] cursor-pointer"
    >
      {/* Domain Identity & Details */}
      <div className="flex items-center gap-4 w-full md:w-auto flex-grow min-w-0">
        <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center transition-colors group-hover:bg-emerald-500/15">
          {getRoleIcon(session.role)}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-content-primary text-base sm:text-lg truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {session.role}
          </h3>
          <div className="flex items-center gap-2 text-xs text-content-muted mt-1">
            <span>{new Date(session.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span className="text-content-subtle">•</span>
            <span className="bg-surface-inset text-content-secondary font-semibold px-2 py-0.5 rounded-md text-[11px] border border-line-strong">
              {session.level}
            </span>
          </div>
        </div>
      </div>

      {/* Score & Status Metrics */}
      <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 border-line-subtle pt-3 md:pt-0">
        <div className="text-left md:text-center shrink-0">
          <p className="text-[10px] font-bold text-content-muted uppercase tracking-wider">Overall Score</p>
          <p className={`text-xl sm:text-2xl font-black ${scoreTextColor} leading-none mt-1`}>
            {scoreDisplay}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusConfig.badge}`}>
            {statusConfig.label}
          </span>
          <span className="text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            {session.status === 'completed' ? 'Review Report' : 'Resume'}
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden md:block w-px h-8 bg-line-subtle mx-1" />

      {/* Delete Action */}
      {isDeletable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(e, session._id);
          }}
          className="p-2 text-content-subtle hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors self-end md:self-center"
          title="Delete Session"
          aria-label="Delete Session"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SessionCard;
