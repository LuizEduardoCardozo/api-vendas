import { Request, Response, NextFunction } from 'express';
import AppError from '../errors/AppError';
import BadRequestError from '../errors/BadRequest';

export default (
  err: Error,
  req: Request,
  res: Response,
  nxt: NextFunction,
): void => {
  if (err instanceof BadRequestError) {
    res.status(err.getStatusCode()).send({
      errors: err.getMessage(),
    });
  } else if (err instanceof AppError) {
    res.status(err.getStatusCode()).send({
      errors: [
        {
          msg: err.getMessage(),
        },
      ],
    });
  } else {
    res.status(500).send({
      errors: [
        {
          msg: err.message,
        },
      ],
    });
  }
  nxt();
};
