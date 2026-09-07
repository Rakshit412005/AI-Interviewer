// frontend/src/pages/InterviewRunner.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getSessionById, submitAnswer, endSession } from '../features/sessions/sessionSlice';
import MonacoEditor from '@monaco-editor/react';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';
import ConfirmModal from '../components/ConfirmModal';

const SUPPORTED_LANGUAGES = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'C++', value: 'cpp' },
  { label: 'C#', value: 'csharp' },
  { label: 'Go', value: 'go' },
  { label: 'Swift', value: 'swift' },
  { label: 'Kotlin', value: 'kotlin' },
  { label: 'R Language', value: 'r' },
  { label: 'SQL', value: 'sql' },
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'Solidity', value: 'solidity' },
  { label: 'Shell', value: 'shell' },
  { label: 'YAML', value: 'yaml' },
  { label: 'Markdown', value: 'markdown' },
  { label: 'Plain Text', value: 'plaintext' },
];

const ROLE_LANGUAGE_MAP = {
  "MERN Stack Developer": "javascript",
  "MEAN Stack Developer": "typescript",
  "Full Stack Python": "python",
  "Full Stack Java": "java",
  "Frontend Developer": "javascript",
  "Backend Developer": "javascript",
  "Data Scientist": "python",
  "Data Analyst": "python",
  "Machine Learning Engineer": "python",
  "DevOps Engineer": "shell",
  "Cloud Engineer (AWS/Azure/GCP)": "yaml",
  "Cybersecurity Engineer": "python",
  "Blockchain Developer": "solidity",
  "Mobile Developer (iOS/Android)": "swift",
  "Game Developer": "csharp",
  "QA Automation Engineer": "python",
  "UI/UX Designer": "css",
  "Product Manager": "markdown",
  "Software Development Engineer (SDE)": "cpp"
};

