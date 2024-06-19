import { Global, Module } from '@nestjs/common';
import PrismaModule from './database/prisma.module';
import MailerModule from './mailer/mailer.module';

@Global()
@Module({
  imports: [PrismaModule, MailerModule],
  exports: [PrismaModule, MailerModule],
})
export default class InfraModule {}
