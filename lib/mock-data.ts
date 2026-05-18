import type {
  Resume,
  Job,
  DashboardStats,
  ActivityItem,
  InterviewSession,
  InterviewReport,
  JobMatch,
  SkillGap,
} from "./types";

export const mockResumes: Resume[] = [
  {
    id: "r1",
    filename: "john_doe_resume.pdf",
    upload_date: "2026-05-01T10:30:00Z",
    ats_score: 82,
    parsed_data: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1-555-0123",
      skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker"],
      sections: [
        { section_name: "Experience", content: "5 years of full-stack development..." },
        { section_name: "Education", content: "B.S. Computer Science, MIT 2021" },
        { section_name: "Projects", content: "Built scalable microservices architecture..." },
      ],
      raw_text: "John Doe\njohn@example.com\n+1-555-0123\n\nEXPERIENCE\nSenior Frontend Developer at TechCorp (2023-Present)\n- Led development of React-based dashboard serving 100K+ users\n- Implemented CI/CD pipelines reducing deployment time by 60%\n\nEDUCATION\nB.S. Computer Science, MIT 2021\nGPA: 3.8/4.0",
    },
  },
  {
    id: "r2",
    filename: "jane_smith_cv.pdf",
    upload_date: "2026-04-28T14:15:00Z",
    ats_score: 74,
    parsed_data: {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1-555-0456",
      skills: ["Python", "Machine Learning", "TensorFlow", "SQL", "FastAPI"],
      sections: [
        { section_name: "Experience", content: "3 years ML engineering..." },
        { section_name: "Education", content: "M.S. Data Science, Stanford 2023" },
      ],
      raw_text: "Jane Smith\njane@example.com\n\nML Engineer with 3 years of experience...",
    },
  },
  {
    id: "r3",
    filename: "alex_dev_resume.pdf",
    upload_date: "2026-04-25T09:00:00Z",
    ats_score: 91,
    parsed_data: {
      name: "Alex Dev",
      email: "alex@example.com",
      phone: "+1-555-0789",
      skills: ["Go", "Kubernetes", "AWS", "Terraform", "PostgreSQL", "gRPC"],
      sections: [
        { section_name: "Experience", content: "7 years of backend & infra..." },
      ],
      raw_text: "Alex Dev — Senior Backend Engineer...",
    },
  },
];

export const mockJobs: Job[] = [
  {
    id: "j1",
    title: "Senior Frontend Developer",
    company: "TechCorp",
    description:
      "We're looking for a senior frontend developer to lead our React-based product team. You'll work on our core dashboard product serving 100K+ daily active users, implementing new features and improving performance.",
    required_skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL"],
    created_at: "2026-05-02T08:00:00Z",
  },
  {
    id: "j2",
    title: "ML Engineer",
    company: "AI Labs",
    description:
      "Join our ML team to build production-grade machine learning pipelines. You'll work on NLP models, recommendation systems, and real-time inference.",
    required_skills: ["Python", "TensorFlow", "PyTorch", "Kubernetes", "SQL"],
    created_at: "2026-04-30T12:00:00Z",
  },
  {
    id: "j3",
    title: "DevOps Engineer",
    company: "CloudScale Inc",
    description:
      "Build and maintain our cloud infrastructure on AWS. Implement IaC with Terraform, manage Kubernetes clusters, and optimize CI/CD pipelines.",
    required_skills: ["AWS", "Terraform", "Kubernetes", "Docker", "Python", "Bash"],
    created_at: "2026-04-29T16:00:00Z",
  },
];

export const mockDashboardStats: DashboardStats = {
  total_resumes: 3,
  total_jobs: 5,
  interviews_completed: 8,
  average_score: 76,
};

export const mockRecentActivity: ActivityItem[] = [
  {
    type: "resume",
    title: "Uploaded resume",
    description: "john_doe_resume.pdf",
    date: "2026-05-01T10:30:00Z",
  },
  {
    type: "job",
    title: "Created job listing",
    description: "Senior Frontend Developer at TechCorp",
    date: "2026-05-02T08:00:00Z",
  },
  {
    type: "interview",
    title: "Completed interview",
    description: "ML Engineer — AI Labs (Score: 82/100)",
    date: "2026-04-30T15:00:00Z",
  },
];

export const mockJobMatches: JobMatch[] = [
  {
    job_id: "j1",
    job_title: "Senior Frontend Developer",
    similarity_score: 0.87,
    description: "React-based product team...",
  },
  {
    job_id: "j3",
    job_title: "DevOps Engineer",
    similarity_score: 0.45,
    description: "Cloud infrastructure on AWS...",
  },
];

export const mockSkillGap: SkillGap = {
  matched: ["React", "TypeScript", "AWS"],
  missing: ["GraphQL", "Tailwind CSS", "Next.js"],
  extra: ["Python", "Docker", "Node.js"],
  match_percentage: 60,
};

export const mockInterviewSession: InterviewSession = {
  session_id: "is1",
  resume_id: "r1",
  job_id: "j1",
  questions: [
    { question_index: 0, question: "Explain the virtual DOM in React and how it differs from the real DOM.", category: "Technical" },
    { question_index: 1, question: "How would you optimize a React application that has slow rendering performance?", category: "Technical" },
    { question_index: 2, question: "Describe a challenging project you led and how you handled obstacles.", category: "Behavioral" },
    { question_index: 3, question: "What is your approach to code reviews and maintaining code quality?", category: "Process" },
    { question_index: 4, question: "How do you stay current with new frontend technologies and best practices?", category: "Growth" },
  ],
};

export const mockInterviewReport: InterviewReport = {
  session_id: "is1",
  overall_score: 78,
  total_questions: 5,
  questions_answered: 5,
  strengths: [
    "Strong understanding of React fundamentals",
    "Good problem-solving methodology",
    "Clear communication of technical concepts",
  ],
  improvements: [
    "Could provide more specific code examples",
    "Explore advanced optimization patterns like virtualization",
    "Deeper knowledge of build tools and bundler internals",
  ],
  learning_resources: [
    { title: "React Performance Optimization Guide", url: "https://react.dev/learn" },
    { title: "Advanced TypeScript Patterns", url: "https://www.typescriptlang.org/docs/" },
    { title: "System Design for Frontend Engineers", url: "https://frontendmasters.com" },
  ],
  per_question: [
    { question: "Explain the virtual DOM...", answer: "The virtual DOM is...", score: 85, feedback: "Excellent explanation with good depth." },
    { question: "How would you optimize...", answer: "I would start by...", score: 72, feedback: "Good approach but could mention more tools." },
    { question: "Describe a challenging project...", answer: "At my previous company...", score: 80, feedback: "Strong example with clear outcomes." },
    { question: "Code reviews approach...", answer: "I believe in...", score: 75, feedback: "Solid methodology, add more specifics." },
    { question: "Staying current...", answer: "I follow...", score: 78, feedback: "Good habits, could mention community involvement." },
  ],
};
