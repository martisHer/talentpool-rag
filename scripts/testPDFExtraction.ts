import { extractAllCVs } from "../src/rag/extractText";

async function main() {
  const documents =
    await extractAllCVs();

  console.log(
    `\nFound ${documents.length} PDFs`
  );

  for (const document of documents.slice(0, 2)) {
    console.log("\n====================");
    console.log(document.file);
    console.log("====================\n");

    console.log(
      document.text.slice(0, 1000)
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});