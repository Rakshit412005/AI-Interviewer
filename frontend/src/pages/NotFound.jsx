import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="text-center p-8 sm:p-12 bg-surface rounded-2xl shadow-card-elevated max-w-lg mx-auto mt-12 border-2 border-line-subtle animate-in fade-in duration-200">
      <h1 className="text-8xl sm:text-9xl font-black text-line-subtle dark:text-emerald-500/20 font-heading select-none">404</h1>
      <h2 className="text-2xl font-black text-content-primary mt-4 font-heading tracking-tight">Page Not Found</h2>
      <p className="text-content-muted mt-2 mb-8 text-sm">The interview module or session you're looking for doesn't exist.</p>
      <Link to="/" className="bg-emerald-600 hover:bg-emerald-500 text-white px-7 py-3 rounded-xl font-bold text-sm shadow-sm transition-all duration-150 inline-flex items-center gap-2 active:scale-95">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Dashboard</span>
      </Link>
    </div>
  )
}

export default NotFound
