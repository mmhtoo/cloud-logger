import { Injectable, Logger } from '@nestjs/common';
import IOTPRepository, { SaveOTPParam } from '../otp.repository.interface';
import PrismaService from 'src/infra/database/service/prisma.service';
import { OTP } from '@prisma/client';

@Injectable()
export default class OTPRepository implements IOTPRepository {
  private readonly logger = new Logger(OTPRepository.name);

  constructor(private readonly prismaService: PrismaService) {}

  async save(param: SaveOTPParam): Promise<OTP> {
    try {
      const result = await this.prismaService.oTP.create({
        data: {
          code: param.code,
          accountId: param.accountId,
          expiredAt: param.expiredAt,
          purpose: param.purpose,
        },
      });
      return result;
    } catch (e) {
      this.logger.error('Failed executing OTPRepository->save() ', e);
      throw e;
    } finally {
      this.logger.log('Finished executing OTPRepository->save()');
    }
  }

  async findLastOTPByAccountId(accountId: string): Promise<OTP | null> {
    try {
      const savedOTPs = await this.prismaService.oTP.findFirst({
        where: {
          accountId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return savedOTPs;
    } catch (e) {
      this.logger.error(
        'Failed executing OTPRepository->findLastOTPByAccountId() ',
        e,
      );
      throw e;
    } finally {
      this.logger.log(
        'Finished executing OTPRepository->findLastOTPByAccountId()',
      );
    }
  }

  async claimOTPById(id: number): Promise<void> {
    try {
      await this.prismaService.oTP.update({
        where: {
          id,
        },
        data: {
          hasClaimed: true,
        },
      });
    } catch (e) {
      this.logger.error('Failed executing OTPRepository->claimOTPById() ', e);
      throw e;
    } finally {
      this.logger.log('Finished executing OTPRepository->claimOTPById() ');
    }
  }
}
