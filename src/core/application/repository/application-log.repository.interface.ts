import { ApplicationLog, LogType } from '@prisma/client';

export type SaveParam = {
  logType: LogType;
  message: string;
  detailContent: string;
  applicationId: string;
  applicationKeyId: string;
  metadata?: string;
};

export default abstract class IApplicationLogRepository {
  abstract save(param: SaveParam): Promise<ApplicationLog>;
}
