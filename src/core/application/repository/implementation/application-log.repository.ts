import { Injectable } from '@nestjs/common';
import IApplicationLogRepository from '../application-log.repository.interface';
import PrismaService from 'src/infra/database/service/prisma.service';

@Injectable()
export default class ApplicationLogRepository
  implements IApplicationLogRepository
{
  constructor(private readonly prismaService: PrismaService) {}
}
