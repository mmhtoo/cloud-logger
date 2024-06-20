import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

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
