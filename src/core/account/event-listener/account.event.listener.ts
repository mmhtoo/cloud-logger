import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OTPPurpose } from '@prisma/client';
import * as dayjs from 'dayjs';
import OTPService from 'src/core/otp/service/otp.service';
import IMailService from 'src/infra/mailer/service/mail.service.interface';
import { TEMPLATES } from 'src/shared/constant';

export const ACCOUNT_EVENTS = {
  ON_SIGN_UP: 'on.signup',
};

export type OnSignUpPayload = {
  accountId: string;
  email: string;
  username: string;
};

@Injectable()
export default class AccountEventListener {
  private readonly logger = new Logger(AccountEventListener.name);

  constructor(
    private readonly mailService: IMailService,
    private readonly otpService: OTPService,
  ) {}

  @OnEvent(ACCOUNT_EVENTS.ON_SIGN_UP, { async: true })
  async onSignUp(payload: OnSignUpPayload) {
    try {
      const { email, accountId, username } = payload;
      // generate and save otp to database
      const savedOTP = await this.otpService.generateOTP({
        accountId,
        purpose: OTPPurpose.ACCOUNT_VERIFY,
        expiredAt: dayjs().add(1, 'day').toDate(),
      });
      // prepare mail
      const mailContent = TEMPLATES.ACCOUNT_VERIFY.replace(
        '{{NOW}}',
        dayjs().format('D MMM, YYYY'),
      )
        .replace('{{NAME}}', username)
        .replace('{{CODE}}', savedOTP.code);
      // send mail
      this.mailService.sendMail({
        from: 'mmhtoo.dev@gmail.com', // to change later,
        to: email,
        subject: 'OTP for your account Verification!',
        content: mailContent,
      });
    } catch (e) {
      this.logger.error(
        'Failed executing AccountEventListener->onSignUp() ',
        e,
      );
    } finally {
      this.logger.log('Finished executing AccountEventListener->onSignUp() ');
    }
  }
}
