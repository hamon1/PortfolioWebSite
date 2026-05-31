import z from "zod";

import rawCommissions
    from "../raw/commissions.json";

import {
    CommissionSchema,
} from "../schemas/commission.schema";

export const commissions = z.array(CommissionSchema).parse(rawCommissions);