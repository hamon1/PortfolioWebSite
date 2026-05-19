import rawProjects from '../raw/projects.json';
import { ProjectSchema } from '../schemas/project.schema';

export const projects = ProjectSchema.array().parse(rawProjects);