import { Request, Response, NextFunction } from 'express';

export interface Middleware {
  name: string;
  function: (req: Request, res: Response, next: NextFunction) => void;
}
