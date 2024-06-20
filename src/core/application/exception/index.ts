import {
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

export class InvalidApplicationException extends UnprocessableEntityException {
  constructor(message: string = 'Invalid Application Id!') {
    super(message);
  }
}

export class UnAuthorizedKeyActionException extends UnauthorizedException {
  constructor(message: string = 'Unauthorized to create key for target app!') {
    super(message);
  }
}
