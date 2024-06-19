import { Injectable, Logger } from '@nestjs/common';
import IAccountRepository from '../repository/account.repository.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ACCOUNT_EVENTS } from '../event-listener/account.event.listener';
import OTPService from 'src/core/otp/service/otp.service';
import { OTPPurpose } from '@prisma/client';

type SignUpUserParam = {
  username: string;
  email: string;
};

type VerifySignUpParam = {
  accountId: string;
  code: string;
};

@Injectable()
export default class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly otpService: OTPService,
  ) {}

  // will create account with verified false and emit on.signup event
  async signUpUser(param: SignUpUserParam) {
    try {
      // save user to database
      const savedAccount = await this.accountRepository.save(param);
      // emit event to send vefication email
      this.eventEmitter.emit(ACCOUNT_EVENTS.ON_SIGN_UP, {
        accountId: savedAccount.id,
        email: param.email,
        username: param.username,
      });
      return savedAccount;
    } catch (e) {
      this.logger.error('Failed executing AccountService->signUpUser() ', e);
      throw e;
    } finally {
      this.logger.log('Finished executing AccountService->signUpUser() ');
    }
  }

  // will return true if email has already existed
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      this.logger.log(
        'Started executing AccountService->checkEmailExists() with param ',
        email,
      );
      // get count with email
      const count = await this.accountRepository.countByEmail(email);
      // email is already used if email count in db is greater than zero
      return count > 0;
    } catch (e) {
      this.logger.error(
        'Failed executing AccountService->checkEmailExists() ',
        e,
      );
      throw e;
    } finally {
      this.logger.log('Finished executing AccountService->checkEmailExists() ');
    }
  }

  // will verify account sign up with code
  async verifySignUpAccount(param: VerifySignUpParam): Promise<void> {
    try {
      this.logger.log(
        'Started executing AccountService->verifySignUpAccount() with param ',
        JSON.stringify(param, null, 2),
      );
      // consume otp service to verify
      await this.otpService.verifyOTP({
        accountId: param.accountId,
        code: param.code,
        purpose: OTPPurpose.ACCOUNT_VERIFY,
      });
      // update account verify status
      await this.accountRepository.verifyAccount(param.accountId);
    } catch (e) {
      this.logger.error(
        'Failed executing AccountService->verifySignUpAccount() ',
        e,
      );
      throw e;
    } finally {
      this.logger.log(
        'Finished executing AccountService->verifySignUpAccount() ',
      );
    }
  }
}
