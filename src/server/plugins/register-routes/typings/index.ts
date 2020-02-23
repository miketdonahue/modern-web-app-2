import { Request, Response, NextFunction } from 'express';
import { Middleware } from '../../register-middleware/typings';

export interface Route {
  path: string | string[] | RegExp | RegExp[];
  middleware?: Middleware[];
  routes: Action[];
}

export interface Action {
  path: string;
  page?: string;
  method?: string;
  middleware?: Middleware[];
  controller?: (req: Request, res: Response, next: NextFunction) => void;
}
