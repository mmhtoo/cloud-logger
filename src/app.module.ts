import { Module } from '@nestjs/common';
import SharedModule from './shared/shared.module';
import InfraModule from './infra/infra.module';
import AccountModule from './core/account/account.module';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import AuthModule from './core/auth/auth.module';
import ApplicationModule from './core/application/application.module';

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
    AuthModule,
    ApplicationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
