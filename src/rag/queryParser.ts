import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type SearchQuery = {
  searchQuery: string;
  role?: string;
  location?: string;
};

export async function parseSearchQuery(
  question: string
): Promise<SearchQuery> {
  const response =
    await client.responses.create({
      model: "gpt-4.1",

      input: `
You are a recruiting search assistant.

Convert the recruiter's natural language request
into structured search criteria.

Available roles:
- Frontend
- Fullstack
- Backend
- UX/UI
- Data Scientist

The available candidate locations are:
- Barcelona
- Berlin
- Madrid
- Amsterdam
- Lisbon
- Paris
- Valencia
- Munich

Return ONLY valid JSON.

Use null when a filter is not specified.

The "searchQuery" should contain the semantic
part of the request that should be used for
vector similarity search.

Examples:

Request:
"Find frontend developers in Berlin with React experience"

Output:
{
  "searchQuery": "React frontend development experience",
  "role": "Frontend",
  "location": "Berlin"
}

Request:
"Who has experience with healthcare products?"

Output:
{
  "searchQuery": "healthcare products experience",
  "role": null,
  "location": null
}

Request:
"Find me a UX designer in Amsterdam"

Output:
{
  "searchQuery": "UX design",
  "role": "UX/UI",
  "location": "Amsterdam"
}

Recruiter's request:
${question}
`,

      text: {
        format: {
          type: "json_object",
        },
      },
    });

  return JSON.parse(
    response.output_text
  );
}