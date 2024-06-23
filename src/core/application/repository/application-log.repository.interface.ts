import { ApplicationLog, LogType } from '@prisma/client';

export type SaveParam = {
  logType: LogType;
  message: string;
  detailContent: string;
  applicationId: string;
  applicationKeyId: string;
  metadata?: string;
};

export type FindByAppIdParam = {
  appId: string;
  page: number;
  size: number;
  ownerId: string;
};

export type CountByAppIdParam = {
  appId: string;
  ownerId: string;
};

export default abstract class IApplicationLogRepository {
  abstract save(param: SaveParam): Promise<ApplicationLog>;
  abstract findByAppId(param: FindByAppIdParam): Promise<ApplicationLog[]>;
  abstract countByAppId(param: CountByAppIdParam): Promise<number>;
}
