import { Module } from '@nestjs/common';
import ApplicationService from './service/application.service';
import IApplicationRepository from './repository/application.repository.interface';
import ApplicationRepository from './repository/implementation/application.repository';
import ApplicationController from './controller/application.controller';
import AuthModule from '../auth/auth.module';
import IApplicationKeyRepository from './repository/application-key.repository.interface';
import ApplicationKeyRepository from './repository/implementation/application-key.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import IApplicationLogRepository from './repository/application-log.repository.interface';
import ApplicationLogRepository from './repository/implementation/application-log.repository';
import ApplicationKeyGuard from './guard/application-key.guard';

@Module({
  imports: [
    AuthModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_APP_KEY_SECRET'),
        signOptions: {
          issuer: process.env.JWT_ISSUER || 'Issuer',
          algorithm: 'HS256',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ApplicationController],
  providers: [
    ApplicationService,
    {
      provide: IApplicationRepository,
      useClass: ApplicationRepository,
    },
    {
      provide: IApplicationKeyRepository,
      useClass: ApplicationKeyRepository,
    },
    {
      provide: IApplicationLogRepository,
      useClass: ApplicationLogRepository,
    },
    ApplicationKeyGuard,
  ],
})
export default class ApplicationModule {}
