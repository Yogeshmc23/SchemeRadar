export interface StudentProfile {
  state: string;
  course: string;
  education_level: string;
  year_of_study: number;
  annual_family_income?: number | null;
  category?: string | null;
}

export interface Scholarship {
  name: string;
  states: string[];
  courses: string[];
  education_levels: string[];
  eligible_years: number[];
  max_annual_income?: number | null;
  categories: string[];
  benefits?: string[];
  application_deadline?: string | null;
  official_url?: string | null;
  source_url?: string | null;
  missing_information?: string[];
}

export interface MatchItem {
  scholarship: string;
  status: "eligible" | "needs_information" | "not_eligible";
  reasons: string[];
  official_url?: string | null;
  source_url?: string | null;
  official_domain_detected?: boolean;
  missing_information?: string[];
}

export interface MatchResponse {
  assistant: string;
  student_profile: StudentProfile;
  total_scholarships_checked?: number;
  total_scholarships_found?: number;
  eligible: number;
  needs_information: number;
  not_eligible: number;
  matches: MatchItem[];
  query?: string;
  sources_checked?: string[];
  extraction_errors?: { source_url: string; error: string }[];
  message?: string;
}

export interface ChatResponse {
  assistant: string;
  response: string;
}

export interface SearchResponse {
  assistant: string;
  provider: string;
  query: string;
  results: unknown;
}

export interface FetchResponse {
  assistant: string;
  provider: string;
  results: unknown;
}

export interface ResearchResponse {
  assistant: string;
  query: string;
  sources_checked: string[];
  research: string;
}

export interface ExtractResponse {
  assistant: string;
  total_pages_fetched: number;
  total_scholarships_extracted: number;
  scholarships: Scholarship[];
  extraction_errors: { source_url: string; error: string }[];
}

export interface AgentResponse {
  assistant: string;
  orchestration: string;
  mode: "chat" | "research" | "discover";
  result: unknown;
}

export interface HealthResponse {
  message: string;
  status: string;
  assistant: string;
}
