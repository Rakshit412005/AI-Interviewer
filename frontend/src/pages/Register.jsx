import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { register, reset } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const { name, email, password, password2 } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
    if (isSuccess) {
      toast.success('User Registered Successfully');
      navigate('/');
      dispatch(reset());
    }
    if (user && !isSuccess) {
      navigate('/');
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
    if (password !== password2) {
      toast.error('Passwords do not match');
    } else {
      const userData = {
        name,
        email,
        password,
      };
      dispatch(register(userData));
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[80vh] gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-500 border-t-transparent" />
        <p className="text-content-muted text-sm font-semibold">Creating your account...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] px-4 py-12 relative overflow-hidden">
      {/* Ambient Lighting */}
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
            Create <span className="text-emerald-600 dark:text-emerald-400">Account</span>
          </h1>
          <p className="text-content-muted mt-1.5 text-xs sm:text-sm font-medium">
            Join engineers practicing real-time AI technical interviews
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-content-secondary ml-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={name}
              className="w-full p-3.5 bg-surface-input border-2 border-line-strong rounded-xl text-sm font-semibold text-content-primary focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-content-subtle"
              placeholder="Alex Chen"
              onChange={onChange}
              required
            />
          </div>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-content-secondary ml-1">
                Confirm
              </label>
              <input
                type="password"
                name="password2"
                value={password2}
                className="w-full p-3.5 bg-surface-input border-2 border-line-strong rounded-xl text-sm font-semibold text-content-primary focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-content-subtle"
                placeholder="••••••••••••"
                onChange={onChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-3 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-xl font-bold text-sm shadow-sm transition-all duration-150 active:scale-95 focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            Create Candidate Account
          </button>
        </form>

        <p className="mt-7 text-center text-xs text-content-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline ml-0.5">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
