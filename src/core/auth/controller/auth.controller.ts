import {
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Logger,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SignInDto } from '../dto';
import AuthService from '../service/auth.service';
import { ResponseInterceptor } from 'src/shared/interceptor';
import JwtGuard from '../guard/jwt.guard';

@Controller({
  version: '1',
  path: 'auth',
})
export default class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @UseInterceptors(
    new ResponseInterceptor({
      responseType: 'data',
    }),
  )
  async signIn(@Body() dto: SignInDto) {
    try {
      this.logger.log(
        'Started executing AuthController->signIn() with param ',
        JSON.stringify(dto, null, 2),
      );
      const token = await this.authService.signInAccount(dto.email);
      return {
        access_token: token,
      };
    } catch (e) {
      this.logger.error('Failed executing AuthController->signIn() ', e);
      if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException('Unknown Error!');
    } finally {
      this.logger.log('Finished executing AuthController->signIn() ');
    }
  }

  @Get('whoami')
  @UseGuards(JwtGuard)
  @UseInterceptors(
    new ResponseInterceptor({
      responseType: 'data',
    }),
  )
  whoAmI(@Request() req: any) {
    try {
      this.logger.log('Started executing AuthController->whoAmI() ');
      return this.authService.getProfileData(req.user ? req.user.uid : '');
    } catch (e) {
      this.logger.error('Failed executing AuthController->whoAmI() ', e);
      throw e;
    } finally {
      this.logger.log('Finished executing AuthController->whoAmI() ');
    }
  }
}
