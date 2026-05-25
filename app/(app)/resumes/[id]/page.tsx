"use client";

import { useEffect, useState, use } from "react";
import { getResume } from "@/lib/api";
import type { Resume } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ResumeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getResume(id)
      .then(setResume)
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Failed to load resume";
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="w-48 h-8" />
        <div className="rounded-2xl border border-border-subtle bg-bg-card p-6">
          <Skeleton className="w-full h-40" />
        </div>
      </div>
    );
  }

  if (!loading && error) {
    return (
      <div className="text-center py-20 text-text-secondary">
        {error}
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="text-center py-20 text-text-secondary">
        Resume not found.
      </div>
    );
  }

  const pd = resume.parsed_data;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <SectionHeader
        title={resume.filename}
        subtitle={`Uploaded ${new Date(resume.upload_date).toLocaleDateString()}`}
      />

      <div className="grid lg:grid-cols-3 gap-6 stagger">
        {/* ATS Score */}
        <Card className="flex flex-col items-center justify-center lg:col-span-1">
          <ProgressRing
            value={resume.ats_score}
            size={140}
            strokeWidth={10}
            color={resume.ats_score >= 80 ? "accent" : resume.ats_score >= 60 ? "warning" : "danger"}
            label="ATS Score"
          />
          <p className="text-sm text-text-secondary mt-3">
            {resume.ats_score >= 80 ? "Excellent" : resume.ats_score >= 60 ? "Good" : "Needs Work"}
          </p>
        </Card>

        {/* Parsed Info */}
        <Card className="lg:col-span-2 space-y-5">
          <h3 className="text-lg font-heading font-semibold text-text-primary">
            Contact Information
          </h3>
          <div className="grid sm:grid-cols-3 gap-3">
            {pd?.name && <InfoBlock label="Name" value={pd.name} />}
            {pd?.email && <InfoBlock label="Email" value={pd.email} />}
            {pd?.phone && <InfoBlock label="Phone" value={pd.phone} />}
          </div>

          {pd?.skills && pd.skills.length > 0 && (
            <div>
              <p className="text-sm font-medium text-text-secondary mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {pd.skills.map((s) => (
                  <Badge key={s} variant="primary" size="md">{s}</Badge>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Sections */}
      {pd?.sections && pd.sections.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-heading font-semibold text-text-primary">
            Resume Sections
          </h3>
          {pd.sections.map((sec) => (
            <Card key={sec.section_name}>
              <h4 className="text-sm font-heading font-semibold text-primary-light mb-2">
                {sec.section_name}
              </h4>
              <p className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">
                {sec.content}
              </p>
            </Card>
          ))}
        </div>
      )}

      {/* Raw Text */}
      {pd?.raw_text && (
        <Card>
          <h3 className="text-lg font-heading font-semibold text-text-primary mb-3">
            Raw Text Preview
          </h3>
          <div className="rounded-xl bg-bg-surface border border-border-subtle p-4 max-h-96 overflow-y-auto">
            <pre className="text-xs text-text-secondary whitespace-pre-wrap font-mono leading-relaxed">
              {pd.raw_text}
            </pre>
          </div>
        </Card>
      )}
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-xl bg-bg-surface border border-border-subtle">
      <p className="text-xs text-text-muted mb-0.5">{label}</p>
      <p className="text-sm text-text-primary font-medium truncate">{value}</p>
    </div>
  );
}
