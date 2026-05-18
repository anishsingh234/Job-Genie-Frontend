"use client";

import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { ProgressRing } from "../ui/ProgressRing";
import { ConfidenceMeter } from "./ConfidenceMeter";
import type { InterviewReport } from "@/lib/types";

interface ReportViewProps {
  report: InterviewReport;
}

export function ReportView({ report }: ReportViewProps) {
  return (
    <div className="space-y-8 stagger">
      {/* Overall Score */}
      <Card className="flex flex-col sm:flex-row items-center gap-8">
        <ProgressRing
          value={report.overall_score}
          size={160}
          strokeWidth={10}
          color={report.overall_score >= 70 ? "accent" : report.overall_score >= 50 ? "warning" : "danger"}
          label="Score"
        />
        <div className="flex-1 space-y-3 text-center sm:text-left">
          <h3 className="text-2xl font-heading font-bold text-text-primary">
            Interview Complete
          </h3>
          <p className="text-text-secondary">
            You answered {report.questions_answered} of {report.total_questions} questions.
            {report.overall_score >= 70
              ? " Great performance!"
              : report.overall_score >= 50
                ? " Good effort, room for growth."
                : " Keep practicing to improve."}
          </p>
        </div>
      </Card>

      {/* Strengths & Improvements */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h4 className="text-sm font-heading font-semibold text-accent flex items-center gap-2 mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Strengths
          </h4>
          <ul className="space-y-2.5">
            {report.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h4 className="text-sm font-heading font-semibold text-accent-warm flex items-center gap-2 mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            Areas for Improvement
          </h4>
          <ul className="space-y-2.5">
            {report.improvements.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-accent-warm shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Per-question breakdown */}
      <Card>
        <h4 className="text-sm font-heading font-semibold text-text-primary mb-6">
          Question Breakdown
        </h4>
        <div className="space-y-6">
          {report.per_question.map((q, i) => (
            <div key={i} className="space-y-3 pb-6 border-b border-border-subtle last:border-0 last:pb-0">
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-medium text-text-primary flex-1">
                  <Badge variant="primary" size="sm" className="mr-2">Q{i + 1}</Badge>
                  {q.question}
                </p>
              </div>
              <ConfidenceMeter score={q.score} label={`Score`} />
              <p className="text-sm text-text-secondary italic">&ldquo;{q.feedback}&rdquo;</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Learning Resources */}
      {report.learning_resources.length > 0 && (
        <Card>
          <h4 className="text-sm font-heading font-semibold text-text-primary mb-4">
            📚 Recommended Resources
          </h4>
          <div className="space-y-3">
            {report.learning_resources.map((r, i) => (
              <a
                key={i}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-bg-surface hover:bg-bg-elevated border border-border-subtle hover:border-border-default transition-all group"
              >
                <span className="text-primary-light group-hover:text-primary transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </span>
                <span className="text-sm text-text-primary group-hover:text-primary-light transition-colors">
                  {r.title}
                </span>
              </a>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
