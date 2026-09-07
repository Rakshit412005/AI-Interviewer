import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login, googleLogin, reset } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }

    if (isSuccess || user) {
      navigate('/');
      dispatch(reset());
    }
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = {
      email,
      password,
    };
    dispatch(login(userData));
  };

  const handleGoogleSuccess = (credentialResponse) => {
    if (credentialResponse.credential) {
      dispatch(googleLogin(credentialResponse.credential));
    } else {
      toast.error('Something went wrong. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[80vh] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-500 border-t-transparent" />
        <p className="text-content-muted text-sm font-semibold">Authenticating...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] px-4 py-12 relative overflow-hidden">
      {/* Subtle Ambient Radial Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-surface border-2 border-line-subtle rounded-2xl shadow-card-elevated p-8 sm:p-10 relative z-10 animate-in fade-in duration-300 overflow-hidden">
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500" />

        {/* Brand Header */}
        <div className="text-center mb-8 pt-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-2 shadow-sm text-slate-950 mb-3">
            <svg
              className="w-7 h-7"
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-content-primary font-heading tracking-tight">
            Welcome <span className="text-emerald-600 dark:text-emerald-400">Back</span>
          </h1>
          <p className="text-content-muted mt-1.5 text-xs sm:text-sm font-medium">
            Sign in to continue your technical interview preparation
          </p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-content-secondary ml-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              className="w-full p-3.5 bg-surface-input border-2 border-line-strong rounded-xl text-sm font-semibold text-content-primary focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-content-subtle"
              placeholder="candidate@company.com"
              onChange={onChange}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-content-secondary ml-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              className="w-full p-3.5 bg-surface-input border-2 border-line-strong rounded-xl text-sm font-semibold text-content-primary focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-content-subtle"
              placeholder="••••••••••••"
              onChange={onChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-xl font-bold text-sm shadow-sm transition-all duration-150 active:scale-95 focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            Sign In to Workspace
          </button>
        </form>

        {/* Social Auth Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-grow border-t-2 border-line-subtle" />
          <span className="text-content-subtle text-[10px] font-bold tracking-widest uppercase">
            Or Continue With
          </span>
          <div className="flex-grow border-t-2 border-line-subtle" />
        </div>

        {/* Google Authentication */}
        <div className="w-full flex items-center justify-center p-1 rounded-xl border-2 border-line-subtle bg-surface-elevated">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Google login failed')}
            theme="outline"
            size="large"
            width="100%"
            text="continue_with"
            shape="rectangular"
          />
        </div>

        {/* Footer Navigation */}
        <p className="mt-7 text-center text-xs text-content-muted">
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline ml-0.5">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
