import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import PrismaService from 'src/infra/database/service/prisma.service';
import IAccountRepository, {
  SaveAccountParam,
} from '../account.repository.interface';
import { Account } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export class DuplicateEmailException extends BadRequestException {
  constructor(message = 'Email has already used!') {
    super(message);
  }
}

@Injectable()
export default class AccountRepository implements IAccountRepository {
  private readonly logger = new Logger(AccountRepository.name);

  constructor(private readonly prismaService: PrismaService) {}

  async save(param: SaveAccountParam): Promise<Account> {
    try {
      this.logger.log(
        'Started executing AccountRepository->save() with param ',
        JSON.stringify(param, null, 2),
      );
      // save to database
      const savedAccount = await this.prismaService.account.create({
        data: {
          username: param.username,
          email: param.email,
        },
      });

      // return result
      return savedAccount;
    } catch (e) {
      this.logger.error('Failed executing AccountRepository->save() ', e);
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new DuplicateEmailException();
        }
      }
      throw e;
    } finally {
      this.logger.log('Finished executing AccountRepository->save() ');
    }
  }

  async findByEmail(email: string): Promise<Account> {
    try {
      this.logger.log(
        'Started executing AccountRepository->findByEmail() with param ',
        email,
      );
      return this.prismaService.account.findUnique({
        where: {
          email,
        },
      });
    } catch (e) {
      this.logger.error(
        'Failed executing AccountRepository->findByEmail() ',
        e,
      );
      throw e;
    } finally {
      this.logger.log('Finished executing AccountRepository->findByEmail()');
    }
  }

  async countByEmail(email: string): Promise<number> {
    try {
      this.logger.log(
        'Started executing AccountRepository->countByEmail() with param ',
        email,
      );
      // count from database
      const count = await this.prismaService.account.count({
        where: {
          email,
        },
      });
      return count;
    } catch (e) {
      this.logger.error(
        'Failed executing AccountRepository->countByEmail() ',
        e,
      );
      throw e;
    } finally {
      this.logger.log('Finished executing AccountRepository->countByEmail() ');
    }
  }

  async verifyAccount(accountId: string): Promise<void> {
    try {
      const transaction = this.prismaService.account.update({
        where: {
          id: accountId,
          hasEmailVerified: false,
        },
        data: {
          hasEmailVerified: true,
        },
      });
      await this.prismaService.$transaction([transaction]);
    } catch (e) {
      this.logger.error(
        'Failed executing AccountRepository->verifyAccount() ',
        e,
      );
      throw e;
    } finally {
      this.logger.log('Finished executing AccountRepository->verifyAccount() ');
    }
  }

  async findById(accountId: string): Promise<Account | null> {
    try {
      this.logger.log(
        'Started executing AccountRepository->findById() with param ',
        accountId,
      );
      const savedAccount = await this.prismaService.account.findUnique({
        where: {
          id: accountId,
        },
      });
      return savedAccount;
    } catch (e) {
      this.logger.error('Failed executing AccountRepository->findById() ', e);
      throw e;
    } finally {
      this.logger.log('Finished executing AccountRepository->findById() ');
    }
  }
}
