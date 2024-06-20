import { Injectable, Logger } from '@nestjs/common';
import IApplicationRepository, {
  FindByOwnerIdParam,
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

  async findByOwnerId(param: FindByOwnerIdParam): Promise<Application[]> {
    try {
      this.logger.log('Started executing findByOwnerId() with param ');
      const page = Number(param.page);
      const size = Number(param.size);
      const result = await this.prismaService.application.findMany({
        where: {
          ownerId: param.ownerId,
        },
        take: size,
        skip: (Number(page) - 1) * Number(size),
      });
      return result;
    } catch (e) {
      this.logger.error('Failed executing findByOwnerId() ', e);
      throw e;
    } finally {
      this.logger.log('Finished executing findByOwnerId() ');
    }
  }

  async countByOwnerId(ownerId: string): Promise<number> {
    try {
      this.logger.log(
        'Started executing countByOwnerId() with param ',
        ownerId,
      );
      const count = await this.prismaService.application.count({
        where: {
          ownerId,
        },
      });
      return count;
    } catch (e) {
      this.logger.error('Failed executing countByOwnerId() ', e);
      throw e;
    } finally {
      this.logger.log('Finished executing countByOwnerId() ');
    }
  }
}
