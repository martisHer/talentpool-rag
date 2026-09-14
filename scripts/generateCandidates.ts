import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import slugify from "slugify";

import { CandidateSchema } from "../src/types";
import { SYSTEM_PROMPT, createCandidatePrompt } from "./prompts";
import { candidateProfiles } from "./candidateProfiles";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const outputDirectory = path.join(
  process.cwd(),
  "generated",
  "json"
);

fs.mkdirSync(outputDirectory, {
  recursive: true,
});

async function generateCandidate(
  index: number,
  role: string,
  location: string
) {
  console.log(
    `Generating ${index}/${candidateProfiles.length}: ${role} — ${location}`
  );

  const response = await client.responses.create({
    model: "gpt-4.1",

    input: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: createCandidatePrompt(
          index,
          role,
          location
        ),
      },
    ],

    text: {
      format: {
        type: "json_object",
      },
    },
  });

  const rawCandidate = JSON.parse(
    response.output_text
  );

  const candidate = CandidateSchema.parse({
    ...rawCandidate,

    id: slugify(rawCandidate.name, {
      lower: true,
      strict: true,
    }),
  });

  const outputPath = path.join(
    outputDirectory,
    `${candidate.id}.json`
  );

  fs.writeFileSync(
    outputPath,
    JSON.stringify(candidate, null, 2)
  );

  console.log(`✓ Saved ${outputPath}`);

  return candidate;
}

async function main() {
  const candidates = [];

  for (let i = 0; i < candidateProfiles.length; i++) {
    const profile = candidateProfiles[i];

    const candidate = await generateCandidate(
      i + 1,
      profile.role,
      profile.location
    );

    candidates.push(candidate);
  }

  console.log(
    `\n✓ Generated ${candidates.length} candidates`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});