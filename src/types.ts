import { z } from "zod";

export const CandidateSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  location: z.string(),

  email: z.string().email(),
  phone: z.string(),
  linkedin: z.string(),

  summary: z.string(),

  languages: z.array(
    z.object({
      name: z.string(),
      level: z.string(),
    })
  ),

  skills: z.array(z.string()),

  experience: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      start: z.string(),
      end: z.string(),
      description: z.array(z.string()),
    })
  ),

  education: z.array(
    z.object({
      university: z.string(),
      degree: z.string(),
      start: z.string(),
      end: z.string(),
    })
  ),
});

export type Candidate = z.infer<typeof CandidateSchema>;