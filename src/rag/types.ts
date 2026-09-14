import { Candidate } from "../types";

export type CVChunk = {
  id: string;

  candidateId: string;
  candidateName: string;

  role: string;
  location: string;

  skills: string[];
  languages: string[];

  source: string;

  text: string;

  embedding?: number[];
};

export type CandidateSearchResult = {
  candidate: Candidate;
  candidateId: string;
  score?: number;
  source: string;
};