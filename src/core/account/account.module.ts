import { Module } from '@nestjs/common';
import AccountRepository from './repository/implementation/account.repository';
import AccountController from './controller/account.controller';
import AccountService from './service/account.service';
import IAccountRepository from './repository/account.repository.interface';
import AccountEventListener from './event-listener/account.event.listener';
import OTPModule from '../otp/otp.module';

@Module({
  imports: [OTPModule],
  controllers: [AccountController],
  providers: [
    {
      provide: IAccountRepository,
      useClass: AccountRepository,
    },
    AccountService,
    AccountEventListener,
  ],
  exports: [IAccountRepository],
})
export default class AccountModule {}
