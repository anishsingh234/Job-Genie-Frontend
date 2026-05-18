"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getJobs } from "@/lib/api";
import type { Job } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobs()
      .then(setJobs)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Jobs"
        subtitle="Track job listings and match them with your resumes"
        action={
          <Link href="/jobs/new">
            <Button icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            }>
              Create Job
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
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25" />
            </svg>
          }
          title="No jobs yet"
          description="Create your first job listing to start matching with resumes."
          action={{ label: "Create Job", href: "/jobs/new" }}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {jobs.map((job) => (
            <Link key={job.id} href={`/jobs/${job.id}`}>
              <Card hover className="h-full flex flex-col">
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base font-heading font-semibold text-text-primary line-clamp-2">
                      {job.title}
                    </h3>
                  </div>
                  <p className="text-sm text-primary-light font-medium mb-3">
                    {job.company}
                  </p>
                  <p className="text-sm text-text-secondary line-clamp-2 mb-4">
                    {job.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {job.required_skills.slice(0, 4).map((s) => (
                    <Badge key={s} variant="default" size="sm">{s}</Badge>
                  ))}
                  {job.required_skills.length > 4 && (
                    <Badge variant="outline" size="sm">
                      +{job.required_skills.length - 4}
                    </Badge>
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
