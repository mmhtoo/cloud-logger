import { Inject, Injectable, Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import IMailService, { SendMailParam } from '../mail.service.interface';
import { MAILER } from '../../factory/mail-transporter.factory';

@Injectable()
export default class MailService implements IMailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    @Inject(MAILER)
    private readonly transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>,
  ) {}

  async sendMail(param: SendMailParam) {
    try {
      this.logger.log(
        'Started executing MailService->sendMail() with param ',
        JSON.stringify(param, null, 2),
      );
      await this.transporter.sendMail({
        to: param.to,
        subject: param.subject,
        from: param.from,
        html: param.content,
      });
    } catch (e) {
      this.logger.error('Failed executing MailService->sendMail() ', e);
      throw e;
    } finally {
      this.logger.log('Finished executing MailService->sendMail() ');
    }
  }
}
