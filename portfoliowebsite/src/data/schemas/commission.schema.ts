import { z } from "zod";

export const CommissionSchema = z.object({
    id: z.string(),

    type: z.enum([
        "character",
        "illustration",
        "emote",
        "live2d",
        "concept-art",
        "other",
    ]),

    year: z.number(),

    isCommission: z.boolean(),

    thumbnail: z.string(),

    image: z.string(),

    tags: z.array(
        z.string()
    ),

    description: z.string().optional(),
});

export type Commission = z.infer<
    typeof CommissionSchema
>;