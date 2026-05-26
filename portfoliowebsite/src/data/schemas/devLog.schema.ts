import { z } from 'zod';

export const DevLogSchema = z.object({
    id: z.string(),
    title: z.string(),
    date: z.string(),
    problem: z.string(),
    cause: z.string(),
    solution: z.string(),
    result: z.string(),
    tags: z.array(z.string())
});

export type DevLog = z.infer<typeof DevLogSchema>;