import { ApplicationLog } from '@prisma/client';

type SaveParam = {};

export default abstract class IApplicationLogRepository {
  abstract save(): Promise<ApplicationLog>;
}
