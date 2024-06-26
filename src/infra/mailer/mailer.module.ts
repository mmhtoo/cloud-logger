import { Module } from '@nestjs/common';
import {
  MAILER,
  mailTransporterFactory,
} from './factory/mail-transporter.factory';
import IMailService from './service/mail.service.interface';
import MailService from './service/impl/mail.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: MAILER,
      useFactory: mailTransporterFactory,
      inject: [ConfigService],
    },
    {
      provide: IMailService,
      useClass: MailService,
    },
  ],
  exports: [IMailService],
})
export default class MailerModule {}
