import rawDevLogs from '../raw/devLogs.json';
import { DevLogSchema } from '../schemas/devLog.schema';

export const devLogs = DevLogSchema.array().parse(rawDevLogs);