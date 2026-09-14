import { NextRequest, NextResponse } from "next/server";

import fs from "fs";
import path from "path";
import os from "os";

import { indexCV } from "@/rag/indexCV";

import {
  clearVectorStore,
  getVectorStore,
  saveVectorStore,
} from "@/rag/vectorStore";

export async function POST(
  request: NextRequest
) {
  try {
    const formData =
      await request.formData();

    const files =
      formData.getAll("files");

    if (!files.length) {
      return NextResponse.json(
        {
          error:
            "No files uploaded.",
        },
        {
          status: 400,
        }
      );
    }

    const pdfFiles =
      files.filter(
        file =>
          file instanceof File &&
          file.type ===
            "application/pdf"
      ) as File[];

    if (!pdfFiles.length) {
      return NextResponse.json(
        {
          error:
            "Please upload PDF files.",
        },
        {
          status: 400,
        }
      );
    }

    // Start a fresh candidate pool.
    clearVectorStore();

    const results = [];

    for (const file of pdfFiles) {
      const buffer =
        Buffer.from(
          await file.arrayBuffer()
        );

      const tempPath =
        path.join(
          os.tmpdir(),
          `talentlens-${Date.now()}-${file.name}`
        );

      fs.writeFileSync(
        tempPath,
        buffer
      );

      const candidateId =
        path
          .basename(
            file.name,
            ".pdf"
          )
          .toLowerCase()
          .replace(
            /[^a-z0-9]+/g,
            "-"
          );

      const result =
        await indexCV(
          tempPath,
          candidateId
        );

      results.push({
        ...result,
        filename: file.name,
      });

      fs.unlinkSync(tempPath);
    }

    // Persist the candidate pool so that
    // /api/chat can access it.
    const vectorStorePath =
      path.join(
        process.cwd(),
        "generated",
        "session-vector-store.json"
      );

    saveVectorStore(
      vectorStorePath
    );

    console.log(
      `Indexed ${getVectorStore().length} chunks`
    );

    return NextResponse.json({
      success: true,
      candidateCount:
        results.length,
      chunkCount:
        getVectorStore().length,
      files: results,
    });
  } catch (error) {
    console.error(
      "Upload error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to process CVs.",
      },
      {
        status: 500,
      }
    );
  }
}