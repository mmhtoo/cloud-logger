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
import { SignUpDto } from '../dto';
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
      this.logger.log('Failed executing AccountController->signUpAccount() ');
      if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException('Unknown Error!');
    } finally {
      this.logger.log('Finished executing AccountController->signUpAccount() ');
    }
  }
}
