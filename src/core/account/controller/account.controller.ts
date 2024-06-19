import {
  Body,
  Controller,
  HttpException,
  InternalServerErrorException,
  Logger,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import AccountService from '../service/account.service';
import { SignUpDto, SignUpVerifyDto } from '../dto';
import { ResponseInterceptor } from 'src/shared/interceptor';

@Controller({
  version: '1',
})
export default class AccountController {
  private readonly logger = new Logger(AccountController.name);

  constructor(private readonly accountService: AccountService) {}

  /*
   * for sign-up user account
   */
  @Post('/sign-up')
  @UseInterceptors(new ResponseInterceptor())
  async signUpAccount(@Body() dto: SignUpDto) {
    try {
      this.logger.log('Started executing AccountController->signUpAccount() ');
      await this.accountService.signUpUser(dto);
      return;
    } catch (e) {
      this.logger.error('Failed executing AccountController->signUpAccount() ');
      if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException('Unknown Error!');
    } finally {
      this.logger.log('Finished executing AccountController->signUpAccount() ');
    }
  }

  /*
   * for account verification
   */
  @Post('/verify-sign-up')
  @UseInterceptors(
    new ResponseInterceptor({
      message: 'Successfully Verified!',
    }),
  )
  async verifyAccountSignUp(@Body() dto: SignUpVerifyDto) {
    try {
      this.logger.log(
        'Started executing AcccountController->verifyAccountSignUp()',
      );
      await this.accountService.verifySignUpAccount(dto);
    } catch (e) {
      this.logger.error(
        'Failed executing AccountController->verifyAccountSignUp() ',
      );
      if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException('Unknown Error!');
    } finally {
      this.logger.log(
        'Finished executing AccountController->verifyAccountSignUp()',
      );
    }
  }
}
