import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import OpenAI from "openai";

import {
  searchCandidates,
  searchCandidatesByMetadata,
} from "./vectorStore";

import { createEmbedding } from "./embeddings";
import { parseSearchQuery } from "./queryParser";
import { getCandidate } from "./candidates";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function answerQuestion(
  question: string
) {
  // --------------------------------
  // 1. Parse recruiter query
  // --------------------------------

  const search = await parseSearchQuery(question);

  console.log("\nParsed search:");
  console.log(
    JSON.stringify(search, null, 2)
  );

  // --------------------------------
  // 2. Retrieve candidates
  // --------------------------------

  let results;

  if (search.searchQuery) {
    const queryEmbedding =
      await createEmbedding(
        search.searchQuery
      );

    results = searchCandidates(
      queryEmbedding,
      5,
      {
        role: search.role,
        location: search.location,
      }
    );
  } else {
    results =
      searchCandidatesByMetadata(
        5,
        {
          role: search.role,
          location: search.location,
        }
      );
  }

  console.log(
    `\nRetrieved ${results.length} candidates`
  );

  results.forEach(
    (result, index) => {
      console.log(
        `${index + 1}. ${
          result.candidateName
        } | ${result.role} | ${
          result.location
        } | ${
          result.score?.toFixed(3) ?? "N/A"
        }`
      );
    }
  );

  // --------------------------------
  // 3. Load complete candidate profiles
  // --------------------------------

  const candidateResults =
    results.map(result => ({
      candidate: getCandidate(
        result.candidateId
      ),
      candidateId:
        result.candidateId,
      score: result.score,
      source: result.source,
    }));

  // --------------------------------
  // 4. Build LLM context
  // --------------------------------

  const context = candidateResults
    .map((result, index) => {
      const candidate =
        result.candidate;

      return `
CANDIDATE ${index + 1}

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
    })
    .join("\n\n");

  // --------------------------------
  // 5. Generate grounded answer
  // --------------------------------

  const response =
    await client.responses.create({
      model: "gpt-4.1",

      input: `
You are TalentPool, an AI recruiting assistant.

Answer the recruiter's question using ONLY
the candidate information provided below.

Do not invent information.

If no candidates match the request,
say that clearly.

When recommending candidates:

- Mention their name.
- Explain briefly why they are relevant.
- Only mention experience, skills,
  education or languages that appear
  in the candidate information.
- Do not make unsupported assumptions.
- Keep the answer concise and useful
  for a recruiter.

Recruiter's question:
${question}

Retrieved candidate information:
${context}
`,
    });

  // --------------------------------
  // 6. Return answer + sources
  // --------------------------------

  return {
    answer: response.output_text,

    search,

    sources: candidateResults.map(
      result => ({
        candidateId:
          result.candidateId,

        candidateName:
          result.candidate.name,

        role:
          result.candidate.role,

        location:
          result.candidate.location,

        source:
          result.source,

        score:
          result.score,
      })
    ),
  };
}