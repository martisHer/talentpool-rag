import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

import path from "path";

import {
  loadVectorStore,
} from "../src/rag/vectorStore";

import {
  answerQuestion,
} from "../src/rag/answer";

async function main() {
  const vectorStorePath =
    path.join(
      process.cwd(),
      "generated",
      "vector-store.json"
    );

  loadVectorStore(
    vectorStorePath
  );

  const question =
    process.argv
      .slice(2)
      .join(" ") ||
    "Who are the strongest frontend candidates with React experience?";

  console.log(
    `\nQuestion:\n${question}\n`
  );

  console.log(
    "Thinking...\n"
  );

  const result =
    await answerQuestion(
      question
    );

  console.log(
    "=============================="
  );

  console.log(
    "ANSWER"
  );

  console.log(
    "==============================\n"
  );

  console.log(
    result.answer
  );

  console.log(
    "\n=============================="
  );

  console.log(
    "SOURCES"
  );

  console.log(
    "==============================\n"
  );

  result.sources.forEach(
    (source, index) => {
      console.log(
        `${index + 1}. ${source.candidateName} (${source.score?.toFixed(3) ?? "N/A"})`
      );
    }
  );

}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});