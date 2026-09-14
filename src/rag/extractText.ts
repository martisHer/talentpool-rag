import fs from "fs";
import { PDFParse } from "pdf-parse";

export async function extractPDFText(
  pdfPath: string
) {
  const buffer =
    fs.readFileSync(pdfPath);

  const parser = new PDFParse({
    data: buffer,
  });

  try {
    const result =
      await parser.getText();

    return result.text;
  } finally {
    await parser.destroy();
  }
}

export async function extractAllCVs() {
  const path =
    await import("path");

  const pdfDirectory =
    path.join(
      process.cwd(),
      "generated",
      "pdfs"
    );

  const files =
    fs
      .readdirSync(pdfDirectory)
      .filter(file =>
        file.endsWith(".pdf")
      );

  const documents = [];

  for (const file of files) {
    const pdfPath =
      path.join(
        pdfDirectory,
        file
      );

    console.log(
      `Extracting ${file}...`
    );

    const text =
      await extractPDFText(
        pdfPath
      );

    documents.push({
      file,
      text,
    });
  }

  return documents;
}