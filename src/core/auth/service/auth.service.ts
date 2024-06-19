import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import IAccountRepository from 'src/core/account/repository/account.repository.interface';

class InvalidSignInException extends BadRequestException {
  constructor(message: string) {
    super(message);
    super.name = 'InvalidSignInException';
  }
}

@Injectable()
export default class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly jwtService: JwtService,
  ) {}

  // for sign in account
  async signInAccount(email: string): Promise<string> {
    try {
      this.logger.log(
        'Started executing AuthService->signInAccount() with param ',
        email,
      );
      const savedAccount = await this.accountRepository.findByEmail(email);

      // no account
      if (!savedAccount) {
        throw new InvalidSignInException('Invalid account!');
      }
      // not yet verify
      if (!savedAccount.hasEmailVerified) {
        throw new InvalidSignInException('Required to verify account!');
      }
      // TO DO : two step verification
      const access_token = await this.jwtService.signAsync({
        uid: savedAccount.id,
        username: savedAccount.username,
        email: savedAccount.email,
      });
      return access_token;
    } catch (e) {
      this.logger.error('Failed executing AuthService->signInAccount() ', e);
      throw e;
    } finally {
      this.logger.log('Finished executing AuthService->signInAccount() ');
    }
  }
}
