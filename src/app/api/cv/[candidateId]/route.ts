import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type RouteContext = {
  params: Promise<{
    candidateId: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const { candidateId } =
      await params;

    // Only allow the candidate IDs used by
    // the generated CV filenames.
    if (
      !/^[a-z0-9-]+$/.test(candidateId)
    ) {
      return NextResponse.json(
        {
          error: "Invalid candidate ID.",
        },
        { status: 400 },
      );
    }

    const pdfPath = path.join(
      process.cwd(),
      "generated",
      "pdfs",
      `${candidateId}.pdf`,
    );

    if (!fs.existsSync(pdfPath)) {
      return NextResponse.json(
        {
          error: "CV not found.",
        },
        { status: 404 },
      );
    }

    const pdf = fs.readFileSync(
      pdfPath,
    );

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${candidateId}.pdf"`,
        "Cache-Control":
          "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error(
      "CV preview error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load CV.",
      },
      { status: 500 },
    );
  }
}