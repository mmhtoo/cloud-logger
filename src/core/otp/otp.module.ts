import { Module } from '@nestjs/common';
import IOTPRepository from './repository/otp.repository.interface';
import OTPRepository from './repository/implementation/otp.repository';
import OTPService from './service/otp.service';

@Module({
  providers: [
    {
      provide: IOTPRepository,
      useClass: OTPRepository,
    },
    OTPService,
  ],
  exports: [OTPService],
})
export default class OTPModule {}
