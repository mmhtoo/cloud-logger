import { Application } from '@prisma/client';

export type SaveParam = {
  name: string;
  description?: string;
  routeName: string;
  ownerId: string;
};

export default abstract class IApplicationRepository {
  abstract save(param: SaveParam): Promise<Application>;
}
