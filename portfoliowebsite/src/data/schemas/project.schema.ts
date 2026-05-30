import { z } from 'zod';

import { DemoSchema } from './demo.schema';
import { DevLogSchema } from './devLog.schema';
import { FeatureSchema } from './feature.schema';
import { TroubleSchema } from './trouble.schema';

export const ProjectSchema = z.object({
    id: z.string(),

    title: z.string(),

    shortDescription: z.string(),

    description: z.string(),

    thumbnail: z.string(),

    period: z.string(),

    teamSize: z.string(),

    role: z.string(),

    techStack: z.array(z.string()),

    githubUrl: z.string().url().optional(),

    deployUrl: z.string().url().or(z.literal("")),

    features: z.array(FeatureSchema),

    demos: z.array(DemoSchema),

    devLogs: z.array(DevLogSchema),

    troubles: z.array(TroubleSchema),

    retrospective: z.string().optional(),

    featured: z.boolean().default(false),
});

export type Project = z.infer<typeof ProjectSchema>;