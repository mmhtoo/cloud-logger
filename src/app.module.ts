import { Module } from '@nestjs/common';
import SharedModule from './shared/shared.module';
import InfraModule from './infra/infra.module';
import AccountModule from './core/account/account.module';

@Module({
  imports: [SharedModule, InfraModule, AccountModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
