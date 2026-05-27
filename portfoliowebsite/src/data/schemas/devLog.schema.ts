import { z } from 'zod';

export const DevLogSchema = z.object({
    date: z.string(),

    title: z.string(),

    summary: z.string(),

    content: z.string(),

    tags: z.array(z.string()).default([]),
});

export type DevLog = z.infer<typeof DevLogSchema>;