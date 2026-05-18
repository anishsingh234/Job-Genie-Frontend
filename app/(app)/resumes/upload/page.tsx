"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadResume } from "@/lib/api";
import { useToast } from "@/lib/hooks/useToast";
import type { Resume } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FileDropzone } from "@/components/ui/FileDropzone";

export default function UploadResumePage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<Resume | null>(null);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    try {
      const res = await uploadResume(file);
      setResult(res);
      addToast("success", "Resume uploaded and analyzed!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setError(msg);
      addToast("error", msg);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <SectionHeader
        title="Upload Resume"
        subtitle="Upload a PDF to get AI-powered ATS analysis"
      />

      <Card>
        <FileDropzone
          onFile={handleFile}
          accept=".pdf"
          maxSizeMB={10}
          label="Drop your resume PDF here"
          description="PDF format, up to 10MB"
          error={error}
        />
        {uploading && (
          <div className="flex items-center justify-center gap-3 mt-6 py-4">
            <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-sm text-text-secondary">Analyzing your resume...</p>
          </div>
        )}
      </Card>

      {/* Parsed Result */}
      {result && (
        <div className="space-y-6 stagger">
          {/* ATS Score */}
          <Card className="flex flex-col sm:flex-row items-center gap-6">
            <ProgressRing
              value={result.ats_score}
              size={140}
              strokeWidth={10}
              color={result.ats_score >= 80 ? "accent" : result.ats_score >= 60 ? "warning" : "danger"}
              label="ATS Score"
            />
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <h3 className="text-xl font-heading font-bold text-text-primary">
                ATS Compatibility Score
              </h3>
              <p className="text-sm text-text-secondary">
                {result.ats_score >= 80
                  ? "Excellent! Your resume is well-optimized for ATS systems."
                  : result.ats_score >= 60
                    ? "Good, but there's room for improvement in keyword optimization."
                    : "Your resume needs significant optimization for ATS compatibility."}
              </p>
            </div>
          </Card>

          {/* Parsed Summary */}
          {result.parsed_data && (
            <Card>
              <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
                Parsed Information
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {result.parsed_data.name && (
                  <InfoRow label="Name" value={result.parsed_data.name} />
                )}
                {result.parsed_data.email && (
                  <InfoRow label="Email" value={result.parsed_data.email} />
                )}
                {result.parsed_data.phone && (
                  <InfoRow label="Phone" value={result.parsed_data.phone} />
                )}
              </div>

              {result.parsed_data.skills && result.parsed_data.skills.length > 0 && (
                <div className="mt-5">
                  <p className="text-sm font-medium text-text-secondary mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {result.parsed_data.skills.map((skill) => (
                      <Badge key={skill} variant="primary" size="md">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {result.parsed_data.sections && result.parsed_data.sections.length > 0 && (
                <div className="mt-5">
                  <p className="text-sm font-medium text-text-secondary mb-2">Sections Found</p>
                  <div className="flex flex-wrap gap-2">
                    {result.parsed_data.sections.map((sec) => (
                      <Badge key={sec.section_name} variant="success" size="md">
                        ✓ {sec.section_name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}

          <div className="flex gap-3">
            <Button onClick={() => router.push(`/resumes/${result.id}`)}>
              View Full Details
            </Button>
            <Button variant="secondary" onClick={() => { setResult(null); setError(""); }}>
              Upload Another
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-xl bg-bg-surface border border-border-subtle">
      <p className="text-xs text-text-muted mb-0.5">{label}</p>
      <p className="text-sm text-text-primary font-medium">{value}</p>
    </div>
  );
}
