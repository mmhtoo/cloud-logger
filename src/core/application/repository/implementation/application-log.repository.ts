import { Injectable, Logger } from '@nestjs/common';
import IApplicationLogRepository, {
  CountByAppIdParam,
  FindByAppIdParam,
  SaveParam,
} from '../application-log.repository.interface';
import PrismaService from 'src/infra/database/service/prisma.service';
import { ApplicationLog } from '@prisma/client';

@Injectable()
export default class ApplicationLogRepository
  implements IApplicationLogRepository
{
  private readonly logger = new Logger(ApplicationLogRepository.name);

  constructor(private readonly prismaService: PrismaService) {}

  async save(param: SaveParam): Promise<ApplicationLog> {
    try {
      this.logger.log(
        'Started executing save() with param ',
        JSON.stringify(param, null, 2),
      );
      const {
        logType,
        message,
        detailContent,
        applicationId,
        applicationKeyId,
        metadata,
      } = param;
      const result = await this.prismaService.applicationLog.create({
        data: {
          logType,
          message,
          detailContent,
          applicationId,
          requestedKeyId: applicationKeyId,
          metadata,
        },
      });
      return result;
    } catch (e) {
      this.logger.error('Failed executing save() ', e);
      throw e;
    } finally {
      this.logger.log('Finished executing save() ');
    }
  }

  async findByAppId(param: FindByAppIdParam): Promise<ApplicationLog[]> {
    try {
      this.logger.log(
        'Started executing findByAppId() with param ',
        JSON.stringify(param, null, 2),
      );
      const { page, size, appId, ownerId } = param;
      const [parsedPage, parsedSize] = [Number(page), Number(size)];
      const applicationLogs = await this.prismaService.applicationLog.findMany({
        where: {
          applicationId: appId,
          application: {
            ownerId,
          },
        },
        take: parsedSize,
        skip: (parsedPage - 1) * parsedSize,
      });
      return applicationLogs;
    } catch (e) {
      this.logger.error('Failed executing findByAppId() ', e);
      throw e;
    } finally {
      this.logger.log('Finished executing findByAppId() ');
    }
  }

  async countByAppId(param: CountByAppIdParam): Promise<number> {
    try {
      this.logger.log(
        'Started executing countByAppId() with param ',
        JSON.stringify(param, null, 2),
      );
      const count = await this.prismaService.applicationLog.count({
        where: {
          applicationId: param.appId,
          application: {
            ownerId: param.ownerId,
          },
        },
      });
      return count;
    } catch (e) {
      this.logger.error('Failed executing countByAppId() ', e);
      throw e;
    } finally {
      this.logger.log('Finished executing countByAppId() ');
    }
  }
}
