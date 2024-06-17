import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import GlobalExceptionFilter from './shared/exception-filter/global.exception.filter';
import { ValidationException } from './shared/exception';

function validationExceptionFactory(error: ValidationError[]) {
  const parsedError = error.reduce((prev, cur) => {
    prev[cur.property] = Object.keys(cur.constraints).map(
      (key) => cur.constraints[key as keyof typeof cur.constraints],
    );
    return prev;
  }, {});
  throw new ValidationException(parsedError, 'Validation Failed!');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // use validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: validationExceptionFactory,
    }),
  );

  // use global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // enable version endpoints
  app.enableVersioning();

  // set prefix
  app.setGlobalPrefix('/api');
  await app.listen(3000);
}
bootstrap();
