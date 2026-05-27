import { z } from 'zod';

export const FeatureSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export type Feature = z.infer<typeof FeatureSchema>;