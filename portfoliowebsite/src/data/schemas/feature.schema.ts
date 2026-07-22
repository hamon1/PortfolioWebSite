import { z } from 'zod';

export const FeatureSchema = z.object({
  title: z.string(),
  description: z.string(),
  intent: z.string().optional(),
  priority: z.enum(['core', 'extension']).optional(),
});

export type Feature = z.infer<typeof FeatureSchema>;