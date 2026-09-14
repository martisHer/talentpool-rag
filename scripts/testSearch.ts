import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

import path from "path";

import { createEmbedding } from "../src/rag/embeddings";
import {
  loadVectorStore,
  searchVectorStore,
} from "../src/rag/vectorStore";

async function main() {
  const vectorStorePath = path.join(
    process.cwd(),
    "generated",
    "vector-store.json"
  );

  loadVectorStore(vectorStorePath);

  const query =
    process.argv.slice(2).join(" ") ||
    "frontend engineer with React experience";

  console.log(`\nQuery: "${query}"\n`);

  const queryEmbedding =
    await createEmbedding(query);

  const results =
    searchVectorStore(
      queryEmbedding,
      5
    );

  console.log("Top results:\n");

  results.forEach(
    (result, index) => {
      console.log(
        `${index + 1}. ${result.candidateName}`
      );

      console.log(
        `   Score: ${result.score.toFixed(4)}`
      );

      console.log(
        `   Source: ${result.source}`
      );

      console.log(
        `   ${result.text.slice(0, 300)}...`
      );

      console.log();
    }
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});