type OneProp<T> = {
  [P in keyof T]-?: Record<P, T[P]>;
}[keyof T];

type RequireAtLeastOne<T> = T & OneProp<T>;

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

export interface Data {
  id: string;
  type: string;
  attributes?: {
    [key: string]: (string | number) & { relationships?: never; links?: never };
  };
  relationships?: {
    [key: string]: RequireAtLeastOne<Relationships>;
  };
  links?: RequireAtLeastOne<Links>;
  meta?: {
    [key: string]: any;
  };
}

interface RelationshipData {
  id: string;
  type: string;
  meta?: {
    [key: string]: any;
  };
}

interface Relationships {
  links?: Links;
  data?: RelationshipData | RelationshipData[] | null | [];
  meta?: {
    [key: string]: any;
  };
}

export interface Error {
  links?: {
    about?: string;
  };
  status?: string;
  code?: string;
  detail?: string;
  source?: {
    pointer?: string;
    parameter?: string;
  };
  meta?: {
    [key: string]: any;
  };
}

export type ApiResponseWithData = {
  data: Data | Data[] | null | [];
  meta?: {
    [key: string]: any;
  };
  links?: Links;
  included?: Data[];
};

export type ApiResponseWithError = {
  error: Error[];
  meta?: {
    [key: string]: any;
  };
};
