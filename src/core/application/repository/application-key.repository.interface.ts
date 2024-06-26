import { ApplicationKey } from '@prisma/client';

export type SaveParam = {
  name: string;
  credential: string;
  applicationId: string;
  description?: string;
};

export type FindByAppIdParam = {
  appId: string;
  ownerId: string;
};

export type DisableKeyById = {
  appId: string;
  keyId: string;
  ownerId: string;
};

export default abstract class IApplicationKeyRepository {
  abstract save(param: SaveParam): Promise<ApplicationKey>;
  abstract findByAppId(param: FindByAppIdParam): Promise<ApplicationKey[]>;
  abstract disableKeyById(param: DisableKeyById): Promise<void>;
  abstract findById(id: string): Promise<ApplicationKey | null>;
}
