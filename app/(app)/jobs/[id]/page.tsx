"use client";

import { useEffect, useState, use } from "react";
import { getJob, getResumes, matchResume, getSkillGap } from "@/lib/api";
import { useToast } from "@/lib/hooks/useToast";
import type { Job, Resume, JobMatch, SkillGap } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Skeleton } from "@/components/ui/Skeleton";

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { addToast } = useToast();
  const [job, setJob] = useState<Job | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [matches, setMatches] = useState<JobMatch[] | null>(null);
  const [gap, setGap] = useState<SkillGap | null>(null);
  const [selectedResume, setSelectedResume] = useState("");
  const [loading, setLoading] = useState(true);
  const [matchLoading, setMatchLoading] = useState(false);
  const [gapLoading, setGapLoading] = useState(false);

  useEffect(() => {
    Promise.all([getJob(id), getResumes()])
      .then(([j, r]) => {
        setJob(j);
        setResumes(r);
        if (r.length > 0) setSelectedResume(r[0].id);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleMatch() {
    if (!selectedResume) return;
    setMatchLoading(true);
    try {
      const res = await matchResume(selectedResume);
      setMatches(res.matches);
      addToast("success", "Resume matched successfully!");
    } catch {
      addToast("error", "Failed to match resume");
    } finally {
      setMatchLoading(false);
    }
  }

  async function handleGapAnalysis() {
    if (!selectedResume) return;
    setGapLoading(true);
    try {
      const res = await getSkillGap(selectedResume, id);
      setGap(res);
      addToast("success", "Skill gap analysis complete!");
    } catch {
      addToast("error", "Failed to analyze skill gap");
    } finally {
      setGapLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="w-64 h-8" />
        <div className="rounded-2xl border border-border-subtle bg-bg-card p-6">
          <Skeleton className="w-full h-40" />
        </div>
      </div>
    );
  }

  if (!job) {
    return <div className="text-center py-20 text-text-secondary">Job not found.</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <SectionHeader title={job.title} subtitle={job.company} />

      <div className="grid lg:grid-cols-3 gap-6 stagger">
        {/* Job Details */}
        <Card className="lg:col-span-2 space-y-5">
          <div>
            <h3 className="text-sm font-heading font-semibold text-text-secondary mb-2">
              Description
            </h3>
            <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
              {job.description}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-heading font-semibold text-text-secondary mb-2">
              Required Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.required_skills.map((s) => (
                <Badge key={s} variant="primary" size="md">{s}</Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Actions */}
        <Card className="space-y-5">
          <h3 className="text-sm font-heading font-semibold text-text-primary">
            Resume Matching
          </h3>
          {resumes.length > 0 ? (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-text-secondary">Select Resume</label>
                <select
                  value={selectedResume}
                  onChange={(e) => setSelectedResume(e.target.value)}
                  className="w-full rounded-xl border border-border-subtle bg-bg-surface px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>{r.filename}</option>
                  ))}
                </select>
              </div>
              <Button onClick={handleMatch} loading={matchLoading} className="w-full">
                Match Resume
              </Button>
              <Button onClick={handleGapAnalysis} loading={gapLoading} variant="secondary" className="w-full">
                Skill Gap Analysis
              </Button>
            </>
          ) : (
            <p className="text-sm text-text-muted">
              Upload a resume first to match against this job.
            </p>
          )}
        </Card>
      </div>

      {/* Match Results */}
      {matches && (
        <Card>
          <h3 className="text-lg font-heading font-semibold text-text-primary mb-5">
            Match Results
          </h3>
          <div className="space-y-4">
            {matches.map((m) => (
              <div key={m.job_id} className="flex items-center gap-4 p-3 rounded-xl bg-bg-surface border border-border-subtle">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">{m.job_title}</p>
                  <p className="text-xs text-text-muted truncate">{m.description}</p>
                </div>
                <div className="w-32 shrink-0">
                  <ProgressBar
                    value={Math.round(m.similarity_score * 100)}
                    showValue
                    size="sm"
                    color={m.similarity_score >= 0.7 ? "accent" : m.similarity_score >= 0.5 ? "warning" : "danger"}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Skill Gap */}
      {gap && (
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-heading font-semibold text-text-primary">
              Skill Gap Analysis
            </h3>
            <Badge
              variant={gap.match_percentage >= 70 ? "success" : gap.match_percentage >= 50 ? "warning" : "danger"}
              size="md"
            >
              {gap.match_percentage}% Match
            </Badge>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {/* Matched */}
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <h4 className="text-sm font-heading font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                <span>✓</span> Matched
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {gap.matched.map((s) => (
                  <Badge key={s} variant="success" size="sm">{s}</Badge>
                ))}
                {gap.matched.length === 0 && (
                  <p className="text-xs text-text-muted">None</p>
                )}
              </div>
            </div>

            {/* Missing */}
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
              <h4 className="text-sm font-heading font-semibold text-red-400 mb-3 flex items-center gap-2">
                <span>✕</span> Missing
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {gap.missing.map((s) => (
                  <Badge key={s} variant="danger" size="sm">{s}</Badge>
                ))}
                {gap.missing.length === 0 && (
                  <p className="text-xs text-text-muted">None</p>
                )}
              </div>
            </div>

            {/* Extra */}
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
              <h4 className="text-sm font-heading font-semibold text-blue-400 mb-3 flex items-center gap-2">
                <span>ℹ</span> Extra
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {gap.extra.map((s) => (
                  <Badge key={s} variant="info" size="sm">{s}</Badge>
                ))}
                {gap.extra.length === 0 && (
                  <p className="text-xs text-text-muted">None</p>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
