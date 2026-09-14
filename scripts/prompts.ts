export const SYSTEM_PROMPT = `
You are an expert recruiter and CV writer.

Your task is to generate realistic but completely fictional European
professional CV data.

IMPORTANT:
- All people and companies must be fictional.
- Do not use real people's personal information.
- Return ONLY valid JSON.
- Do not use Markdown.
- Write natural professional English.
- Make candidates internally consistent.
- Match experience, skills and education to the candidate's role.
- Avoid exaggerated achievements.
- Use realistic career progression.
`;

export function createCandidatePrompt(
  index: number,
  role: string,
  location: string
) {
  return `
Generate candidate ${index}.

Role:
${role}

Location:
${location}

The candidate should have between 3 and 8 years of professional experience.

Generate:

{
  "name": "...",
  "role": "...",
  "location": "...",
  "email": "...",
  "phone": "...",
  "linkedin": "...",
  "summary": "...",

  "languages": [
    {
      "name": "...",
      "level": "A1 | A2 | B1 | B2 | C1 | C2 | Native"
    }
  ],

  "skills": [],

  "experience": [
    {
      "company": "...",
      "role": "...",
      "start": "YYYY-MM",
      "end": "YYYY-MM | Present",
      "description": [
        "...",
        "...",
        "..."
      ]
    }
  ],

  "education": [
    {
      "university": "...",
      "degree": "...",
      "start": "YYYY",
      "end": "YYYY"
    }
  ]
}

Requirements:

- Include 2–4 previous jobs.
- Include 1–2 education entries.
- Include 6–12 relevant technical/professional skills.
- Include 2–4 languages.
- Use realistic European universities and companies.
- Vary the candidates' backgrounds.
- Some candidates should be stronger than others.
- Some should have English as C1/C2, others B1/B2.
- Do not make every candidate a perfect match for their role.
`;
}