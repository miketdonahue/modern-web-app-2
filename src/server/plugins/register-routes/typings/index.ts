import { Request, Response, NextFunction, Express } from 'express';

export interface Route {
  path: string | string[] | RegExp | RegExp[];
  middleware?: Middleware[];
  routes: Action[];
}

export interface Middleware {
  name: string;
  function: (req: Request, res: Response, next: NextFunction) => void;
}

export interface Action {
  path: string;
  page?: string;
  method?: string;
  middleware?: Middleware[];
  controller?: (req: Request, res: Response, next: NextFunction) => void;
}
