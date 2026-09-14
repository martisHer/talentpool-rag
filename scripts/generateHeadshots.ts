import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import OpenAI from "openai";
import fs from "fs";
import path from "path";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const jsonDirectory = path.join(
  process.cwd(),
  "generated",
  "json"
);

const photosDirectory = path.join(
  process.cwd(),
  "generated",
  "photos"
);

fs.mkdirSync(photosDirectory, {
  recursive: true,
});

async function generateHeadshot(
  candidate: {
    id: string;
    name: string;
    role: string;
  }
) {
  console.log(
    `Generating headshot for ${candidate.name}...`
  );

  const response = await client.images.generate({
    model: "gpt-image-1",

    prompt: `
Create a realistic professional CV headshot of a fictional person.

The person is:
- Name: ${candidate.name}
- Profession: ${candidate.role}

Style:
- professional European technology professional
- natural facial expression
- approachable and confident
- head and shoulders portrait
- looking at the camera
- neutral modern background
- soft natural studio lighting
- realistic photography
- suitable for a professional CV
- no text
- no logos
- no accessories that distract from the face

The person must look like a real individual, not a model or celebrity.
Do not make the image overly polished or artificial.
`,

    size: "1024x1024",
    quality: "low",
  });

  const imageBase64 = response.data?.[0]?.b64_json;

  if (!imageBase64) {
    throw new Error(
      `No image returned for ${candidate.name}`
    );
  }

  const imageBuffer = Buffer.from(
    imageBase64,
    "base64"
  );

  const outputPath = path.join(
    photosDirectory,
    `${candidate.id}.png`
  );

  fs.writeFileSync(outputPath, imageBuffer);

  console.log(`✓ Saved ${outputPath}`);
}

async function main() {
  const files = fs
    .readdirSync(jsonDirectory)
    .filter((file) => file.endsWith(".json"));

  console.log(
    `Found ${files.length} candidates`
  );

  for (const file of files) {
    const filePath = path.join(
      jsonDirectory,
      file
    );

    const candidate = JSON.parse(
      fs.readFileSync(filePath, "utf-8")
    );

    await generateHeadshot(candidate);
  }

  console.log(
    `\n✓ Generated ${files.length} headshots`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});