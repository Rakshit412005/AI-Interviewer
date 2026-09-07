import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout, reset } from "../features/auth/authSlice"
import { useTheme } from "../context/ThemeContext"

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  }

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-nav transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* --- Brand Identity: Restored Original Logo Asset & Treatment --- */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0 select-none">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm p-1.5 flex items-center justify-center text-slate-950 group-hover:scale-105 group-hover:rotate-6 transition-all duration-300">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>

            <span className="font-heading font-black text-lg sm:text-xl tracking-tight text-content-main leading-tight group-hover:text-emerald-500 transition-colors">
              AI <span className="text-emerald-500 font-extrabold">INT</span><span className="hidden sm:inline">erviewer</span>
            </span>
          </Link>

          {/* --- Desktop Navigation (Clean SaaS Style) --- */}
          <nav className="hidden md:flex items-center gap-1.5">
            {user ? (
              <>
                <Link
                  to="/"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive('/')
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 font-semibold'
                      : 'text-content-muted hover:text-content-main hover:bg-surface-elevated'
                  }`}
                >
                  Dashboard
                </Link>

                <Link
                  to="/profile"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive('/profile')
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 font-semibold'
                      : 'text-content-muted hover:text-content-main hover:bg-surface-elevated'
                  }`}
                >
                  Profile
                </Link>

                <div className="h-4 w-px bg-line-subtle mx-2" />

                {/* Candidate Status Chip */}
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-surface-inset border border-line-subtle text-xs font-semibold text-content-main">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20 animate-pulse" />
                  <span className="truncate max-w-[120px]">{user.name.split(' ')[0]}</span>
                </div>

                {/* Minimal Tactile Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  type="button"
                  aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
                  title={isDark ? "Switch to light theme" : "Switch to dark theme"}
                  className="p-2 rounded-lg border border-line-subtle bg-surface-elevated text-content-muted hover:text-content-main hover:border-line-active transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 ml-1"
                >
                  {isDark ? (
                    <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-emerald-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>

                {/* Logout Action */}
                <button
                  onClick={onLogout}
                  type="button"
                  className="text-xs font-semibold uppercase tracking-wider text-content-muted hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-500/10 px-3 py-1.5 rounded-lg transition-colors ml-1"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive('/login')
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 font-semibold'
                      : 'text-content-muted hover:text-content-main hover:bg-surface-elevated'
                  }`}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-all duration-150 active:scale-95"
                >
                  Register
                </Link>

                {/* Theme Toggle for Guests */}
                <button
                  onClick={toggleTheme}
                  type="button"
                  aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
                  title={isDark ? "Switch to light theme" : "Switch to dark theme"}
                  className="p-2 rounded-lg border border-line-subtle bg-surface-elevated text-content-muted hover:text-content-main hover:border-line-active transition-all focus-visible:ring-2 focus-visible:ring-emerald-500 ml-1"
                >
                  {isDark ? (
                    <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-emerald-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
              </div>
            )}
          </nav>

          {/* --- Mobile Controls (Theme Toggle + Hamburger) --- */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={toggleTheme}
              type="button"
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
              className="p-2 rounded-lg border border-line-subtle bg-surface-elevated text-content-muted"
            >
              {isDark ? (
                <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-emerald-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              aria-label="Toggle navigation menu"
              className="p-2 rounded-lg border border-line-subtle bg-surface-elevated text-content-muted hover:text-content-main transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* --- Mobile Drawer --- */}
      {isMenuOpen && (
        <div className="md:hidden glass-nav border-t border-line-subtle animate-in slide-in-from-top-1 duration-150">
          <div className="px-5 py-4 space-y-2">
            {user ? (
              <>
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-inset border border-line-subtle mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-content-main uppercase tracking-wider">{user.name}</span>
                </div>

                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/') ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 font-semibold' : 'text-content-muted'
                  }`}
                >
                  Dashboard
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/profile') ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 font-semibold' : 'text-content-muted'
                  }`}
                >
                  Profile
                </Link>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onLogout();
                  }}
                  type="button"
                  className="w-full mt-3 py-2 px-3 rounded-lg font-semibold text-xs uppercase tracking-wider text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 transition-colors text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/login') ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 font-semibold' : 'text-content-muted'
                  }`}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/register') ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 font-semibold' : 'text-content-muted'
                  }`}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header

