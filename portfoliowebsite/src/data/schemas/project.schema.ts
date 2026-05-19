import { z } from 'zod';

export const ProjectSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    thumbnail: z.string(),
    tags: z.array(z.string()),
    github: z.string().url(),
    featured: z.boolean(),
});

export type Project = z.infer<typeof ProjectSchema>;