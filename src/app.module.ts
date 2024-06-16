import { Module } from '@nestjs/common';
import SharedModule from './shared/shared.module';
import InfraModule from './infra/infra.module';

@Module({
  imports: [SharedModule, InfraModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
