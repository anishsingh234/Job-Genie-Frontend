"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createJob } from "@/lib/api";
import { useToast } from "@/lib/hooks/useToast";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { TagInput } from "@/components/ui/TagInput";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function NewJobPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (skills.length === 0) {
      setError("Add at least one required skill");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const job = await createJob({ title, company, description, required_skills: skills });
      addToast("success", "Job created successfully!");
      router.push(`/jobs/${job.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create job";
      setError(msg);
      addToast("error", msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <SectionHeader
        title="Create Job Listing"
        subtitle="Add a new job to match with resumes"
      />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Job Title"
            placeholder="e.g. Senior Frontend Developer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            label="Company"
            placeholder="e.g. TechCorp"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
          <Textarea
            label="Description"
            placeholder="Describe the role, responsibilities, and requirements..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
          />
          <TagInput
            label="Required Skills"
            value={skills}
            onChange={setSkills}
            placeholder="Type a skill and press Enter"
          />

          {error && (
            <div className="rounded-xl bg-danger/10 border border-danger/20 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={loading}>
              Create Job
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
