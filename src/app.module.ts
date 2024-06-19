import { Module } from '@nestjs/common';
import SharedModule from './shared/shared.module';
import InfraModule from './infra/infra.module';
import AccountModule from './core/account/account.module';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    SharedModule,
    InfraModule,
    EventEmitterModule.forRoot({
      delimiter: '.',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AccountModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
