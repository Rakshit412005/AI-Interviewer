import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getSessionById } from '../features/sessions/sessionSlice';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const formatDuration = (start, end) => {
  if (!start || !end) return 'N/A';
  const diff = new Date(end) - new Date(start);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ${seconds % 60}s`;
};

const sanitizeQuestionText = (text) => {
  return text.replace(/^\d+[\s\.\)]+/, '').trim();
};

const formatIdealAnswer = (text) => {
  try {
    if (!text) return "Pending evaluation.";

    let cleanText = text.trim();

    // 1. Remove Markdown code blocks if the AI added them (e.g., ```json ... ```)
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```(json)?/, '').replace(/```$/, '').trim();
    }

    // 2. Check if it's a JSON object
    if (cleanText.startsWith('{') && cleanText.endsWith('}')) {
      const parsed = JSON.parse(cleanText);

      if (parsed.verbalAnswer || parsed.idealAnswer || parsed.idealanswer) {
        return parsed.verbalAnswer || parsed.idealAnswer || parsed.idealanswer;
      }

      const explanation = parsed.explanation || parsed.understanding || "";
      const code = parsed.code || parsed.codeExample || parsed.example || "";

      if (explanation || code) {
        return `${explanation}\n\n${code}`.trim();
      }
    }

    return text;
  } catch {
    return text;
  }
};

function SessionReview() {
  const { sessionId } = useParams();
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const { activeSession, isLoading } = useSelector(state => state.sessions);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    dispatch(getSessionById(sessionId));
  }, [dispatch, sessionId]);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Ideal implementation copied to clipboard");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="animate-spin h-10 w-10 border-2 border-emerald-500 border-t-transparent rounded-full" />
        <p className="text-content-muted text-sm font-semibold uppercase tracking-wider">
          Generating Comprehensive Analysis...
        </p>
      </div>
    );
  }

  if (!activeSession || activeSession.status !== 'completed') {
    return (
      <div className="max-w-lg mx-auto mt-12 sm:mt-20 p-8 bg-surface-card border border-line-subtle rounded-2xl shadow-card-elevated text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-content-main font-heading mb-2">Report In Progress</h2>
        <p className="text-content-muted text-sm mb-6 leading-relaxed">
          This session is still being evaluated by the AI scoring system. Please check back shortly.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all duration-150 active:scale-95"
        >
          <span>Return to Dashboard</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    );
  }

  const { overallScore, metrics, role, level, questions, startTime, endTime } = activeSession;
  const finalMetrics = metrics || {};

  const barData = {
    labels: questions.map((_, i) => `Q${i + 1}`),
    datasets: [{
      label: 'Technical Score',
      data: questions.map(q => q.technicalScore || 0),
      backgroundColor: questions.map(q => (q.technicalScore || 0) >= 70 ? '#10b981' : '#f59e0b'),
      borderRadius: 6,
    }],
  };

  const chartTextColor = isDark ? '#9ab3a7' : '#2f4f40';
  const chartGridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.07)';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-10 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-line-subtle pb-6 sm:pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Interview Evaluation Completed
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-content-main tracking-tight font-heading">
            {role} <span className="text-content-muted font-normal text-lg sm:text-2xl">({level})</span>
          </h1>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-content-main hover:text-emerald-600 dark:hover:text-emerald-400 bg-surface-elevated hover:bg-surface-hover border border-line-subtle transition-all duration-150 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Summary Score Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Overall Score', value: `${overallScore}%`, isPrimary: true, hint: 'Aggregated evaluation' },
          { label: 'Avg Technical', value: `${finalMetrics.avgTechnical || 0}%`, isPrimary: false, hint: 'Code & concepts' },
          { label: 'Avg Confidence', value: `${finalMetrics.avgConfidence || 0}%`, isPrimary: false, hint: 'Speech articulation' },
          { label: 'Session Duration', value: formatDuration(startTime, endTime), isPrimary: false, hint: 'Start to completion' },
        ].map((stat, i) => (
          <div
            key={i}
            className={`bg-surface-card border p-5 sm:p-6 rounded-2xl shadow-sm-subtle relative overflow-hidden ${
              stat.isPrimary
                ? 'border-emerald-500/40 bg-gradient-to-b from-emerald-500/10 to-transparent'
                : 'border-line-subtle'
            }`}
          >
            {stat.isPrimary && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
            )}
            <p className="text-[10px] font-bold text-content-muted uppercase tracking-wider">{stat.label}</p>
            <p className={`text-2xl sm:text-3xl font-black mt-2 leading-none font-heading ${
              stat.isPrimary ? 'text-emerald-600 dark:text-emerald-400' : 'text-content-main'
            }`}>
              {stat.value}
            </p>
            <p className="text-[11px] text-content-muted mt-2 font-medium">{stat.hint}</p>
          </div>
        ))}
      </div>

      {/* Chart Visualization */}
      <div className="bg-surface-card border border-line-subtle p-6 sm:p-8 rounded-2xl shadow-sm-subtle">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h3 className="text-sm font-bold text-content-main uppercase tracking-wider font-heading">
              Per-Question Technical Score Breakdown
            </h3>
          </div>
          <span className="text-xs font-semibold text-content-muted">Target Benchmark: 70%+</span>
        </div>

        <div className="h-60 sm:h-72">
          <Bar
            data={barData}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  backgroundColor: isDark ? '#152422' : '#ffffff',
                  titleColor: isDark ? '#f0fdf4' : '#0b2017',
                  bodyColor: isDark ? '#a3bfb2' : '#2f4f40',
                  borderColor: isDark ? 'rgba(20, 184, 166, 0.3)' : 'rgba(6, 78, 59, 0.2)',
                  borderWidth: 1,
                  padding: 10,
                  displayColors: false,
                  callbacks: {
                    label: (context) => `Technical Score: ${context.parsed.y}%`,
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  ticks: { color: chartTextColor, font: { size: 11, weight: 'bold' } },
                  grid: { color: chartGridColor },
                },
                x: {
                  ticks: { color: chartTextColor, font: { size: 11, weight: 'bold' } },
                  grid: { display: false },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Detailed Per-Question Analysis */}
      <div className="space-y-6 sm:space-y-8">
        <div className="flex items-center gap-2.5 px-1">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-content-main font-heading">
            Detailed Question Review & Intelligence
          </h3>
        </div>

        <div className="space-y-6">
          {questions.map((q, index) => (
            <div
              key={index}
              className="bg-surface-card border border-line-subtle rounded-2xl shadow-sm-subtle overflow-hidden p-6 sm:p-8 space-y-6"
            >
              {/* Question Header & Scores */}
              <div className="flex flex-col lg:flex-row justify-between items-start gap-4 border-b border-line-subtle pb-4">
                <div className="flex items-start gap-3 flex-1">
                  <span className="shrink-0 w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center mt-0.5">
                    Q{index + 1}
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-content-main leading-snug font-heading">
                    {sanitizeQuestionText(q.questionText)}
                  </h4>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase text-content-muted">Technical</span>
                    <span className="text-xs font-black text-emerald-700 dark:text-emerald-300">{q.technicalScore || 0}%</span>
                  </div>
                  <div className="px-3 py-1 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase text-content-muted">Confidence</span>
                    <span className="text-xs font-black text-blue-700 dark:text-blue-300">{q.confidenceScore || 0}%</span>
                  </div>
                </div>
              </div>

              {/* Candidate Submission Display */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-content-muted uppercase tracking-wider block">
                  Your Response
                </span>
                <div className="bg-surface-inset border border-line-subtle rounded-xl overflow-hidden divide-y divide-line-subtle">
                  {/* Code */}
                  {q.userSubmittedCode && q.userSubmittedCode !== "undefined" && (
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2 text-xs font-bold text-content-main">
                        <span>Code Implementation</span>
                      </div>
                      <pre className="text-xs font-mono text-slate-100 bg-slate-950 p-3.5 rounded-lg border border-slate-800 whitespace-pre-wrap overflow-x-auto">
                        {q.userSubmittedCode}
                      </pre>
                    </div>
                  )}

                  {/* Transcript */}
                  {q.userAnswerText && (
                    <div className="p-4">
                      <div className="text-xs font-bold text-content-main mb-1.5">Spoken Audio Transcript</div>
                      <p className="text-sm text-content-main italic leading-relaxed font-medium">
                        "{q.userAnswerText}"
                      </p>
                    </div>
                  )}

                  {/* No answer recorded */}
                  {(!q.userSubmittedCode || q.userSubmittedCode === "undefined") && !q.userAnswerText && (
                    <div className="p-5 text-center text-content-muted text-xs italic">
                      No code or audio response was recorded for this question.
                    </div>
                  )}
                </div>
              </div>

              {/* AI Feedback & Ideal Implementation */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                {/* AI Analytical Feedback */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-content-muted uppercase tracking-wider block">
                    AI Analytical Feedback
                  </span>
                  <div className="bg-emerald-50 dark:bg-[#11231f] border border-emerald-300 dark:border-emerald-500/30 border-l-4 border-l-emerald-500 rounded-xl p-4 sm:p-5 text-sm text-emerald-950 dark:text-emerald-50 leading-relaxed font-medium">
                    {q.aiFeedback || "No feedback recorded."}
                  </div>
                </div>

                {/* Ideal Implementation */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-content-muted uppercase tracking-wider">
                      Ideal Reference Implementation
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(formatIdealAnswer(q.idealAnswer), index)}
                      className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                    >
                      {copiedIndex === index ? (
                        <>
                          <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                          <span>Copy Answer</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="bg-slate-900 dark:bg-[#0e1817] border border-line-subtle text-slate-100 dark:text-[#f0fdf4] p-4 sm:p-5 rounded-xl text-xs overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed max-h-64">
                    {formatIdealAnswer(q.idealAnswer)}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SessionReview;