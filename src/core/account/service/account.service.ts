import { Injectable, Logger } from '@nestjs/common';
import IAccountRepository from '../repository/account.repository.interface';
import { CODE } from 'src/shared/constant';
import dayjs from 'dayjs';
import { OTPPurpose } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ACCOUNT_EVENTS } from '../event-listener/account.event.listener';

type SignUpUserParam = {
  username: string;
  email: string;
};

@Injectable()
export default class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

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
}
