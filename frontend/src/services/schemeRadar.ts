import { apiRequest } from "./api";

import type {
  AgentResponse,
  ChatResponse,
  ExtractResponse,
  FetchResponse,
  HealthResponse,
  MatchResponse,
  ResearchResponse,
  SearchResponse,
  Scholarship,
  StudentProfile,
} from "@/src/types";

export async function getHealth(): Promise<HealthResponse> {
  return apiRequest<HealthResponse>("/");
}

export async function sendChatMessage(
  message: string
): Promise<ChatResponse> {
  return apiRequest<ChatResponse>("/chat", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

export async function searchScholarships(
  query: string
): Promise<SearchResponse> {
  return apiRequest<SearchResponse>("/search", {
    method: "POST",
    body: JSON.stringify({ query }),
  });
}

export async function fetchPages(urls: string[]): Promise<FetchResponse> {
  return apiRequest<FetchResponse>("/fetch", {
    method: "POST",
    body: JSON.stringify({ urls }),
  });
}

export async function researchScholarships(
  query: string
): Promise<ResearchResponse> {
  return apiRequest<ResearchResponse>("/research", {
    method: "POST",
    body: JSON.stringify({ query }),
  });
}

export async function matchScholarships(
  student: StudentProfile,
  scholarships: Scholarship[]
): Promise<MatchResponse> {
  return apiRequest<MatchResponse>("/match", {
    method: "POST",
    body: JSON.stringify({ student, scholarships }),
  });
}

export async function extractScholarships(
  urls: string[]
): Promise<ExtractResponse> {
  return apiRequest<ExtractResponse>("/extract", {
    method: "POST",
    body: JSON.stringify({ urls }),
  });
}

export async function discoverAndMatch(
  query: string,
  student: StudentProfile
): Promise<MatchResponse> {
  return apiRequest<MatchResponse>("/discover-and-match", {
    method: "POST",
    body: JSON.stringify({ query, student }),
  });
}

export async function runAgent(payload: {
  mode: "chat" | "research" | "discover";
  message?: string;
  query?: string;
  student?: StudentProfile;
}): Promise<AgentResponse> {
  return apiRequest<AgentResponse>("/agent", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
