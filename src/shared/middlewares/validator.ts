import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { Request, Response, NextFunction, RequestHandler } from 'express';
import DTO from '../dtos/baseDto';
import BadRequestError from '../errors/BadRequest';

export default function validator(
  classDto: ClassConstructor<DTO>,
): RequestHandler {
  return async (req: Request, res: Response, nxt: NextFunction) => {
    const classPayload = plainToClass(classDto, req.body);
    const errors = await validate(classPayload);
    if (errors.length === 0) {
      nxt();
    } else {
      nxt(new BadRequestError(errors));
    }
  };
}
