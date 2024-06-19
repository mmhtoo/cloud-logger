import { Account } from '@prisma/client';

export type SaveAccountParam = {
  username: string;
  email: string;
};

export default abstract class IAccountRepository {
  abstract save(param: SaveAccountParam): Promise<Account>;
  abstract findByEmail(email: string): Promise<Account>;
  abstract countByEmail(email: string): Promise<number>;
  abstract verifyAccount(accountId: string): Promise<void>;
  abstract findById(id: string): Promise<Account | null>;
}
