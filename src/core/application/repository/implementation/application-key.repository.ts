import { Injectable, Logger } from '@nestjs/common';
import IApplicationKeyRepository, {
  SaveParam,
} from '../application-key.repository.interface';
import PrismaService from 'src/infra/database/service/prisma.service';
import { ApplicationKey } from '@prisma/client';

@Injectable()
export default class ApplicationKeyRepository
  implements IApplicationKeyRepository
{
  private readonly logger = new Logger(ApplicationKeyRepository.name);
  constructor(private readonly prismaService: PrismaService) {}

  async save(param: SaveParam): Promise<ApplicationKey> {
    try {
      this.logger.log(
        'Started executing save() with param ',
        JSON.stringify(param, null, 2),
      );
      const savedKey = await this.prismaService.applicationKey.create({
        data: {
          name: param.name,
          description: param.description,
          credential: param.credential,
          applicationId: param.applicationId,
        },
      });
      return savedKey;
    } catch (e) {
      this.logger.error('Failed executing save() ', e);
      throw e;
    } finally {
      this.logger.log('Finished executing save()');
    }
  }
}