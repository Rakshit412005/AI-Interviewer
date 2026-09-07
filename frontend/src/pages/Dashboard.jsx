import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createSession,
  getSessions,
  reset,
  deleteSession,
} from "../features/sessions/sessionSlice";
import { toast } from "react-toastify";
import SessionCard from "../components/SessionCard";
import ConfirmModal from "../components/ConfirmModal";

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
  "Software Development Engineer (SDE)",
];
const LEVELS = ["Junior", "Mid-Level", "Senior"];
const TYPES = [
  { label: "Oral only", value: "oral-only" },
  { label: "Coding Mix", value: "coding-mix" },
];
const COUNTS = [5, 10, 15];

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { sessions, isLoading, isGenerating, isError, message } = useSelector(
    (state) => state.sessions,
  );
  const isProcessing = isGenerating;
  const AI_SERVICE_URL =
    import.meta.env.VITE_AI_SERVICE_URL ||
    "https://ai-interviewer-153k.onrender.com";

  const [aiReady, setAiReady] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const aiWakeStartedRef = useRef(false);

  // In-App Modal State for Deletion
  const [sessionToDelete, setSessionToDelete] = useState(null);

  const [formData, setFormData] = useState({
    role: user?.preferredRole || ROLES[0],
    level: LEVELS[0],
    interviewType: TYPES[1].value,
    count: COUNTS[0],
  });

  useEffect(() => {
    dispatch(getSessions());
  }, [dispatch]);

  useEffect(() => {
    if (isError && message) {
      toast.error(message);
      dispatch(reset());
    }
  }, [isError, message, dispatch]);

  useEffect(() => {
    if (!user?._id || aiWakeStartedRef.current) return;

    aiWakeStartedRef.current = true;
    wakeAIService();
  }, [user?._id]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(createSession(formData));
  };

  const wakeAIService = async () => {
    try {
      setAiLoading(true);
      toast.info("Starting AI services... Please wait, It can take about a minute.", { autoClose: 5000 });

      const response = await fetch(`${AI_SERVICE_URL}/healthz`, {
        method: "GET",
      });

      if (response.ok) {
        setAiReady(true);
        toast.success("AI services are ready. You can start the interview.", { autoClose: 5000 });
      } else {
        toast.error("AI services could not be started right now.", { autoClose: 5000 });
      }
    } catch (error) {
      console.error("AI wakeup failed:", error);
      toast.error("AI services are still waking up. Try again in a moment.", { autoClose: 5000 });
    } finally {
      setAiLoading(false);
    }
  };

  const viewSession = (session) => {
    if (session.status === "completed") {
      navigate(`/review/${session._id}`);
    } else if (session.status === "in-progress") {
      navigate(`/interview/${session._id}`);
    } else {
      toast.info("Session not ready yet");
    }
  };

  const requestDelete = (e, sessionId) => {
    e.stopPropagation();
    setSessionToDelete(sessionId);
  };

  const confirmDelete = () => {
    if (sessionToDelete) {
      dispatch(deleteSession(sessionToDelete));
      toast.error("Session Deleted");
      setSessionToDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-10 animate-in fade-in duration-300">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line-subtle pb-6 sm:pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Interview Simulation Workspace
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-content-main tracking-tight font-heading">
            Welcome, <span className="text-emerald-600 dark:text-emerald-400">{user?.name?.split(" ")[0]}</span>
          </h1>
          <p className="text-content-muted mt-1 text-sm sm:text-base font-normal">
            Configure realistic technical interviews with adaptive AI evaluations.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-surface-elevated px-4 py-2.5 rounded-2xl border border-line-subtle shadow-sm-subtle flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] text-content-subtle font-bold uppercase tracking-wider">
                Total Sessions
              </p>
              <p className="text-xl sm:text-2xl font-black text-content-main leading-none mt-0.5">
                {sessions.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* New Interview Configuration Card */}
      <div className="bg-surface-card rounded-2xl border border-line-subtle shadow-sm-subtle overflow-hidden">
        
        {/* Header Bar with PROMINENT AI Service Status Indicator */}
        <div className="px-6 py-4 border-b border-line-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-elevated">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h2 className="text-base font-bold text-content-main font-heading">
              New Interview Configuration
            </h2>
          </div>

          {/* Prominent, High-Contrast AI Service Status */}
          <div>
            {aiReady ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-xs font-black tracking-wider uppercase font-mono">
                  AI Engine Online & Ready
                </span>
              </div>
            ) : aiLoading ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-800 dark:text-amber-200 shadow-sm animate-pulse">
                <span className="animate-spin h-3 w-3 border-2 border-amber-600 dark:border-amber-400 border-t-transparent rounded-full" />
                <span className="text-xs font-bold tracking-wider uppercase font-mono">
                  Connecting to AI Engine (Render)...
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-inset border border-line-subtle text-content-muted shadow-sm">
                <span className="h-2 w-2 rounded-full bg-content-subtle" />
                <span className="text-xs font-semibold tracking-wider uppercase font-mono">
                  AI Engine Standby
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Configuration Form Controls with Custom Dropdown Chevrons and Strong Contrast */}
        <form
          onSubmit={onSubmit}
          className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 items-end"
        >
          {/* Target Role */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-content-main uppercase tracking-wider ml-1">
              Target Role
            </label>
            <div className="relative">
              <select
                name="role"
                value={formData.role}
                onChange={onChange}
                className="custom-select appearance-none w-full rounded-xl pr-10 pl-3.5 py-3 text-sm font-semibold border border-line-subtle focus:border-line-active focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all cursor-pointer"
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-content-muted">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:contents">
            {/* Seniority Level */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-content-main uppercase tracking-wider ml-1">
                Seniority Level
              </label>
              <div className="relative">
                <select
                  name="level"
                  value={formData.level}
                  onChange={onChange}
                  className="custom-select appearance-none w-full rounded-xl pr-10 pl-3.5 py-3 text-sm font-semibold border border-line-subtle focus:border-line-active focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all cursor-pointer"
                >
                  {LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-content-muted">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Question Count */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-content-main uppercase tracking-wider ml-1">
                Question Count
              </label>
              <div className="relative">
                <select
                  name="count"
                  value={formData.count}
                  onChange={onChange}
                  className="custom-select appearance-none w-full rounded-xl pr-10 pl-3.5 py-3 text-sm font-semibold border border-line-subtle focus:border-line-active focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all cursor-pointer"
                >
                  {COUNTS.map((count) => (
                    <option key={count} value={count}>
                      {count} Questions
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-content-muted">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Interview Format */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-content-main uppercase tracking-wider ml-1">
              Interview Format
            </label>
            <div className="relative">
              <select
                name="interviewType"
                value={formData.interviewType}
                onChange={onChange}
                className="custom-select appearance-none w-full rounded-xl pr-10 pl-3.5 py-3 text-sm font-semibold border border-line-subtle focus:border-line-active focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all cursor-pointer"
              >
                {TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-content-muted">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Start Interview CTA */}
          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full h-[46px] rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-sm transition-all duration-150 active:scale-95 ${
              isProcessing
                ? "bg-surface-hover text-content-muted cursor-wait"
                : "bg-emerald-600 hover:bg-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500"
            }`}
          >
            {isProcessing ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                <span className="text-sm">Preparing Session...</span>
              </>
            ) : (
              <span className="text-sm flex items-center gap-2">
                <span>Start Interview</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            )}
          </button>
        </form>
      </div>

      {/* History List Section */}
      <div className="space-y-5 pb-16 sm:pb-8">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg sm:text-xl font-bold text-content-main font-heading flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-line-subtle flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            Interview History
          </h2>
          <span className="text-xs font-semibold text-content-muted">
            {sessions.length} recorded {sessions.length === 1 ? "session" : "sessions"}
          </span>
        </div>

        {isLoading && sessions.length === 0 ? (
          <div className="flex items-center justify-center py-20 bg-surface-card border border-line-subtle rounded-2xl">
            <div className="animate-spin h-10 w-10 border-2 border-emerald-500 border-t-transparent rounded-full" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="bg-surface-card border-2 border-dashed border-line-subtle rounded-2xl py-16 sm:py-20 text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-surface-inset text-content-muted flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-content-main font-bold text-base">No interview sessions recorded yet</p>
            <p className="text-content-muted text-sm mt-1 max-w-sm mx-auto">
              Configure your desired role and question length above to start your first technical interview practice.
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {sessions.map((session) => (
              <SessionCard
                key={session._id}
                session={session}
                onClick={viewSession}
                onDelete={requestDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* In-App Confirmation Modal for Session Deletion */}
      <ConfirmModal
        isOpen={Boolean(sessionToDelete)}
        title="Delete Interview Session"
        description="Are you sure you want to permanently delete this interview session? This action cannot be undone."
        confirmText="Delete Session"
        cancelText="Keep Session"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setSessionToDelete(null)}
      />
    </div>
  );
};

export default Dashboard;
