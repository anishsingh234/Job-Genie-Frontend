// ── API Response Types ──────────────────────────────────────────────

export interface User {
  id: string;
  full_name: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// ── Resume ──────────────────────────────────────────────────────────

export interface ResumeSection {
  section_name: string;
  content: string;
}

export interface Resume {
  id: string;
  filename: string;
  upload_date: string;
  ats_score: number;
  parsed_data?: {
    name?: string;
    email?: string;
    phone?: string;
    skills?: string[];
    sections?: ResumeSection[];
    raw_text?: string;
  };
}

// ── Jobs ────────────────────────────────────────────────────────────

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  required_skills: string[];
  created_at?: string;
}

export interface JobMatch {
  job_id: string;
  job_title: string;
  similarity_score: number;
  description: string;
}

export interface JobMatchResponse {
  resume_id: string;
  matches: JobMatch[];
}

export interface SkillGap {
  matched: string[];
  missing: string[];
  extra: string[];
  match_percentage: number;
}

// ── Interview ───────────────────────────────────────────────────────

export interface InterviewQuestion {
  question_index: number;
  question: string;
  category?: string;
}

export interface InterviewSession {
  session_id: string;
  questions: InterviewQuestion[];
  resume_id: string;
  job_id: string;
}

export interface AnswerEvaluation {
  score: number;
  feedback: string;
  strengths?: string[];
  improvements?: string[];
}

export interface InterviewReport {
  session_id: string;
  overall_score: number;
  total_questions: number;
  questions_answered: number;
  strengths: string[];
  improvements: string[];
  learning_resources: { title: string; url: string }[];
  per_question: {
    question: string;
    answer: string;
    score: number;
    feedback: string;
  }[];
}

// ── Dashboard ───────────────────────────────────────────────────────

export interface DashboardStats {
  total_resumes: number;
  total_jobs: number;
  interviews_completed: number | null;
  average_score: number | null;
}

export interface ActivityItem {
  type: "resume" | "job" | "interview";
  title: string;
  description: string;
  date: string;
}
