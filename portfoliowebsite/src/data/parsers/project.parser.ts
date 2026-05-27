import rawTravelBuddy from '../raw/travelbuddy.json';
import rawFocat from '../raw/focat.json';

import { ProjectSchema } from '../schemas/project.schema';

export const projects = [
    ProjectSchema.parse(rawTravelBuddy),
    ProjectSchema.parse(rawFocat)
]