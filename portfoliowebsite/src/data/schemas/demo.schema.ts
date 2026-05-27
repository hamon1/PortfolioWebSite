import { z } from 'zod';

export const DemoSchema = z.object({
    title: z.string(),

    type: z.enum([
        'image',
        'video',
        'gif',
        'code',
    ]),

    src: z.string(),

    description: z.string().optional(),
});

export type Demo = z.infer<typeof DemoSchema>;