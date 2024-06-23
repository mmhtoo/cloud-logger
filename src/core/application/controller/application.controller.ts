import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  InternalServerErrorException,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import ApplicationService from '../service/application.service';
import {
  CreateAppDto,
  CreateAppKeyDto,
  GetApplicationsDto,
  GetLogsDto,
  SaveLogDto,
} from '../dto';
import JwtGuard from 'src/core/auth/guard/jwt.guard';
import { ResponseInterceptor } from 'src/shared/interceptor';
import ApplicationKeyGuard, {
  APP_KEY_TOKEN,
} from '../guard/application-key.guard';

@Controller({
  version: '1',
  path: 'apps',
})
export default class ApplicationController {
  private readonly logger = new Logger(ApplicationController.name);

  constructor(private readonly applicationService: ApplicationService) {}

  // for creating new application
  @Post()
  @UseGuards(JwtGuard)
  @UseInterceptors(
    new ResponseInterceptor({
      responseType: 'data',
    }),
  )
  async createApplication(@Body() dto: CreateAppDto, @Request() req: any) {
    try {
      this.logger.log(
        'Started executing createApplication() with param ',
        JSON.stringify(dto, null, 2),
      );
      const result = await this.applicationService.createApplication({
        ...dto,
        ownerId: req.user ? req.user.uid : '',
      });
      return result;
    } catch (e) {
      this.logger.error('Failed executing createApplication() ');
      if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException('Unknown Error!');
    } finally {
      this.logger.log('Finished executing createApplication()');
    }
  }

  // for getting user's appilcations
  @Get()
  @UseGuards(JwtGuard)
  @UseInterceptors(
    new ResponseInterceptor({
      responseType: 'data',
    }),
  )
  async getApplications(
    @Request() req: any,
    @Query() queryData: GetApplicationsDto,
  ) {
    try {
      this.logger.log('Started executing getApplications() ');
      const result = await this.applicationService.getApplicationsByOwnerId({
        ownerId: req.user ? req.user.uid : '',
        page: queryData.page,
        size: queryData.size,
      });
      return result;
    } catch (e) {
      this.logger.error('Failed executing getApplications() ', e);
      throw e;
    } finally {
      this.logger.log('Finished executing getApplicatons() ');
    }
  }

  // for issuing new application key
  @Post('/:appId/keys')
  @UseGuards(JwtGuard)
  @UseInterceptors(
    new ResponseInterceptor({
      responseType: 'data',
    }),
  )
  async createNewApplicationKey(
    @Body() dto: CreateAppKeyDto,
    @Param('appId') appId: string,
    @Request() req,
  ) {
    try {
      this.logger.log(
        'Started executing createNewApplicationKey() with param ',
        JSON.stringify(dto, null, 2),
      );
      const result = await this.applicationService.createApplicationKey({
        name: dto.name,
        description: dto.description,
        applicationId: appId,
        ownerId: req.user ? req.user.uid : '',
      });
      return result;
    } catch (e) {
      this.logger.error('Failed executing createNewApplicationKey() ', e);
      throw e;
    } finally {
      this.logger.log('Finished executing createNewApplicationKey() ');
    }
  }

  // for getting application keys by app id
  @Get('/:appId/keys')
  @UseGuards(JwtGuard)
  @UseInterceptors(
    new ResponseInterceptor({
      responseType: 'data',
    }),
  )
  async getApplicationKeys(@Param('appId') appId: string, @Request() req) {
    try {
      this.logger.log(
        'Started executing getApplicationKeys() with param ',
        appId,
      );
      const result = await this.applicationService.getApplicationKeysByAppId({
        appId,
        ownerId: req.user ? req.user.uid : '',
      });
      return result;
    } catch (e) {
      this.logger.error('Failed executing getApplicationKeys() ', e);
      throw e;
    } finally {
      this.logger.log('Finished executing getApplicationKeys() ');
    }
  }

  // for disabling application key
  @Patch('/:appId/keys/:keyId/disable')
  @UseGuards(JwtGuard)
  @UseInterceptors(
    new ResponseInterceptor({
      responseType: 'info',
    }),
  )
  async disableApplicationKey(
    @Param('appId') appId: string,
    @Param('keyId') keyId: string,
    @Request() req,
  ) {
    try {
      this.logger.log('Started executing disableApplicatioKey() ');
      return await this.applicationService.disableApplicationKey({
        appId,
        keyId,
        ownerId: req.user ? req.user.uid : '',
      });
    } catch (e) {
      this.logger.error('Failed executing disableApplicationKey() ', e);
      throw e;
    } finally {
      this.logger.log('Finished executing disableApplicationKey() ');
    }
  }

  // for saving logs
  @Post('/:appId/logs')
  @UseInterceptors(
    new ResponseInterceptor({
      responseType: 'info',
    }),
  )
  @UseGuards(ApplicationKeyGuard)
  async saveLogToApplication(
    @Body() dto: SaveLogDto,
    @Param('appId') appId: string,
    @Headers(APP_KEY_TOKEN) appKeyToken: string,
  ) {
    try {
      this.logger.log(
        'Started executing saveLogToApplication() with param ',
        JSON.stringify(dto, null, 2),
      );
      const savedResult = await this.applicationService.saveApplicationLog({
        applicationId: appId,
        credential: appKeyToken || '',
        detailContent: dto.detailContent,
        message: dto.message,
        metadata: dto.metadata,
        logType: dto.logType,
        credentialId: dto.credentialId,
      });
      return savedResult;
    } catch (e) {
      this.logger.error('Failed executing saveLogToApplication() ', e);
      throw e;
    } finally {
      this.logger.log('Finished executing saveLogToApplication() ');
    }
  }

  // for getting logs in admin dashboard
  @Get('/:appId/logs')
  @UseInterceptors(
    new ResponseInterceptor({
      responseType: 'data',
    }),
  )
  @UseGuards(JwtGuard)
  async getApplicationLogs(
    @Param('appId') appId: string,
    @Request() req,
    @Query() queryData: GetLogsDto,
  ) {
    try {
      const result = await this.applicationService.getApplicationLogs({
        appId,
        ownerId: req.user ? req.user.uid : '',
        page: queryData.page,
        size: queryData.size,
      });
      return result;
    } catch (e) {
      this.logger.error('Failed executing getApplicationLogs() ', e);
      if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException('Unknown Error!');
    } finally {
      this.logger.log('Finished executing getAppicationLogs() ');
    }
  }
}
