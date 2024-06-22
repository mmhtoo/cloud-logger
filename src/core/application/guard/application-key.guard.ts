import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import ApplicationService from '../service/application.service';

export const APP_KEY_DATA = 'appKey';
export const APP_KEY_TOKEN = 'appKeyToken';

@Injectable()
export default class ApplicationKeyGuard implements CanActivate {
  private readonly logger = new Logger(ApplicationKeyGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly applicationService: ApplicationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      this.logger.log('Started executing canActive() ');
      const http = context.switchToHttp();
      const request = http.getRequest<Request>();
      const bearToken = request.headers['authorization'];
      const token = this.retrieveTokenFromBearToken(bearToken);

      // check jwt token sign
      const decodedToken = await this.jwtService.verifyAsync(token);
      // append to request header
      request[APP_KEY_DATA] = decodedToken;
      request[APP_KEY_TOKEN] = token;

      // check valid app
      const appId: string = request.params['appId'];
      const savedAppInstance =
        await this.applicationService.getApplicationById(appId);

      if (!savedAppInstance) {
        throw new UnprocessableEntityException('Unknown app to process!');
      }

      // check valid app key
      const credentialId: string | undefined = request.body['credentialId'];
      if (!credentialId) {
        throw new UnauthorizedException('Require credential id to access!');
      }
      const savedAppKey =
        await this.applicationService.getApplicationKeyById(credentialId);
      // if key does not exist or
      // if key's app id and accessing app id is not same or
      // if saved credential and actually using credential are not same
      // if key is disable
      if (
        !savedAppKey ||
        savedAppKey.applicationId !== appId ||
        savedAppKey.credential !== token ||
        savedAppKey.isDisable
      ) {
        throw new UnprocessableEntityException('Invalid credential for app!');
      }

      return true;
    } catch (e) {
      this.logger.error('Failed executing canActive() ', e);
      throw new UnauthorizedException('Invalid app key to access!');
    } finally {
      this.logger.log('Finished executing canActive() ');
    }
  }

  private retrieveTokenFromBearToken(bearToken?: string): string | null {
    return bearToken ? bearToken.slice(7) : null;
  }
}
