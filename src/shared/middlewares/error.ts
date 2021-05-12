import { Request, Response, NextFunction } from 'express';
import AppError from '../errors/AppError';

export default (
  err: Error,
  req: Request,
  res: Response,
  nxt: NextFunction,
): void => {
  if (err instanceof AppError) {
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
