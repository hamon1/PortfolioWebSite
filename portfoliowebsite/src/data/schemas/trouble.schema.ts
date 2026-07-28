import { z } from 'zod';

export const TroubleSchema = z.object({
  problem: z.string(),

  cause: z.string(),

  solution: z.string(),

  result: z.string().optional(),

  status: z.enum(['resolved', 'partial', 'unresolved']).optional(),

  date: z.string().optional(),

  commitHash: z.string().optional(),

  repo: z.string().optional(),

  codeSnippet: z.string().optional(),

  lesson: z.string().optional(),

  caveat: z.string().optional(),
});

export type Trouble = z.infer<typeof TroubleSchema>;