function InterviewRunner() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDark } = useTheme();

  const { activeSession, isLoading, message } = useSelector(state => state.sessions);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');

  // Modal State for Finishing Interview
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);

  // If submittedLocal[0] is true, we lock Question 0 immediately.
  const [submittedLocal, setSubmittedLocal] = useState({});

  const [drafts, setDrafts] = useState(() => {
    const saved = localStorage.getItem(`drafts_${sessionId}`);
    return saved ? JSON.parse(saved) : {};
  });

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    if (activeSession?.role) {
      const detectedLang =
        ROLE_LANGUAGE_MAP[activeSession.role] || "plaintext";

      setSelectedLanguage(detectedLang);
    }
  }, [activeSession?.role]);

  useEffect(() => {
    localStorage.setItem(`drafts_${sessionId}`, JSON.stringify(drafts));
  }, [drafts, sessionId]);

  useEffect(() => {
    dispatch(getSessionById(sessionId));
  }, [dispatch, sessionId]);

  const currentQuestion = activeSession?.questions?.[currentQuestionIndex];

  // 1. Is it submitted in Redux? (Backend confirmed)
  const isReduxSubmitted = currentQuestion?.isSubmitted === true;

  // 2. Did I just click submit locally? (Optimistic update)
  const isLocallySubmitted = submittedLocal[currentQuestionIndex] === true;

  // 3. Lock if EITHER is true
  const isQuestionLocked = isReduxSubmitted || isLocallySubmitted;

  // 4. Show "Analyzing..." status if Locked AND not yet evaluated
  const isProcessing = isQuestionLocked && !currentQuestion?.isEvaluated;

  const handleNavigation = (index) => {
    if (index >= 0 && index < activeSession?.questions.length) {
      if (isRecording) stopRecording();
      setCurrentQuestionIndex(index);
      setRecordingTime(0);
    }
  };

  const updateDraftCode = (newCode) => {
    if (isQuestionLocked) return;
    setDrafts(prev => ({
      ...prev,
      [currentQuestionIndex]: { ...prev[currentQuestionIndex], code: newCode }
    }));
  };

  const startRecording = async () => {
    if (isQuestionLocked) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setDrafts(prev => ({
          ...prev,
          [currentQuestionIndex]: { ...prev[currentQuestionIndex], audioBlob: blob }
        }));
      };

      mediaRecorderRef.current.start(1000);
      setIsRecording(true);
      setRecordingTime(0);
      timerIntervalRef.current = setInterval(() => setRecordingTime(p => p + 1), 1000);
    } catch (err) {
      toast.error("Microphone access denied. Please grant microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach(track => track.stop());
      clearInterval(timerIntervalRef.current);
      setIsRecording(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (isQuestionLocked) return;
    if (isRecording) stopRecording();

    const draft = drafts[currentQuestionIndex];
    const code = draft?.code || '';
    const audio = draft?.audioBlob;

    if (!code && !audio) {
      toast.warning("Please provide code or an audio answer before submitting.");
      return;
    }

    // 1. OPTIMISTIC UPDATE: Lock UI instantly
    setSubmittedLocal(prev => ({ ...prev, [currentQuestionIndex]: true }));

    const formData = new FormData();
    formData.append('questionIndex', currentQuestionIndex);
    if (code) formData.append('code', code);
    if (audio) formData.append('audioFile', audio, 'answer.webm');

    // 2. Send Request
    dispatch(submitAnswer({ sessionId, formData }))
      .unwrap()
      .catch(() => {
        // If backend fails, UNLOCK so user can try again
        setSubmittedLocal(prev => ({ ...prev, [currentQuestionIndex]: false }));
        toast.error("Submission failed. Please try again.");
      });
  };

  const executeFinishInterview = () => {
    setIsFinishModalOpen(false);

    if (activeSession?.status === "completed") {
      localStorage.removeItem(`drafts_${sessionId}`);
      navigate(`/review/${sessionId}`);
      return;
    }

    dispatch(endSession(sessionId))
      .unwrap()
      .then(() => {
        localStorage.removeItem(`drafts_${sessionId}`);
        navigate(`/review/${sessionId}`);
      })
      .catch(() => {
        toast.error("Could not finish session. AI is still processing answers.");
      });
  };

  if (!activeSession) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="animate-spin h-10 w-10 border-2 border-emerald-500 border-t-transparent rounded-full" />
        <p className="text-content-muted text-sm font-medium">Loading interview environment...</p>
      </div>
    );
  }

  const currentDraft = drafts[currentQuestionIndex] || {};
  const totalQuestions = activeSession?.questions?.length || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-36 animate-in fade-in duration-300">
      
      {/* --- Top Control Bar: Role, Question Indicator, Finish Action --- */}
      <div className="bg-surface-card border border-line-subtle p-4 sm:p-5 rounded-2xl shadow-sm-subtle mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h1 className="text-lg font-bold text-content-main font-heading truncate max-w-md">
              {activeSession.role}
            </h1>
            <span className="text-xs text-content-muted bg-surface-inset px-2 py-0.5 rounded-md font-medium">
              {activeSession.level}
            </span>
          </div>

          {/* Question Sequence Track */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {activeSession?.questions?.map((q, i) => {
              const isCurrent = i === currentQuestionIndex;
              const isDone = q.isEvaluated;
              const isPendingEvaluation = q.isSubmitted || submittedLocal[i];

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleNavigation(i)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all duration-150 flex items-center justify-center ${
                    isCurrent
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-500/30 shadow-sm'
                      : isDone
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : isPendingEvaluation
                          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 animate-pulse'
                          : 'bg-surface-inset text-content-muted hover:text-content-main hover:bg-surface-hover'
                  }`}
                  title={`Question ${i + 1}${isDone ? ' (Evaluated)' : isPendingEvaluation ? ' (Evaluating)' : ''}`}
                >
                  {isDone ? '✓' : i + 1}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsFinishModalOpen(true)}
          disabled={isLoading}
          className="self-start sm:self-center px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-500 hover:text-white hover:bg-rose-600 border border-rose-500/30 transition-all active:scale-95 disabled:opacity-50"
        >
          {isLoading ? "Finalizing..." : "Finish Interview"}
        </button>
      </div>

      {/* --- Active Question Card --- */}
      <div className="bg-surface-elevated border border-line-subtle p-6 sm:p-8 rounded-2xl shadow-card-elevated mb-6 relative overflow-hidden">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
          </div>

          <span className="text-xs text-content-subtle font-medium">
            {activeSession.interviewType === 'coding-mix' ? 'Oral & Code Response' : 'Oral Response'}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-semibold text-content-main leading-relaxed font-heading">
          {currentQuestion?.questionText}
        </h2>
      </div>

      {/* --- Response Workstation: Voice Recorder + Code Editor --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* === SECTION 1: VOICE RECORDER CONSOLE === */}
        <div className="bg-surface-card border border-line-subtle rounded-2xl p-6 shadow-sm-subtle flex flex-col justify-between min-h-[380px]">
          <div className="flex items-center justify-between border-b border-line-subtle pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-content-main">
                Verbal Explanation
              </span>
            </div>

            {/* Live State Badge */}
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              isRecording
                ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20 animate-pulse'
                : currentDraft.audioBlob
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-surface-inset text-content-subtle'
            }`}>
              {isRecording ? 'Recording Live' : currentDraft.audioBlob ? 'Audio Captured' : 'Ready'}
            </span>
          </div>

          {/* Interactive Recording Visual Center */}
          <div className="flex flex-col items-center justify-center my-8">
            {!isRecording && !currentDraft.audioBlob ? (
              // State 1: IDLE / READY TO RECORD
              <div className="flex flex-col items-center text-center">
                <button
                  type="button"
                  onClick={startRecording}
                  disabled={isQuestionLocked}
                  aria-label="Start recording audio response"
                  className="w-24 h-24 rounded-full bg-surface-inset border-2 border-emerald-500/30 hover:border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-md hover:scale-105 transition-all duration-200 group disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  <svg className="w-10 h-10 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
                <p className="mt-4 text-sm font-bold text-content-main">
                  Click to Record Response
                </p>
                <p className="mt-1 text-xs text-content-muted max-w-xs">
                  Speak clearly into your microphone to answer conceptually.
                </p>
              </div>
            ) : isRecording ? (
              // State 2: ACTIVELY RECORDING (with concentric halo & timer)
              <div className="flex flex-col items-center text-center">
                <div className="relative flex items-center justify-center">
                  {/* Concentric Breathing Pulse Halo */}
                  <span className="absolute w-28 h-28 rounded-full bg-rose-500/20 animate-ping" />
                  <span className="absolute w-24 h-24 rounded-full bg-rose-500/30 animate-pulse" />
                  
                  <button
                    type="button"
                    onClick={stopRecording}
                    aria-label="Stop recording audio response"
                    className="relative w-20 h-20 bg-rose-600 hover:bg-rose-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-rose-600/30 transition-transform active:scale-95"
                  >
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="6" width="12" height="12" rx="2" />
                    </svg>
                  </button>
                </div>

                <div className="mt-5 flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 font-mono font-bold text-sm">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span>00:{recordingTime < 10 ? `0${recordingTime}` : recordingTime}</span>
                </div>

                <p className="mt-2 text-xs text-content-muted">
                  Recording in progress... Click square to finish.
                </p>
              </div>
            ) : (
              // State 3: AUDIO CAPTURED
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mb-3">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <p className="font-bold text-content-main text-base">
                  Audio Answer Captured
                </p>
                <p className="text-xs text-content-muted mt-0.5">
                  Your spoken response is saved in your local draft.
                </p>

                {!isQuestionLocked && (
                  <button
                    type="button"
                    onClick={() => setDrafts(prev => ({
                      ...prev,
                      [currentQuestionIndex]: { ...prev[currentQuestionIndex], audioBlob: null }
                    }))}
                    className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Discard & Re-record</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Console Footer Tips */}
          <div className="text-[11px] text-content-subtle border-t border-line-subtle pt-3 flex items-center justify-between">
            <span>Audio format: WebM stereo</span>
            <span>{isQuestionLocked ? "Locked for evaluation" : "Draft saved automatically"}</span>
          </div>
        </div>

        {/* === SECTION 2: MONACO CODE EDITOR === */}
        <div className="bg-surface-card border border-line-subtle rounded-2xl overflow-hidden shadow-sm-subtle flex flex-col min-h-[380px]">
          {/* Editor Header & Language Selector */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-surface-elevated border-b border-line-subtle">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span className="text-xs font-bold uppercase tracking-wider text-content-main">
                Code Editor
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isQuestionLocked && (
                <span className="text-[10px] font-bold uppercase text-content-subtle bg-surface-inset px-2 py-0.5 rounded">
                  Read Only
                </span>
              )}
              {/* High-Contrast Dropdown with explicit options styling for dark/light mode */}
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                disabled={isQuestionLocked}
                className="text-xs bg-surface-inset text-content-main border border-line-subtle rounded-lg px-2.5 py-1 font-semibold focus:border-line-active focus:ring-1 focus:ring-emerald-500 outline-none transition-colors disabled:opacity-50 [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-[#142321] dark:[&>option]:text-white"
              >
                {SUPPORTED_LANGUAGES.map(l => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Monaco Editor Canvas */}
          <div className="flex-1 w-full min-h-[320px]">
            <MonacoEditor
              height="100%"
              language={selectedLanguage}
              theme={isDark ? "vs-dark" : "light"}
              value={currentDraft.code || ''}
              onChange={updateDraftCode}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: '"JetBrains Mono", monospace',
                scrollBeyondLastLine: false,
                readOnly: isQuestionLocked,
                domReadOnly: isQuestionLocked,
                padding: { top: 12, bottom: 12 },
              }}
            />
          </div>
        </div>
      </div>

      {/* --- AI Feedback Presentation (High Contrast, Elevated & Readable) --- */}
      {currentQuestion?.isEvaluated && (
        <div className="mt-8 bg-emerald-950/20 dark:bg-emerald-950/40 border border-emerald-500/30 p-6 sm:p-7 rounded-2xl shadow-sm animate-in fade-in slide-in-from-bottom-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/20 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-content-main font-heading">
                  AI Analytical Feedback
                </h3>
                <p className="text-xs text-content-muted">Automated assessment of technical depth and conceptual accuracy</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-black">
                Technical Score: {currentQuestion.technicalScore}/100
              </div>
            </div>
          </div>

          <p className="text-content-main text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
            {currentQuestion.aiFeedback}
          </p>
        </div>
      )}

      {/* --- Fixed Bottom Command Bar --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface-elevated/95 backdrop-blur-md border-t border-line-subtle px-4 sm:px-8 py-3.5 flex items-center justify-between z-40 shadow-card-elevated">
        <button
          type="button"
          onClick={() => handleNavigation(currentQuestionIndex - 1)}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-content-muted hover:text-content-main hover:bg-surface-hover transition-colors disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Center Submission Controller & Status */}
        <div className="flex flex-col items-center gap-1">
          {isProcessing && message && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-0.5 rounded-full animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>AI Engine: {message}...</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmitAnswer}
            disabled={isQuestionLocked}
            className={`px-8 py-2.5 rounded-xl font-bold text-sm text-white shadow-sm transition-all duration-150 active:scale-95 flex items-center gap-2 ${
              isProcessing
                ? 'bg-surface-hover text-content-muted cursor-wait'
                : currentQuestion?.isEvaluated
                  ? 'bg-emerald-600 cursor-default'
                  : isQuestionLocked
                    ? 'bg-surface-hover text-content-muted cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500'
            }`}
          >
            {isProcessing ? (
              <>
                <span className="animate-spin h-3.5 w-3.5 border-2 border-content-muted border-t-transparent rounded-full" />
                <span>Evaluating Answer...</span>
              </>
            ) : currentQuestion?.isEvaluated ? (
              <>
                <span>Answer Evaluated</span>
                <span className="text-xs">✓</span>
              </>
            ) : isQuestionLocked ? (
              <span>Submitted</span>
            ) : (
              <span>Submit Answer</span>
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={() => handleNavigation(currentQuestionIndex + 1)}
          disabled={currentQuestionIndex === totalQuestions - 1}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-content-muted hover:text-content-main hover:bg-surface-hover transition-colors disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5"
        >
          <span className="hidden sm:inline">Next</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* --- In-App Confirmation Modal for Finishing Interview --- */}
      <ConfirmModal
        isOpen={isFinishModalOpen}
        title="Complete Interview Session"
        description="Are you sure you want to finish this interview? Any unanswered questions will be finalized and the evaluation report will be compiled."
        confirmText="Finish & View Results"
        cancelText="Return to Interview"
        isDestructive={false}
        onConfirm={executeFinishInterview}
        onCancel={() => setIsFinishModalOpen(false)}
      />
    </div>
  );
}

export default InterviewRunner;