export interface Data<T = {}> {
  id: string;
  attributes?: T;
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
