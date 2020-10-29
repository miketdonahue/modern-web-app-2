export type Relationship = object & {
  id: string;
};

export type Relationships = {
  [key: string]: Relationship | Relationship[];
};

export interface Data<T = {}, U extends Relationships = {}> {
  attributes: T;
  relationships?: U;
  meta?: {
    [key: string]: any;
  };
}

export type ErrorResponse = {
  error: Error[];
};

export interface Error {
  status: string;
  code: string;
  detail: string;
  source?: {
    pointer?: string;
    parameter?: string;
  };
  links?: {
    about?: string;
  };
  meta?: {
    [key: string]: any;
  };
}

export type ApiResponseWithData<T = {}, U extends Relationships = {}> = {
  data: Data<T, U> | Data<T, U>[] | null | [];
  meta?: {
    [key: string]: any;
  };
};

export type ApiResponseWithError = {
  error: Error[];
  meta?: {
    [key: string]: any;
  };
};

export type NormalizedError = {
  statusCode: number;
  response: ApiResponseWithError;
};
