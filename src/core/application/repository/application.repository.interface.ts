import { Application } from '@prisma/client';

export type SaveParam = {
  name: string;
  description?: string;
  routeName: string;
  ownerId: string;
};

export type FindByOwnerIdParam = {
  ownerId: string;
  page: number;
  size: number;
};

export default abstract class IApplicationRepository {
  abstract save(param: SaveParam): Promise<Application>;
  abstract findByOwnerId(param: FindByOwnerIdParam): Promise<Application[]>;
  abstract countByOwnerId(ownerId: string): Promise<number>;
  abstract findById(id: string): Promise<Application | null>;
}
