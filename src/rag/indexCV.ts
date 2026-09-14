import fs from "fs";
import path from "path";

import { z } from "zod";

import {
  CandidateSchema,
} from "../types";

import {
  chunkText,
} from "./chunkText";

import {
  createEmbedding,
} from "./embeddings";

import {
  addToVectorStore,
} from "./vectorStore";

function candidateToText(
  candidate: z.infer<typeof CandidateSchema>
) {
  return `
Name:
${candidate.name}

Role:
${candidate.role}

Location:
${candidate.location}

Summary:
${candidate.summary}

Skills:
${candidate.skills.join(", ")}

Languages:
${candidate.languages
  .map(
    language =>
      `${language.name} (${language.level})`
  )
  .join(", ")}

Experience:
${candidate.experience
  .map(
    experience => `
${experience.role} at ${experience.company}
${experience.start} - ${experience.end}

${experience.description.join("\n")}
`
  )
  .join("\n")}

Education:
${candidate.education
  .map(
    education =>
      `${education.degree} — ${education.university} (${education.start} - ${education.end})`
  )
  .join("\n")}
`;
}

export async function indexCV(
  pdfPath: string,
  candidateId: string
) {
  const candidatePath =
    path.join(
      process.cwd(),
      "generated",
      "json",
      `${candidateId}.json`
    );

  if (
    !fs.existsSync(candidatePath)
  ) {
    throw new Error(
      `Candidate profile not found: ${candidateId}`
    );
  }

  const candidate =
    CandidateSchema.parse(
      JSON.parse(
        fs.readFileSync(
          candidatePath,
          "utf-8"
        )
      )
    );

  const text =
    candidateToText(candidate);

  const chunks =
    chunkText(text);

  for (
    let i = 0;
    i < chunks.length;
    i++
  ) {
    const chunk =
      chunks[i];

    const embedding =
      await createEmbedding(
        chunk
      );

    addToVectorStore([
      {
        id: `${candidateId}-${i}`,
        candidateId,
        candidateName:
          candidate.name,
        role:
          candidate.role,
        location:
          candidate.location,
        skills:
          candidate.skills,
        languages:
          candidate.languages.map(
            language =>
              `${language.name} (${language.level})`
          ),
        source:
          path.basename(
            pdfPath
          ),
        text: chunk,
        embedding,
      },
    ]);
  }

  return {
    candidateId,
    candidateName:
      candidate.name,
    role:
      candidate.role,
    location:
      candidate.location,
    chunks:
      chunks.length,
    source:
      path.basename(
        pdfPath
      ),
  };
}