import { NextRequest, NextResponse } from "next/server";

import fs from "fs";
import path from "path";

import { answerQuestion } from "@/rag/answer";
import {
  loadVectorStore,
} from "@/rag/vectorStore";

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const question =
      body.question;

    if (
      typeof question !== "string" ||
      !question.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Question is required.",
        },
        {
          status: 400,
        }
      );
    }

    // Load the candidate pool uploaded
    // by the recruiter.
    const vectorStorePath =
      path.join(
        process.cwd(),
        "generated",
        "session-vector-store.json"
      );

    if (
      !fs.existsSync(
        vectorStorePath
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Please upload CVs before searching.",
        },
        {
          status: 400,
        }
      );
    }

    const chunks =
      loadVectorStore(
        vectorStorePath
      );

    console.log(
      `Loaded ${chunks.length} CV chunks`
    );

    const result =
      await answerQuestion(
        question
      );

    return NextResponse.json(
      result
    );
  } catch (error) {
    console.error(
      "Chat API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while processing the request.",
      },
      {
        status: 500,
      }
    );
  }
}