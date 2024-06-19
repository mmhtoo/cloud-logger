import { Injectable, Logger } from '@nestjs/common';
import IOTPRepository from '../repository/otp.repository.interface';
import { OTP, OTPPurpose } from '@prisma/client';
import { generate } from 'otp-generator';

type GenerateOTPParam = {
  accountId: string;
  purpose: OTPPurpose;
  expiredAt: Date;
};

@Injectable()
export default class OTPService {
  private readonly logger = new Logger(OTPService.name);

  constructor(private readonly otpRepository: IOTPRepository) {}

  async generateOTP(param: GenerateOTPParam): Promise<OTP> {
    try {
      this.logger.log(
        'Started executing OTPService->generateOTP() with param  ',
        JSON.stringify(param, null, 2),
      );
      // generate code
      const code = generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        digits: true,
        lowerCaseAlphabets: false,
      });
      // save to database
      return this.otpRepository.save({
        code,
        accountId: param.accountId,
        expiredAt: param.expiredAt,
        purpose: param.purpose,
      });
    } catch (e) {
      this.logger.error('Failed executing OTPService->generateOTP() ', e);
      throw e;
    } finally {
      this.logger.log('Finsihed executing OTPService->generateOTP() ');
    }
  }
}
