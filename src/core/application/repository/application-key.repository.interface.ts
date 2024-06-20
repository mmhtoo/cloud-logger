import { ApplicationKey } from '@prisma/client';

export type SaveParam = {
  name: string;
  credential: string;
  applicationId: string;
  description?: string;
};

export default abstract class IApplicationKeyRepository {
  abstract save(param: SaveParam): Promise<ApplicationKey>;
}