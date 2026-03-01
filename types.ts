/// <reference types="vite/client" />

export interface User {
  fullName: string;
  email: string;
}

export interface SkillRating {
  name: string;
  rating: number; // 1-5
}

export interface AssessmentData {
  userType: string;
  field: string;
  cgpa: number;
  interests: string[];
  skills: SkillRating[];
  aptitudeScore: number;
}

export interface CareerRole {
  id: string;
  name: string;
  icon: string;
  domain: string;
  description: string;
  skills: string[];
  level: 'Entry Level' | 'Mid Level' | 'Senior Level';
  overview?: string;
  tools?: string[];
  roadmap8Week?: string[];
  projects?: string[];
  resources?: { name: string; url: string; type: 'video' | 'doc' | 'cert' }[];
}

export interface AIRecommendation {
  roleName: string;
  matchPercentage: number;
  reasons: string[];
  skillsHave: string[];
  skillsMissing: string[];
  priority?: string[];
  roadmap: {
    week: number;
    topics: string[];
    tasks: string[];
    project: string;
  }[];
  resourceLinks: { title: string; url: string; category: string }[];
}
