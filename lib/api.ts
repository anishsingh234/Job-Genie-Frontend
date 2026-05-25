import { getAuthHeaders } from "./auth";
import type {
  AuthResponse,
  User,
  Resume,
  Job,
  JobMatchResponse,
  SkillGap,
  InterviewSession,
  AnswerEvaluation,
  InterviewReport,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://jobgenie-ai-6wmr.onrender.com";

// ── Generic fetch wrapper ───────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const headers: Record<string, string> = {
      ...getAuthHeaders(),
      ...(options.headers as Record<string, string>),
    };

    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || `API Error ${res.status}`);
    }

    return (await res.json()) as T;
  } catch (error) {
    throw error;
  }
}

// ── Auth ────────────────────────────────────────────────────────────

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  // Bypass apiFetch to prevent Content-Type being overwritten
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `API Error ${res.status}`);
  }

  return res.json();
}

export async function registerUser(
  full_name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ full_name, email, password }),
  });
}

export async function getMe(): Promise<User> {
  return apiFetch<User>("/api/auth/me");
}

// ── Resume ──────────────────────────────────────────────────────────

export async function uploadResume(file: File): Promise<Resume> {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch<Resume>("/api/resume/upload", {
    method: "POST",
    body: formData,
  });
}

export async function getResumes(): Promise<Resume[]> {
  return apiFetch<Resume[]>("/api/resume/");
}

export async function getResume(id: string): Promise<Resume> {
  return apiFetch<Resume>(`/api/resume/${id}`);
}

// ── Jobs ────────────────────────────────────────────────────────────

export async function createJob(job: {
  title: string;
  company: string;
  description: string;
  required_skills: string[];
}): Promise<Job> {
  return apiFetch<Job>("/api/jobs/", {
    method: "POST",
    body: JSON.stringify(job),
  });
}

export async function getJobs(): Promise<Job[]> {
  return apiFetch<Job[]>("/api/jobs/");
}

export async function getJob(id: string): Promise<Job> {
  return apiFetch<Job>(`/api/jobs/${id}`);
}

export async function matchResume(resumeId: string): Promise<JobMatchResponse> {
  return apiFetch<JobMatchResponse>(`/api/jobs/match/${resumeId}`);
}

export async function getSkillGap(resumeId: string, jobId: string): Promise<SkillGap> {
  return apiFetch<SkillGap>(`/api/jobs/gap/${resumeId}/${jobId}`);
}

// ── Interview ───────────────────────────────────────────────────────

export async function startInterview(data: {
  resume_id: string;
  job_id: string;
  num_questions?: number;
}): Promise<InterviewSession> {
  return apiFetch<InterviewSession>("/api/interview/start", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function submitAnswer(data: {
  session_id: string;
  question_index: number;
  answer: string;
}): Promise<AnswerEvaluation> {
  return apiFetch<AnswerEvaluation>("/api/interview/answer", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function completeInterview(sessionId: string): Promise<InterviewReport> {
  return apiFetch<InterviewReport>(`/api/interview/complete/${sessionId}`, {
    method: "POST",
  });
}

export async function getInterviewReport(sessionId: string): Promise<InterviewReport> {
  return apiFetch<InterviewReport>(`/api/interview/report/${sessionId}`);
}

// ── Dashboard (aggregated) ──────────────────────────────────────────

export async function getDashboardData() {
  const [resumes, jobs] = await Promise.all([getResumes(), getJobs()]);

  return {
    stats: {
      total_resumes: resumes.length,
      total_jobs: jobs.length,
      interviews_completed: null,
      average_score: null,
    },
    recentActivity: [],
    resumes,
    jobs,
  };
}