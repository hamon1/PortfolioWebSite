import rawTravelBuddy from '../raw/travelbuddy.json';
import rawFocat from '../raw/focat.json';
import rawFeathertales from '../raw/feathertales.json';
import rawProjectWebsite from '../raw/projectWebsite.json';

import { ProjectSchema } from '../schemas/project.schema';

export const projects = [
    ProjectSchema.parse(rawTravelBuddy),
    ProjectSchema.parse(rawFocat),
    ProjectSchema.parse(rawFeathertales),
    ProjectSchema.parse(rawProjectWebsite)
]