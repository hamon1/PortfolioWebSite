import { z } from 'zod';

import { DemoSchema } from './demo.schema';
// import { DevLogSchema } from './devLog.schema';
import { FeatureSchema } from './feature.schema';
import { TroubleSchema } from './trouble.schema';

const ProblemStatementSchema = z.object({
    background: z.string(),
    painPoint: z.string(),
    goal: z.string(),
});

const TechItemSchema = z.object({
    name: z.string(),
    reason: z.string(),
});

const DomainInsightSchema = z.object({
    observation: z.string(),
    impact: z.string(),
});

const ValidationSchema = z.object({
    deployed: z.boolean(),
    userCount: z.string().optional(),
    feedback: z.string().optional(),
    learnings: z.string().optional(),
});

export const ProjectSchema = z.object({
    id: z.string(),

    title: z.string(),

    githubRepo: z.string(),

    shortDescription: z.string(),

    problemStatement: ProblemStatementSchema,

    thumbnail: z.string(),

    period: z.string(),

    teamSize: z.string(),

    role: z.string(),

    techStack: z.array(TechItemSchema),

    githubUrl: z.string().url().optional(),

    deployUrl: z.string().url().or(z.literal("")),

    features: z.array(FeatureSchema),

    demos: z.array(DemoSchema),

    // devLogs: z.array(DevLogSchema),

    troubles: z.array(TroubleSchema),

    domainInsights: z.array(DomainInsightSchema).optional(),

    validation: ValidationSchema.optional(),

    retrospective: z.string().optional(),

    featured: z.boolean().default(false),
});

export type Project = z.infer<typeof ProjectSchema>;