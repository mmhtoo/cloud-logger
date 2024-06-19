import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import AuthController from './controller/auth.controller';
import AccountModule from '../account/account.module';
import AuthService from './service/auth.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        signOptions: {
          issuer: process.env.JWT_ISSUER || 'Issuer',
          algorithm: 'HS256',
          expiresIn: process.env.JWT_EXPIRE_TIME || '15m',
        },
        secret: process.env.JWT_SECRET,
      }),
    }),
    AccountModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export default class AuthModule {}
