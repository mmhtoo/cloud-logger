import { Module } from '@nestjs/common';
import AccountRepository from './repository/implementation/account.repository';
import AccountController from './controller/account.controller';
import AccountService from './service/account.service';
import IAccountRepository from './repository/account.repository.interface';

@Module({
  controllers: [AccountController],
  providers: [
    {
      provide: IAccountRepository,
      useClass: AccountRepository,
    },
    AccountService,
  ],
})
export default class AccountModule {}
