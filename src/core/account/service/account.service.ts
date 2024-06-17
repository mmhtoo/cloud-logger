import { Injectable, Logger } from '@nestjs/common';
import IAccountRepository from '../repository/account.repository.interface';
import { CODE } from 'src/shared/constant';

type SignUpUserParam = {
  username: string;
  email: string;
};

@Injectable()
export default class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(private readonly accountRepository: IAccountRepository) {}

  async signUpUser(param: SignUpUserParam) {
    try {
      // save to database
      await this.accountRepository.save(param);
      // send verification email

      // return success
      return CODE.SUCCESS;
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
