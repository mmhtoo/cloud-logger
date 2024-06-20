import {
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import ApplicationService from '../service/application.service';
import { CreateAppDto, CreateAppKeyDto, GetApplicationsDto } from '../dto';
import JwtGuard from 'src/core/auth/guard/jwt.guard';
import { ResponseInterceptor } from 'src/shared/interceptor';

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
}
