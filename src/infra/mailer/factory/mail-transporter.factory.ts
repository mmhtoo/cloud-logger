import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export const MAILER = 'mailer';

export function mailTransporterFactory(configService: ConfigService) {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: configService.get('SMTP_MAIL'),
      pass: configService.get('SMTP_PASSWORD'),
    },
  });
}
