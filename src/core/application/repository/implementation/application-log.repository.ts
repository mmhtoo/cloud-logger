import { Injectable, Logger } from '@nestjs/common';
import IApplicationLogRepository, {
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
}
