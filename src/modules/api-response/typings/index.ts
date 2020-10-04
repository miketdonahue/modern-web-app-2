export type Relationship = {
  id: string;
  attributes?: object;
};

export type Relationships = {
  [key: string]: Relationship | Relationship[];
};

export interface Data<T = {}, U extends Relationships = {}> {
  id: string;
  attributes?: T;
  relationships?: U;
  meta?: {
    [key: string]: any;
  };
}

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

export type ApiResponseWithData<T = {}> = {
  data: Data<T> | Data<T>[] | null | [];
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
