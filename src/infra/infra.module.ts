import { Global, Module } from '@nestjs/common';
import PrismaModule from './database/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  exports: [PrismaModule],
})
export default class InfraModule {}
