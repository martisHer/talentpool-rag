import fs from "fs";
import path from "path";

import {
  Candidate,
  CandidateSchema,
} from "../types";

export function getCandidate(
  candidateId: string
): Candidate {
  const candidatePath = path.join(
    process.cwd(),
    "generated",
    "json",
    `${candidateId}.json`
  );

  const candidate = JSON.parse(
    fs.readFileSync(candidatePath, "utf-8")
  );

  return CandidateSchema.parse(candidate);
}