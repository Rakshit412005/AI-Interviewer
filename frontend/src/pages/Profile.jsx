import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { updateProfile, reset } from '../features/auth/authSlice';

const ROLES = [
  "MERN Stack Developer",
  "MEAN Stack Developer",
  "Full Stack Python",
  "Full Stack Java",
  "Frontend Developer",
  "Backend Developer",
  "Data Scientist",
  "Data Analyst",
  "Machine Learning Engineer",
  "DevOps Engineer",
  "Cloud Engineer (AWS/Azure/GCP)",
  "Cybersecurity Engineer",
  "Blockchain Developer",
  "Mobile Developer (iOS/Android)",
  "Game Developer",
  "UI/UX Designer",
  "QA Automation Engineer",
  "Product Manager",
  "Software Development Engineer (SDE)"
];

const inputBase = 'w-full bg-surface-inset border border-line-subtle rounded-xl p-3.5 text-sm font-semibold text-content-main transition-all focus:border-line-active focus:ring-2 focus:ring-emerald-500/20 outline-none';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, isSuccess, isError, message, isProfileLoading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    preferredRole: user?.preferredRole || '',
  });

  useEffect(() => {
    if (!isError && !isSuccess) return;
    if (isError) toast.error(message);
    if (isSuccess) toast.success('Profile Updated Successfully');
    dispatch(reset());
  }, [isError, isSuccess, message, dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        preferredRole: user?.preferredRole || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name === user.name && formData.preferredRole === user.preferredRole) {
      toast.info('No changes to save.');
      return;
    }
    dispatch(updateProfile(formData));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-24 animate-in fade-in duration-300">
      <div className="bg-surface-card rounded-2xl border border-line-subtle shadow-card-elevated p-6 sm:p-10">
        <header className="mb-8 border-b border-line-subtle pb-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Candidate Credentials
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-content-main font-heading tracking-tight">
            Candidate Profile
          </h1>
          <p className="text-sm text-content-muted mt-1">
            Update your professional details and primary target technical role.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField label="Full Name">
            <input
              type="text"
              className={inputBase}
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </FormField>

          <FormField label="Email Address (Fixed)" muted>
            <input
              type="email"
              className="w-full bg-surface-inset/60 border border-line-subtle rounded-xl p-3.5 text-sm font-medium text-content-subtle cursor-not-allowed"
              disabled
              value={formData.email}
              onChange={handleChange}
            />
          </FormField>

          <FormField label="Primary Target Role">
            <div className="relative">
              <select
                name="preferredRole"
                value={formData.preferredRole}
                onChange={handleChange}
                className={`${inputBase} appearance-none pr-10 [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-[#142321] dark:[&>option]:text-white`}
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <SelectArrow />
            </div>
          </FormField>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isProfileLoading}
              className={`w-full flex items-center justify-center gap-2 py-3.5 font-bold text-sm rounded-xl transition-all active:scale-[0.98] ${
                isProfileLoading
                  ? 'bg-surface-hover text-content-muted cursor-wait'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500'
              }`}
            >
              {isProfileLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;

function FormField({ label, children, muted }) {
  return (
    <div className={`space-y-1.5 ${muted ? 'opacity-70' : ''}`}>
      <label className="ml-1 text-[10px] font-bold text-content-muted uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}

function SelectArrow() {
  return (
    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-content-subtle">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}