import { BadRequestException } from '@nestjs/common';

export class ValidationException extends BadRequestException {
  constructor(error: Record<string, string[]>, message: string) {
    super(error, message);
  }
}
