import { Injectable, Logger } from '@nestjs/common';
import IApplicationRepository, {
  SaveParam,
} from '../application.repository.interface';
import PrismaService from 'src/infra/database/service/prisma.service';
import { Application } from '@prisma/client';

@Injectable()
export default class ApplicationRepository implements IApplicationRepository {
  private readonly logger = new Logger(ApplicationRepository.name);

  constructor(private readonly prismaService: PrismaService) {}

  async save(param: SaveParam): Promise<Application> {
    try {
      this.logger.log('Started executing save() with param');
      const result = await this.prismaService.application.create({
        data: {
          name: param.name,
          description: param.description,
          routeName: param.routeName,
          ownerId: param.ownerId,
        },
      });
      return result;
    } catch (e) {
      this.logger.error('Failed executing save() ', e);
    } finally {
      this.logger.log('Finished executing save() ');
    }
  }
}
