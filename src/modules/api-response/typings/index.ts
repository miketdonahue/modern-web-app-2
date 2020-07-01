interface Link {
  href?: string;
  meta?: {
    [key: string]: any;
  };
}

interface Links {
  self?: string | Link;
  related?: string | Link;
  first?: string | Link;
  last?: string | Link;
  next?: string | Link;
  prev?: string | Link;
}

interface Data {
  id: string;
  type: string;
  attributes?: {
    [key: string]: string & { relationships?: never; links?: never };
  };
  relationships?: Pick<Relationships, 'links' | 'data' | 'meta'>;
  links?: Pick<Links, 'self' | 'related'>;
  meta?: {
    [key: string]: any;
  };
}

interface Relationships {
  links?: Links;
  data?: Data | Data[] | null | [];
  meta?: {
    [key: string]: any;
  };
}

interface Error {
  id?: string;
  links?: {
    about?: string;
  };
  status?: string;
  code?: string;
  title?: string;
  detail?: string;
  source?: {
    pointer?: string;
    parameter?: string;
  };
  meta?: {
    [key: string]: any;
  };
}

interface ApiResponseWithData {
  data: Data | Data[] | null | [];
  meta?: {
    [key: string]: any;
  };
  links?: Links;
  included?: Data[];
}

interface ApiResponseWithError {
  error: Error[];
  meta?: {
    [key: string]: any;
  };
}

export type ApiResponse = ApiResponseWithData | ApiResponseWithError;
