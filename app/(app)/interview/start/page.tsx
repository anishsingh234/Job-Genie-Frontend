"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getResumes, getJobs, startInterview } from "@/lib/api";
import { useToast } from "@/lib/hooks/useToast";
import type { Resume, Job } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Skeleton } from "@/components/ui/Skeleton";

export default function InterviewStartPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [resumeId, setResumeId] = useState("");
  const [jobId, setJobId] = useState("");
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getResumes(), getJobs()])
      .then(([r, j]) => {
        setResumes(r);
        setJobs(j);
        if (r.length > 0) setResumeId(r[0].id);
        if (j.length > 0) setJobId(j[0].id);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Failed to load interview data";
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleStart(e: FormEvent) {
    e.preventDefault();
    if (!resumeId || !jobId) {
      addToast("error", "Select a resume and job first");
      return;
    }
    setStarting(true);
    try {
      const session = await startInterview({
        resume_id: resumeId,
        job_id: jobId,
      });
      addToast("success", "Interview started!");

      // Store session in sessionStorage for the session page
      sessionStorage.setItem(`interview_${session.session_id}`, JSON.stringify(session));
      router.push(`/interview/session/${session.session_id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to start interview";
      addToast("error", msg);
    } finally {
      setStarting(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="w-48 h-8" />
        <div className="rounded-2xl border border-border-subtle bg-bg-card p-6">
          <Skeleton className="w-full h-60" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <SectionHeader
        title="Start Interview"
        subtitle="Practice with AI-powered interview questions tailored to your resume and target job"
      />

      {error && (
        <p className="text-sm text-danger">{error}</p>
      )}

      <Card>
        <form onSubmit={handleStart} className="space-y-6">
          {/* Resume select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Resume</label>
            {resumes.length > 0 ? (
              <select
                value={resumeId}
                onChange={(e) => setResumeId(e.target.value)}
                className="w-full rounded-xl border border-border-subtle bg-bg-surface px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>{r.filename}</option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-text-muted py-2">
                No resumes found. <a href="/resumes/upload" className="text-primary-light hover:underline">Upload one first</a>.
              </p>
            )}
          </div>

          {/* Job select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Target Job</label>
            {jobs.length > 0 ? (
              <select
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
                className="w-full rounded-xl border border-border-subtle bg-bg-surface px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>{j.title} — {j.company}</option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-text-muted py-2">
                No jobs found. <a href="/jobs/new" className="text-primary-light hover:underline">Create one first</a>.
              </p>
            )}
          </div>

          <Button
            type="submit"
            loading={starting}
            disabled={!resumeId || !jobId}
            className="w-full"
            size="lg"
          >
            Start Interview Session
          </Button>
        </form>
      </Card>
    </div>
  );
}
