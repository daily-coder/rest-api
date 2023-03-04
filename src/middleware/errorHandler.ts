import { NextFunction, Request, Response } from "express";

function errorHandler(
  err: Error & { statusCode?: number },
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { message = "Something went wrong", statusCode = 500 } = err;
  res.status(statusCode).send({ message });
}

export default errorHandler;
