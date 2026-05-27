import { z } from 'zod';

export const TroubleSchema = z.object({
  problem: z.string(),

  cause: z.string(),

  solution: z.string(),

  result: z.string().optional(),
});

export type Trouble = z.infer<typeof TroubleSchema>;