import { OTP, OTPPurpose } from '@prisma/client';

export type SaveOTPParam = {
  code: string;
  accountId: string;
  purpose: OTPPurpose;
  expiredAt: Date;
};

export default abstract class IOTPRepository {
  abstract save(param: SaveOTPParam): Promise<OTP>;
  abstract findLastOTPByAccountId(accountId: string): Promise<OTP | null>;
  abstract claimOTPById(id: number): Promise<void>;
}
