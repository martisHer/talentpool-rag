import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

import fs from "fs";
import path from "path";

import { CandidateSchema } from "../src/types";

import { extractAllCVs } from "../src/rag/extractText";
import { chunkText } from "../src/rag/chunkText";
import { createEmbedding } from "../src/rag/embeddings";

import {
  addToVectorStore,
  getVectorStore,
  saveVectorStore,
} from "../src/rag/vectorStore";

async function main() {
  const documents =
    await extractAllCVs();

  console.log(
    `\nIndexing ${documents.length} CVs...\n`
  );

  for (const document of documents) {
    const candidateId =
      path.basename(
        document.file,
        ".pdf"
      );

    // Load the original candidate JSON
    const candidatePath = path.join(
      process.cwd(),
      "generated",
      "json",
      `${candidateId}.json`
    );

    const candidate =
      CandidateSchema.parse(
        JSON.parse(
          fs.readFileSync(
            candidatePath,
            "utf-8"
          )
        )
      );

    const chunks = chunkText(
      document.text
    );

    console.log(
      `${candidate.name}: ${chunks.length} chunks`
    );

    for (
      let i = 0;
      i < chunks.length;
      i++
    ) {
      const text = chunks[i];

      console.log(
        `  Embedding chunk ${i + 1}/${chunks.length}`
      );

      const embedding =
        await createEmbedding(text);

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
              (language) =>
                `${language.name} (${language.level})`
            ),

          source:
            document.file,

          text,

          embedding,
        },
      ]);
    }
  }

  const vectorStorePath =
    path.join(
      process.cwd(),
      "generated",
      "vector-store.json"
    );

  saveVectorStore(
    vectorStorePath
  );

  console.log(
    `\n✓ Indexed ${
      getVectorStore().length
    } chunks`
  );

  console.log(
    `✓ Saved vector store to ${vectorStorePath}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});