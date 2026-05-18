"use client";

import { useEffect, useState, use } from "react";
import { submitAnswer, completeInterview } from "@/lib/api";
import { useToast } from "@/lib/hooks/useToast";
import { mockInterviewSession, mockInterviewReport } from "@/lib/mock-data";
import type { InterviewSession, InterviewReport, AnswerEvaluation } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Textarea } from "@/components/ui/Input";
import { QuestionCard } from "@/components/interview/QuestionCard";
import { ConfidenceMeter } from "@/components/interview/ConfidenceMeter";
import { ReportView } from "@/components/interview/ReportView";

export default function InterviewSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { addToast } = useToast();

  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [evaluations, setEvaluations] = useState<Record<number, AnswerEvaluation>>({});
  const [submitting, setSubmitting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [report, setReport] = useState<InterviewReport | null>(null);

  // Load session from sessionStorage or use mock
  useEffect(() => {
    const stored = sessionStorage.getItem(`interview_${id}`);
    if (stored) {
      try {
        setSession(JSON.parse(stored));
      } catch {
        setSession({ ...mockInterviewSession, session_id: id });
      }
    } else {
      setSession({ ...mockInterviewSession, session_id: id });
    }
  }, [id]);

  if (!session) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // Show report if completed
  if (report) {
    return (
      <div className="max-w-4xl mx-auto">
        <ReportView report={report} />
      </div>
    );
  }

  const totalQuestions = session.questions.length;
  const currentQ = session.questions[currentIndex];
  const currentEval = evaluations[currentIndex];
  const answeredCount = Object.keys(evaluations).length;
  const allAnswered = answeredCount === totalQuestions;

  async function handleSubmitAnswer() {
    if (!answer.trim()) {
      addToast("error", "Please write an answer");
      return;
    }
    setSubmitting(true);
    try {
      const evaluation = await submitAnswer({
        session_id: session!.session_id,
        question_index: currentIndex,
        answer: answer.trim(),
      });
      setEvaluations((prev) => ({ ...prev, [currentIndex]: evaluation }));
      addToast("success", "Answer submitted!");
    } catch {
      // Use mock evaluation on failure
      const mockEval: AnswerEvaluation = {
        score: Math.floor(Math.random() * 30) + 60,
        feedback: "Good answer! Consider adding more specific examples.",
        strengths: ["Clear communication"],
        improvements: ["Add more detail"],
      };
      setEvaluations((prev) => ({ ...prev, [currentIndex]: mockEval }));
      addToast("info", "Using offline evaluation");
    } finally {
      setSubmitting(false);
    }
  }

  function handleNext() {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnswer("");
    }
  }

  function handlePrev() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setAnswer("");
    }
  }

  async function handleComplete() {
    setCompleting(true);
    try {
      const rep = await completeInterview(session!.session_id);
      setReport(rep);
      addToast("success", "Interview completed!");
    } catch {
      setReport(mockInterviewReport);
      addToast("info", "Using offline report");
    } finally {
      setCompleting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-heading font-semibold text-text-primary">
            Interview Session
          </h2>
          <span className="text-sm text-text-secondary">
            {answeredCount}/{totalQuestions} answered
          </span>
        </div>
        <ProgressBar
          value={answeredCount}
          max={totalQuestions}
          showValue={false}
          size="sm"
          color="primary"
        />
      </div>

      {/* Current Question */}
      <QuestionCard
        questionIndex={currentIndex}
        totalQuestions={totalQuestions}
        question={currentQ.question}
        category={currentQ.category}
      />

      {/* Answer or Evaluation */}
      {currentEval ? (
        <Card className="space-y-4 animate-fade-in-up">
          <div className="flex items-center gap-2 text-sm font-heading font-semibold text-accent">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Answer Evaluated
          </div>
          <ConfidenceMeter score={currentEval.score} label="Score" />
          <p className="text-sm text-text-secondary italic">
            &ldquo;{currentEval.feedback}&rdquo;
          </p>
          {currentEval.strengths && currentEval.strengths.length > 0 && (
            <div>
              <p className="text-xs text-text-muted mb-1">Strengths:</p>
              <ul className="text-sm text-accent space-y-1">
                {currentEval.strengths.map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-accent" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      ) : (
        <Card className="space-y-4">
          <Textarea
            label="Your Answer"
            placeholder="Type your answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={6}
          />
          <Button
            onClick={handleSubmitAnswer}
            loading={submitting}
            disabled={!answer.trim()}
            className="w-full"
          >
            Submit Answer
          </Button>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          ← Previous
        </Button>

        <div className="flex gap-3">
          {currentIndex < totalQuestions - 1 ? (
            <Button
              variant="secondary"
              onClick={handleNext}
              disabled={!currentEval}
            >
              Next →
            </Button>
          ) : null}

          {allAnswered && (
            <Button
              onClick={handleComplete}
              loading={completing}
            >
              Complete Interview
            </Button>
          )}
        </div>
      </div>

      {/* Question dots */}
      <div className="flex items-center justify-center gap-2 pt-4">
        {session.questions.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrentIndex(i); setAnswer(""); }}
            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
              i === currentIndex
                ? "bg-primary scale-125"
                : evaluations[i]
                  ? "bg-accent"
                  : "bg-bg-elevated"
            }`}
            aria-label={`Go to question ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
