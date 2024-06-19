import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import IOTPRepository from '../repository/otp.repository.interface';
import { OTP, OTPPurpose } from '@prisma/client';
import { generate } from 'otp-generator';
import * as dayjs from 'dayjs';

type GenerateOTPParam = {
  accountId: string;
  purpose: OTPPurpose;
  expiredAt: Date;
};

type VerifyOTPParam = {
  purpose: OTPPurpose;
  code: string;
  accountId: string;
};

class InvalidOTPException extends BadRequestException {
  constructor(message: string) {
    super(message);
    super.name = 'InvalidOTPException';
  }
}

@Injectable()
export default class OTPService {
  private readonly logger = new Logger(OTPService.name);

  constructor(private readonly otpRepository: IOTPRepository) {}

  // generate code and save to database
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

  // verify otp for account and will throw exception if went wrong
  async verifyOTP(param: VerifyOTPParam): Promise<void> {
    try {
      this.logger.log(
        'Started executing OTPService->verifyOTP() with param  ',
        JSON.stringify(param, null, 2),
      );
      // select last otp
      const savedOTP = await this.otpRepository.findLastOTPByAccountId(
        param.accountId,
      );
      // otp can't find or purpose is not same or code is not same or has claimed
      if (
        !savedOTP ||
        savedOTP.purpose !== param.purpose ||
        savedOTP.code !== param.code ||
        savedOTP.hasClaimed
      ) {
        throw new InvalidOTPException('Invalid OTP to verify!');
      }
      // otp expired
      if (!dayjs().isBefore(dayjs(savedOTP.expiredAt))) {
        throw new InvalidOTPException('Code has expired!');
      }
      // update claim status
      await this.otpRepository.claimOTPById(savedOTP.id);
    } catch (e) {
      this.logger.error('Failed executing OTPService->verifyOTP() ', e);
      throw e;
    } finally {
      this.logger.log('Finished executing OTPService->verifyOTP() ');
    }
  }
}
