"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getResumes } from "@/lib/api";
import type { Resume } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getResumes()
      .then(setResumes)
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Failed to load resumes";
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Resumes"
        subtitle="Upload and manage your resumes"
        action={
          <Link href="/resumes/upload">
            <Button icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            }>
              Upload Resume
            </Button>
          </Link>
        }
      />

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <EmptyState
          title="Unable to load resumes"
          description={error}
        />
      ) : resumes.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          }
          title="No resumes yet"
          description="Upload your first resume to get started with ATS analysis and job matching."
          action={{ label: "Upload Resume", href: "/resumes/upload" }}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {resumes.map((resume) => (
            <Link key={resume.id} href={`/resumes/${resume.id}`}>
              <Card hover className="flex items-center gap-4 h-full">
                <ProgressRing
                  value={resume.ats_score}
                  size={72}
                  strokeWidth={6}
                  color={resume.ats_score >= 80 ? "accent" : resume.ats_score >= 60 ? "warning" : "danger"}
                  label="ATS"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {resume.filename}
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    {new Date(resume.upload_date).toLocaleDateString()}
                  </p>
                  {resume.parsed_data?.skills && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {resume.parsed_data.skills.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded-md bg-bg-elevated text-[11px] text-text-muted"
                        >
                          {s}
                        </span>
                      ))}
                      {resume.parsed_data.skills.length > 3 && (
                        <span className="px-2 py-0.5 text-[11px] text-text-muted">
                          +{resume.parsed_data.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
