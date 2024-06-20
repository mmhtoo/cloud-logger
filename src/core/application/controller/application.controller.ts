import {
  Body,
  Controller,
  HttpException,
  InternalServerErrorException,
  Logger,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import ApplicationService from '../service/application.service';
import { CreateAppDto } from '../dto';
import JwtGuard from 'src/core/auth/guard/jwt.guard';
import { ResponseInterceptor } from 'src/shared/interceptor';

@Controller({
  version: '1',
  path: 'apps',
})
export default class ApplicationController {
  private readonly logger = new Logger(ApplicationController.name);

  constructor(private readonly applicationService: ApplicationService) {}

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
}
