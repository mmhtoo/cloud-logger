import { LogType } from '@prisma/client';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateAppDto {
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsOptional()
  @MaxLength(300)
  description?: string;

  @IsOptional()
  @MaxLength(200)
  routeName?: string;
}

export class GetApplicationsDto {
  @IsNumberString()
  @IsOptional()
  page: number = 1;

  @IsNumberString()
  @IsOptional()
  size: number = 10;
}

export class CreateAppKeyDto {
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsOptional()
  @MaxLength(300)
  description?: string;
}

export class SaveLogDto {
  logType: LogType = LogType.INFO;

  @IsNotEmpty()
  @MaxLength(200)
  message: string;

  @MaxLength(500)
  detailContent: string;

  @MaxLength(1000)
  metadata: string;
}
