import * as nodemailer from 'nodemailer';

export const MAILER = 'mailer';

export function mailTransporterFactory() {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'mmhtoo.dev@gmail.com',
      pass: 'daaz vcjr zsde xrci',
    },
  });
}
